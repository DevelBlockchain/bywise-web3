import BywiseUtils, { StorageValue, StorageMap, StorageList } from 'bywise-utils.js';

const ETH_ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';
const BWS_ZERO_ADDRESS = 'BWS000000000000000000000000000000000000000000000';

class Bridge {

    _owner;
    _actionAddress = new StorageMap(ETH_ZERO_ADDRESS);
    _actionAddressDepositsCount = new StorageMap('0');
    _tokens = new StorageMap(BWS_ZERO_ADDRESS);
    _tokensBWS = new StorageMap(BWS_ZERO_ADDRESS);
    _tokensERC20 = new StorageMap();
    _balances = new StorageMap('0');

    constructor() {
        this._owner = new StorageValue(BywiseUtils.getTxSender());
        this._actionAddress.set('tBNB', '0xa425840D9532eb5423d4514c95c06B7006BA8a8a');
    }

    owner() {  // @view
        return this._owner.get();
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

    getActionAddress(network) { // @view
        const actionAddress = this._actionAddress.get(network);
        return actionAddress;
    }

    setActionAddress(network, actionAddress) {
        this._isOwner();
        this._isValidETHAddress(actionAddress);

        this._actionAddress.set(network, actionAddress);

        BywiseUtils.emit('Set Action Address', { network, actionAddress });
        return true;
    }

    getDepositAddress(network, address) { // @view
        const actionAddress = this._getActionAddress(network);
        this._isValidAddress(address);
        const proxyData = {
            values: ["3"],
            strings: [address],
        }
        return BywiseUtils.read(network, actionAddress, proxyData);
    }

    newDepositAddress(network) {
        const sender = BywiseUtils.getTxSender();
        const actionAddress = this._getActionAddress(network);

        const proxyData = {
            values: ["6"],
            strings: [sender],
        }
        return BywiseUtils.write(network, actionAddress, proxyData);
    }

    getToken(symbol) { // @view
        this._isValidSymbol(symbol);
        return this._tokens.get(symbol);
    }

    setToken(symbol, bws20Token) {
        this._isOwner();
        this._isValidSymbol(symbol);
        this._isValidAddress(bws20Token);

        this._tokens.set(symbol, bws20Token);
        if (!this._tokensERC20.has(symbol)) {
            this._tokensERC20.set(symbol, new StorageMap(ETH_ZERO_ADDRESS));
        }
        return true;
    }

    getCrosschainAddress(symbol, network) { // @view
        this._isValidSymbol(symbol);
        this._hasToken(symbol);
        this._getActionAddress(network);
        this._isValidAddress(bts20Token);

        return this._tokensERC20.getStorageMap(symbol).get(network);
    }

    setCrosschainAddress(symbol, network, erc20Token) {
        this._isOwner();
        this._isValidSymbol(symbol);
        this._hasToken(symbol);
        this._getActionAddress(network);
        this._isValidETHAddress(erc20Token);

        this._tokensERC20.getStorageMap(symbol).set(network, erc20Token);
        this._tokensBWS.set(erc20Token, symbol);
        return true;
    }

    getTokenBalance(symbol, network, address) { // @view
        this._isValidSymbol(symbol);
        this._hasToken(symbol);
        const actionAddress = this._getActionAddress(network);
        this._isValidAddress(address);

        const erc20Token = this._tokensERC20.getStorageMap(symbol).get(network);

        const proxyData = {
            values: ["1"],
            strings: [address],
            addresses: [erc20Token],
        }
        const balance = BywiseUtils.read(network, actionAddress, proxyData);
        return balance;
    }

    getETHBalance(network, address) { // @view
        const actionAddress = this._getActionAddress(network);
        this._isValidAddress(address);

        const proxyData = {
            values: ["1"],
            strings: [address],
            addresses: [ETH_ZERO_ADDRESS],
        }
        const balance = BywiseUtils.read(network, actionAddress, proxyData);
        return balance;
    }

    bringTokenDepositToBywise(symbol, network, address) {
        this._isValidSymbol(symbol);
        this._hasToken(symbol);
        const actionAddress = this._getActionAddress(network);
        this._isValidAddress(address);

        const erc20Token = this._tokensERC20.getStorageMap(symbol).get(network);

        const proxyData = {
            values: ["6"],
            strings: [address],
            addresses: [erc20Token],
        }
        return BywiseUtils.write(network, actionAddress, proxyData);
    }

    bringETHDepositToBywise(network, address) {
        const actionAddress = this._getActionAddress(network);
        this._isValidAddress(address);

        const proxyData = {
            values: ["6"],
            strings: [address],
            addresses: [ETH_ZERO_ADDRESS],
        }
        return BywiseUtils.write(network, actionAddress, proxyData);
    }

    updateDeposits(network) {
        const actionAddress = this._getActionAddress(network);

        let proxyData = {
            values: ["4"]
        }
        const depositCount = parseInt(BywiseUtils.read(network, actionAddress, proxyData));
        const lastDepositCount = parseInt(this._actionAddressDepositsCount.get(actionAddress));

        if (depositCount === lastDepositCount) throw new Error(`Bridge: not has new deposits`);

        for (let i = lastDepositCount; i < depositCount; i++) {
            let proxyData = {
                values: ["5", `${i}`]
            }
            const { token, account, bwsAddress, amount } = JSON.parse(BywiseUtils.read(network, actionAddress, proxyData));

            const symbol = this._tokensBWS.get(token);
            const bws20Token = this._tokens.get(symbol)
            const BST20 = BywiseUtils.getContract(bws20Token, ['transfer']);

            BST20.transfer(bwsAddress, amount);

            BywiseUtils.emit('Transfers', {
                token,
                recipient,
                amount,
            });
        }

        this._actionAddressDepositsCount.set(actionAddress, depositCount);

        const tx = BywiseUtils.getTx();
        const sender = BywiseUtils.getTxSender();
        const feeBWS = tx.fee;
        
        if (tx.to.length !== 1) throw new Error('Bridge: Invalid Transaction');
        BywiseUtils.transfer(sender, feeBWS);
    }

    _transferToNetwork(symbol, network, ethAdress, amount) { // @private
        this._isValidSymbol(symbol);
        this._hasToken(symbol);
        this._getActionAddress(network);
        this._isValidETHAddress(ethAdress);
        this._isValidInteger(amount);

        const actionAddress = this._getActionAddress(network);
        this._isValidAddress(address);

        const erc20Token = this._tokensERC20.getStorageMap(symbol).get(network);

        const proxyData = {
            values: ["0", amount],
            addresses: [erc20Token, ethAdress],
        }
        return BywiseUtils.write(network, actionAddress, proxyData);
    }

    _getActionAddress(network) { // @private
        const actionAddress = this._actionAddress.get(network);
        if (actionAddress === ETH_ZERO_ADDRESS) throw new Error(`Bridge: Invalid network ${network}`);
        return actionAddress;
    }

    _isValidInteger(value) { // @private
        if (! /^[0-9]{1,36}$/.test(value)) {
            throw new Error(`Bridge: invalid value - ${value}`);
        }
    }

    _isValidAddress(value) { // @private
        if (! /^(BWS[0-9A-Z]+[0-9a-fA-F]{0,43})$/.test(value)) {
            throw new Error(`Bridge: invalid address - ${value}`);
        }
    }

    _isValidETHAddress(value) { // @private
        if (! /^(0x[0-9a-fA-F]{0,36})$/.test(value)) {
            throw new Error(`Bridge: invalid address - ${value}`);
        }
    }

    _isValidSymbol(value) { // @private
        if (! /^([0-9A-Za-z_]{1,20})$/.test(value)) {
            throw new Error(`Bridge: invalid token symbol - ${value}`);
        }
    }

    _hasToken(symbol) { // @private
        if (!this._tokensERC20.has(symbol)) throw new Error(`Bridge: token ${symbol} not registered`);
    }

    _isOwner() { // @private
        if (BywiseUtils.getTxSender() !== this._owner.get()) throw new Error('Bridge: Only Owner');
    }
}

BywiseUtils.exportContract(new Bridge());