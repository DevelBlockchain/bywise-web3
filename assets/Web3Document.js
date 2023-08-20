import BigNumber from 'bignumber.js';
import BywiseUtils, { StorageValue, StorageList } from 'bywise-utils.js';

class Web3Document {

    _name = "";
    _owner;
    _publicInfo = new StorageValue({});
    _permissionedInfo = new StorageValue({});
    _privateInfo = new StorageValue({});
    _icon = new StorageValue('');
    _data = new StorageList();

    constructor() {
        this._owner = new StorageValue(BywiseUtils.getTxSender());
    }

    name() {  // @view
        return this._name;
    }

    owner() {  // @view
        return this._owner.get();
    }

    getPublicInfo() {  // @view
        return this._publicInfo.get();
    }

    getPermissionedInfo() {  // @view
        return this._permissionedInfo.get();
    }

    getPrivateInfo() {  // @view
        return this._privateInfo.get();
    }

    getIcon() {  // @view
        return this._icon.get();
    }

    countData() {  // @view
        return this._data.size();
    }

    getData(index, size) {  // @view
        this._isValidInteger(index);
        this._isValidInteger(size);

        if (parseInt(size) > 1000) throw new Error(`Web3Document: size cannot be greater than 1000`);
        if (parseInt(size) < 1) throw new Error(`Web3Document: invalid size`);

        index = new BigNumber(index);
        let limit = new BigNumber(size).plus(index).minus(1);
        let dataSize = new BigNumber(this._data.size()).minus(1);

        let data = [];
        while (!(index.isGreaterThan(limit) || index.isGreaterThan(dataSize))) {
            const tx = this._data.get(index);
            data.push(tx);
            index = index.plus(1);
        }
        return data;
    }

    addHash(hash) {
        this._isOwner();
        this._data.push(hash);
        return true;
    }

    setIcon(icon) {
        this._isOwner();
        this._icon.set(icon);
        return true;
    }

    setPrivateInfo(key, value) {
        this._isOwner();
        const info = this._privateInfo.get();
        info[key] = value;
        this._privateInfo.set(info);

        BywiseUtils.emit('Set Private Info', {
            key,
            value
        });
        return true;
    }

    setPermissionedInfo(key, value) {
        this._isOwner();
        const info = this._permissionedInfo.get();
        info[key] = value;
        this._permissionedInfo.set(info);

        BywiseUtils.emit('Set Permissioned Info', {
            key,
            value
        });
        return true;
    }

    setPublicInfo(key, value) {
        this._isOwner();
        const info = this._publicInfo.get();
        info[key] = value;
        this._publicInfo.set(info);

        BywiseUtils.emit('Set Public Info', {
            key,
            value
        });
        return true;
    }

    changeOwner(newOwner) {
        this._isOwner();
        this._isValidAddress(newOwner);

        const oldOwner = this._owner.get();
        this._owner.set(newOwner);

        BywiseUtils.emit('New Owner', {
            oldOwner: oldOwner,
            newOwner: newOwner,
        });
    }

    _isOwner() { // @private
        if (BywiseUtils.getTxSender() !== this._owner.get()) throw new Error('Web3Document: Only Owner');
    }

    _isValidInteger(value) { // @private
        if (! /^[0-9]{1,36}$/.test(value)) {
            throw new Error(`Web3Document: invalid value - ${value}`);
        }
    }

    _isValidHash(hash) { // @private
        if (! /^[0-9a-fA-F]{64}$/.test(hash)) {
            throw new Error(`Web3Document: invalid hash - ${hash}`);
        }
    }

    _isValidAddress(value) { // @private
        if (! /^(BWS[0-9A-Z]+[0-9a-fA-F]{0,43})$/.test(value)) {
            throw new Error(`Web3Document: invalid address - ${value}`);
        }
    }
}

BywiseUtils.exportContract(new Web3Document());