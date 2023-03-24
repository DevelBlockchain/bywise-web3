import BigNumber from 'bignumber.js';
import BywiseUtils, { StorageValue, StorageMap } from 'bywise-utils.js';

class Market {

    _owner;
    _minimumDeposit = new StorageValue('5000');
    _hasToken = new StorageMap('false');
    _feeCoef = new StorageMap('0');
    _tokenBalanceBWS = new StorageMap('0');
    _tokenBalance = new StorageMap('0');
    _tokenDecimals = new StorageMap('0');
    _tokenInfo = new StorageMap();

    constructor() {
        this._owner = new StorageValue(BywiseUtils.getTxSender());
    }

    hasToken(token) { // @view
        this._isValidAddress(token);
        return this._hasToken.get(token) === 'true';
    }

    getInfo(token) { // @view
        this._isValidAddress(token);
        return this._tokenInfo.get(token);
    }

    getBalance(token) { // @view
        this._isValidAddress(token);
        return this._tokenBalance.get(token);
    }

    getBalanceBWS(token) { // @view
        this._isValidAddress(token);
        return this._tokenBalanceBWS.get(token);
    }

    getCoef(token) { // @view
        this._isValidAddress(token);
        return this._feeCoef.get(token);
    }

    owner() { // @view
        return this._owner.get();
    }

    simulateFee(token, feeBWS) { // @view
        this._isValidAddress(token);
        if (!this.hasToken(token)) throw new Error('Market: Token not registered');
        const coef = this._feeCoef.getBigNumber(token);
        const decimals = this._tokenDecimals.getBigNumber(token);
        const tokenFee = coef.multipliedBy(new BigNumber(feeBWS)).multipliedBy(decimals).toFixed(0);
        return tokenFee;
    }

    registerNewToken(token, coef) {
        this._isValidAddress(token);
        this._isValidNumber(coef);
        if (this.hasToken(token)) throw new Error('Market: Token already registered');

        const deposit = BywiseUtils.getTxAmount();
        const min = this._minimumDeposit.getBigNumber();
        if (deposit.isLessThan(min)) throw new Error(`Market: Need a minimum deposit of ${min} BWS`);

        const BST20 = BywiseUtils.getContract(token, ['decimals']);
        const decimals = BST20.decimals();

        this._hasToken.set(token, 'true');
        this._feeCoef.set(token, coef);
        this._tokenDecimals.set(token, 10 ** parseInt(decimals));
        this._tokenBalanceBWS.set(token, deposit);
        this._tokenBalance.set(token, '0');

        BywiseUtils.emit('Register New Token', {
            token,
            coef,
        });
        return true;
    }

    setCoef(token, coef) {
        this._isValidAddress(token);
        this._isValidNumber(coef);
        if (!this.hasToken(token)) throw new Error('Market: Token not registered');

        const BST20 = BywiseUtils.getContract(token, ['transfer', 'owner']);
        const owner = BST20.owner();
        if (BywiseUtils.getTxSender() !== owner) throw new Error('Market: Only Token Owner');

        this._feeCoef.set(token, coef);

        BywiseUtils.emit('Change Fee', {
            token,
            coef,
        });
    }

    depositBWS(token) {
        this._isValidAddress(token);
        if (!this.hasToken(token)) throw new Error('Market: Token not registered');

        const deposit = BywiseUtils.getTxAmount();
        const balance = this._tokenBalanceBWS.getBigNumber(token);
        this._tokenBalanceBWS.set(token, balance.plus(deposit));

        BywiseUtils.emit('Deposit BWS Token', {
            token,
            deposit,
        });
    }

    withdrawToken(token, recipient) {
        this._isValidAddress(token);
        this._isValidAddress(recipient);
        if (!this.hasToken(token)) throw new Error('Market: Token not registered');

        const BST20 = BywiseUtils.getContract(token, ['transfer', 'owner']);
        const owner = BST20.owner();
        if (BywiseUtils.getTxSender() !== owner) throw new Error('Market: Only Token Owner');

        const amount = this._tokenBalance.get(token);
        BST20.transfer(recipient, amount);

        this._tokenBalance.set(token, '0');

        BywiseUtils.emit('Withdraw', {
            token,
            recipient,
            amount,
        });
    }

    payFee(token) {
        const tx = BywiseUtils.getTx();
        const feeBWS = tx.fee;

        const tokenFee = this.simulateFee(token, feeBWS);

        const sender = BywiseUtils.getTxSender();
        const marketAddress = BywiseUtils.getThisAddress();
        
        const BST20 = BywiseUtils.getContract(token, ['transferFrom']);
        BST20.transferFrom(sender, marketAddress, tokenFee);
        
        let balanceBWS = this._tokenBalanceBWS.getBigNumber(token);
        let balance = this._tokenBalance.getBigNumber(token);

        balanceBWS = balanceBWS.minus(feeBWS);
        balance = balance.plus(tokenFee);

        BywiseUtils.transfer(sender, feeBWS);

        if (balanceBWS.isLessThan(new BigNumber('0'))) throw new Error(`Market: Disabled for this token`);

        this._tokenBalanceBWS.set(token, balanceBWS);
        this._tokenBalance.set(token, balance);

        BywiseUtils.emit('Pay Fee', {
            token,
            feeBWS,
            tokenFee
        });
        return tokenFee;
    }

    setMinimumDeposit(amount) {
        this._isOwner();
        this._isValidInteger(amount);

        this._minimumDeposit.set(amount);

        BywiseUtils.emit('Set Minimum Deposit', {
            fixed,
            percent,
            fixed,
        });
    }

    setTokenInfo(token, info) {
        this._isOwner();

        this._tokenInfo.set(token, info);

        BywiseUtils.emit('Set Token Info', { token, info });
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
        if (BywiseUtils.getTxSender() !== this._owner.get()) throw new Error('Market: Only Owner');
    }

    _isValidInteger(value) { // @private
        if (! /^[0-9]{1,36}$/.test(value)) {
            throw new Error(`Market: invalid value - ${value}`);
        }
    }

    _isValidNumber(value) { // @private
        if (! /^[0-9]{1,18}(\.[0-9]{1,18})?$/.test(value)) {
            throw new Error(`Market: invalid number - ${value}`);
        }
    }

    _isValidAddress(value) { // @private
        if (! /^(BWS[0-9A-Z]+[0-9a-fA-F]{0,43})$/.test(value)) {
            throw new Error(`Market: invalid address - ${value}`);
        }
    }
}

BywiseUtils.exportContract(new Market());