"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slice = void 0;
const BywiseHelper_1 = require("../utils/BywiseHelper");
class Slice {
    constructor(slice) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        this.height = (_a = slice === null || slice === void 0 ? void 0 : slice.height) !== null && _a !== void 0 ? _a : 0;
        this.blockHeight = (_b = slice === null || slice === void 0 ? void 0 : slice.blockHeight) !== null && _b !== void 0 ? _b : 0;
        this.transactions = (_c = slice === null || slice === void 0 ? void 0 : slice.transactions) !== null && _c !== void 0 ? _c : [];
        this.transactionsCount = (_d = slice === null || slice === void 0 ? void 0 : slice.transactionsCount) !== null && _d !== void 0 ? _d : 0;
        this.transactionsData = slice === null || slice === void 0 ? void 0 : slice.transactionsData;
        this.version = (_e = slice === null || slice === void 0 ? void 0 : slice.version) !== null && _e !== void 0 ? _e : '';
        this.chain = (_f = slice === null || slice === void 0 ? void 0 : slice.chain) !== null && _f !== void 0 ? _f : '';
        this.from = (_g = slice === null || slice === void 0 ? void 0 : slice.from) !== null && _g !== void 0 ? _g : '';
        this.created = (_h = slice === null || slice === void 0 ? void 0 : slice.created) !== null && _h !== void 0 ? _h : 0;
        this.end = (_j = slice === null || slice === void 0 ? void 0 : slice.end) !== null && _j !== void 0 ? _j : false;
        this.hash = (_k = slice === null || slice === void 0 ? void 0 : slice.hash) !== null && _k !== void 0 ? _k : '';
        this.sign = (_l = slice === null || slice === void 0 ? void 0 : slice.sign) !== null && _l !== void 0 ? _l : '';
    }
    getMerkleRoot() {
        let merkleRoot = '';
        if (this.transactions.length > 0) {
            this.transactions.forEach(txHash => {
                merkleRoot += txHash;
            });
            merkleRoot = BywiseHelper_1.BywiseHelper.makeHash(merkleRoot);
        }
        else {
            merkleRoot = '0000000000000000000000000000000000000000000000000000000000000000';
        }
        return merkleRoot;
    }
    getMerkleRootData() {
        let merkleRoot = '';
        if (this.transactionsData && this.transactionsData.length > 0) {
            this.transactionsData.forEach(txData => {
                merkleRoot += txData.hash;
                txData.data.forEach(data => {
                    merkleRoot += Buffer.from(data, 'utf-8').toString('hex');
                });
            });
            merkleRoot = BywiseHelper_1.BywiseHelper.makeHash(merkleRoot);
        }
        return merkleRoot;
    }
    toHash() {
        let bytes = '';
        bytes += BywiseHelper_1.BywiseHelper.numberToHex(this.height);
        bytes += BywiseHelper_1.BywiseHelper.numberToHex(this.blockHeight);
        bytes += BywiseHelper_1.BywiseHelper.numberToHex(this.transactionsCount);
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        bytes += Buffer.from(this.chain, 'utf-8').toString('hex');
        bytes += Buffer.from(this.from, 'utf-8').toString('hex');
        bytes += BywiseHelper_1.BywiseHelper.numberToHex(this.created);
        bytes += Buffer.from(this.end ? 'true' : 'false', 'utf-8').toString('hex');
        bytes += this.getMerkleRoot();
        bytes += this.getMerkleRootData();
        bytes = BywiseHelper_1.BywiseHelper.makeHash(bytes);
        return bytes;
    }
    isValid() {
        if (!BywiseHelper_1.BywiseHelper.isValidInteger(this.height))
            throw new Error('invalid slice height');
        if (!BywiseHelper_1.BywiseHelper.isValidInteger(this.blockHeight))
            throw new Error('invalid slice blockHeight');
        if (!BywiseHelper_1.BywiseHelper.isValidInteger(this.transactionsCount))
            throw new Error('invalid slice transactionsCount');
        if (!BywiseHelper_1.BywiseHelper.isStringArray(this.transactions))
            throw new Error('invalid array');
        if (this.transactions.length === 0)
            throw new Error('invalid slice length');
        if (this.transactions.length !== this.transactionsCount)
            throw new Error('invalid slice length');
        for (let i = 0; i < this.transactions.length; i++) {
            let txHash = this.transactions[i];
            if (!BywiseHelper_1.BywiseHelper.isValidHash(txHash))
                throw new Error(`invalid tx hash ${i} - ${txHash}`);
        }
        if (this.transactionsData) {
            if (this.transactionsData.length > this.transactions.length)
                throw new Error('invalid slice transactionsData length');
            for (let i = 0; i < this.transactionsData.length; i++) {
                let data = this.transactionsData[i];
                if (!BywiseHelper_1.BywiseHelper.isValidHash(data.hash))
                    throw new Error(`invalid dataTx hash ${i} - ${data.hash}`);
                if (!BywiseHelper_1.BywiseHelper.isStringArray(data.data))
                    throw new Error(`invalid dataTx data ${i} - ${data.hash}`);
            }
        }
        if (this.version !== '1' && this.version !== '2')
            throw new Error('invalid version');
        if (this.version == '2') {
            if (this.chain.length === 0)
                throw new Error('invalid slice chain cant be empty');
            if (!BywiseHelper_1.BywiseHelper.isValidAlfaNum(this.chain))
                throw new Error('invalid chain');
        }
        if (!BywiseHelper_1.BywiseHelper.isValidAddress(this.from))
            throw new Error('invalid slice from address ' + this.from);
        if (!BywiseHelper_1.BywiseHelper.isValidDate(this.created))
            throw new Error('invalid created date');
        if (this.end !== true && this.end !== false)
            throw new Error('invalid slice end flag');
        if (this.hash !== this.toHash())
            throw new Error(`corrupt transaction`);
        if (!BywiseHelper_1.BywiseHelper.isValidSign(this.sign, this.from, this.hash))
            throw new Error('invalid slice signature');
    }
}
exports.Slice = Slice;
