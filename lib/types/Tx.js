"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tx = exports.TxType = void 0;
const BywiseHelper_1 = require("../utils/BywiseHelper");
var TxType;
(function (TxType) {
    TxType["TX_NONE"] = "none";
    TxType["TX_JSON"] = "json";
    TxType["TX_COMMAND"] = "command";
    TxType["TX_COMMAND_INFO"] = "command-info";
    TxType["TX_CONTRACT"] = "contract";
    TxType["TX_CONTRACT_EXE"] = "contract-exe";
    TxType["TX_FILE"] = "file";
    TxType["TX_STRING"] = "string";
    TxType["TX_EN_JSON"] = "json-encrypt";
    TxType["TX_EN_COMMAND"] = "command-encrypt";
    TxType["TX_EN_CONTRACT"] = "contract-encrypt";
    TxType["TX_EN_CONTRACT_EXE"] = "contract-exe-encrypt";
    TxType["TX_EN_FILE"] = "file-encrypt";
    TxType["TX_EN_STRING"] = "string-encrypt";
})(TxType = exports.TxType || (exports.TxType = {}));
class Tx {
    constructor(tx) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        this.version = (_a = tx === null || tx === void 0 ? void 0 : tx.version) !== null && _a !== void 0 ? _a : '';
        this.validator = tx === null || tx === void 0 ? void 0 : tx.validator;
        this.from = (_b = tx === null || tx === void 0 ? void 0 : tx.from) !== null && _b !== void 0 ? _b : [];
        this.to = (_c = tx === null || tx === void 0 ? void 0 : tx.to) !== null && _c !== void 0 ? _c : [];
        this.amount = (_d = tx === null || tx === void 0 ? void 0 : tx.amount) !== null && _d !== void 0 ? _d : [];
        this.tag = (_e = tx === null || tx === void 0 ? void 0 : tx.tag) !== null && _e !== void 0 ? _e : '';
        this.fee = (_f = tx === null || tx === void 0 ? void 0 : tx.fee) !== null && _f !== void 0 ? _f : '';
        this.type = (_g = tx === null || tx === void 0 ? void 0 : tx.type) !== null && _g !== void 0 ? _g : TxType.TX_NONE;
        this.foreignKeys = tx === null || tx === void 0 ? void 0 : tx.foreignKeys;
        this.data = (_h = tx === null || tx === void 0 ? void 0 : tx.data) !== null && _h !== void 0 ? _h : {};
        this.created = (_j = tx === null || tx === void 0 ? void 0 : tx.created) !== null && _j !== void 0 ? _j : '';
        this.hash = (_k = tx === null || tx === void 0 ? void 0 : tx.hash) !== null && _k !== void 0 ? _k : '';
        this.validatorSign = tx === null || tx === void 0 ? void 0 : tx.validatorSign;
        this.sign = (_l = tx === null || tx === void 0 ? void 0 : tx.sign) !== null && _l !== void 0 ? _l : [];
    }
    toHash() {
        let bytes = '';
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        if (this.validator) {
            bytes += Buffer.from(this.validator, 'utf-8').toString('hex');
        }
        this.from.forEach(from => {
            bytes += Buffer.from(from, 'utf-8').toString('hex');
        });
        this.to.forEach(to => {
            bytes += Buffer.from(to, 'utf-8').toString('hex');
        });
        this.amount.forEach(amount => {
            bytes += Buffer.from(amount, 'utf-8').toString('hex');
        });
        bytes += Buffer.from(this.tag, 'utf-8').toString('hex');
        bytes += Buffer.from(this.fee, 'utf-8').toString('hex');
        bytes += Buffer.from(this.type, 'utf-8').toString('hex');
        bytes += Buffer.from(BywiseHelper_1.BywiseHelper.jsonToString(this.data), 'utf-8').toString('hex');
        if (this.foreignKeys) {
            this.foreignKeys.forEach(key => {
                bytes += Buffer.from(key, 'utf-8').toString('hex');
                ;
            });
        }
        bytes += Buffer.from(this.created, 'utf-8').toString('hex');
        bytes = BywiseHelper_1.BywiseHelper.makeHash(bytes);
        return bytes;
    }
    isValid() {
        if (this.version !== '1')
            throw new Error('invalid version ' + this.version);
        if (this.validator && !BywiseHelper_1.BywiseHelper.isValidAddress(this.validator))
            throw new Error('invalid transaction validator address ' + this.validator);
        if (this.from.length === 0)
            throw new Error('invalid transaction sender cant be empty');
        if (this.from.length > 100)
            throw new Error('maximum number of senders is 100 signatures');
        this.from.forEach(from => {
            if (!BywiseHelper_1.BywiseHelper.isValidAddress(from))
                throw new Error('invalid transaction sender address ' + from);
        });
        let tag = '';
        if (this.to.length === 0)
            throw new Error('invalid transaction recipient cant be empty');
        if (this.to.length > 100)
            throw new Error('maximum number of recipient is 100');
        this.to.forEach((to, i) => {
            if (!BywiseHelper_1.BywiseHelper.isValidAddress(to))
                throw new Error('invalid transaction recipient address ' + to);
            if (i === 0) {
                tag = BywiseHelper_1.BywiseHelper.getAddressTag(to);
            }
        });
        if (this.tag !== tag)
            throw new Error('invalid tag ' + this.tag);
        if (this.amount.length === 0)
            throw new Error('invalid transaction amount cant be empty');
        if (this.amount.length !== this.to.length)
            throw new Error('to field must be the same length as amount');
        this.amount.forEach(amount => {
            if (!BywiseHelper_1.BywiseHelper.isValidAmount(amount))
                throw new Error('invalid transaction amount ' + amount);
        });
        if (!BywiseHelper_1.BywiseHelper.isValidAmount(this.fee))
            throw new Error('invalid transaction fee ' + this.fee);
        if (!Object.values(TxType).includes(this.type))
            throw new Error('invalid type ' + this.type);
        if (this.foreignKeys) {
            if (this.to.length > 100)
                throw new Error('maximum number of foreignKeys is 100');
            this.foreignKeys.forEach(key => {
                if (!BywiseHelper_1.BywiseHelper.isValidAlfaNum(key))
                    throw new Error('invalid foreignKey ' + key);
            });
        }
        if (BywiseHelper_1.BywiseHelper.jsonToString(this.data).length > 1048576)
            throw new Error('data too large ' + BywiseHelper_1.BywiseHelper.jsonToString(this.data).length);
        if (!BywiseHelper_1.BywiseHelper.isValidDate(this.created))
            throw new Error('invalid created date ' + this.created);
        if (!BywiseHelper_1.BywiseHelper.isValidHash(this.hash))
            throw new Error('invalid transaction hash ' + this.hash);
        if (this.hash !== this.toHash())
            throw new Error('calculated hash is different from the informed hash');
        if (this.validator) {
            if (!this.validatorSign)
                throw new Error('validator sign cant be empty');
            if (!BywiseHelper_1.BywiseHelper.isValidSign(this.validatorSign, this.validator, this.hash))
                throw new Error('invalid validator signature');
        }
        else {
            if (this.validatorSign)
                throw new Error('validator address cant be empty');
        }
        if (this.sign.length === 0)
            throw new Error('invalid transaction sign cant be empty');
        if (this.sign.length !== this.from.length)
            throw new Error('from field must be the same length as sign');
        for (let i = 0; i < this.sign.length; i++) {
            const sign = this.sign[i];
            const fromAddress = this.from[i];
            if (!BywiseHelper_1.BywiseHelper.isValidSign(sign, fromAddress, this.hash))
                throw new Error('invalid signature from address ' + fromAddress);
        }
    }
}
exports.Tx = Tx;
