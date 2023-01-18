"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slice = void 0;
const BywiseHelper_1 = require("../utils/BywiseHelper");
class Slice {
    constructor(slice) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        this.height = (_a = slice === null || slice === void 0 ? void 0 : slice.height) !== null && _a !== void 0 ? _a : 0;
        this.blockHeight = (_b = slice === null || slice === void 0 ? void 0 : slice.blockHeight) !== null && _b !== void 0 ? _b : 0;
        this.transactions = (_c = slice === null || slice === void 0 ? void 0 : slice.transactions) !== null && _c !== void 0 ? _c : [];
        this.transactionsCount = (_d = slice === null || slice === void 0 ? void 0 : slice.transactionsCount) !== null && _d !== void 0 ? _d : 0;
        this.version = (_e = slice === null || slice === void 0 ? void 0 : slice.version) !== null && _e !== void 0 ? _e : '';
        this.chain = (_f = slice === null || slice === void 0 ? void 0 : slice.chain) !== null && _f !== void 0 ? _f : '';
        this.from = (_g = slice === null || slice === void 0 ? void 0 : slice.from) !== null && _g !== void 0 ? _g : '';
        this.created = (_h = slice === null || slice === void 0 ? void 0 : slice.created) !== null && _h !== void 0 ? _h : 0;
        this.end = (_j = slice === null || slice === void 0 ? void 0 : slice.end) !== null && _j !== void 0 ? _j : false;
        this.lastBlockHash = (_k = slice === null || slice === void 0 ? void 0 : slice.lastBlockHash) !== null && _k !== void 0 ? _k : '';
        this.hash = (_l = slice === null || slice === void 0 ? void 0 : slice.hash) !== null && _l !== void 0 ? _l : '';
        this.sign = (_m = slice === null || slice === void 0 ? void 0 : slice.sign) !== null && _m !== void 0 ? _m : '';
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
        bytes += this.lastBlockHash;
        bytes = BywiseHelper_1.BywiseHelper.makeHash(bytes);
        return bytes;
    }
    isValid() {
        if (typeof this.height === 'number')
            throw new Error('invalid slice height ' + this.height);
        if (this.height < 0)
            throw new Error('invalid slice height ' + this.height);
        if (typeof this.blockHeight === 'number')
            throw new Error('invalid slice blockHeight ' + this.blockHeight);
        if (this.blockHeight < 0)
            throw new Error('invalid slice blockHeight ' + this.blockHeight);
        if (typeof this.transactionsCount === 'number')
            throw new Error('invalid slice transactionsCount ' + this.transactionsCount);
        if (this.transactionsCount >= 0)
            throw new Error('invalid slice transactionsCount ' + this.transactionsCount);
        if (this.transactions.length == 0)
            throw new Error('invalid slice length');
        for (let i = 0; i < this.transactions.length; i++) {
            let txHash = this.transactions[i];
            if (!BywiseHelper_1.BywiseHelper.isValidHash(txHash))
                throw new Error(`invalid tx hash ${i} - ${txHash}`);
        }
        if (this.version !== '2')
            throw new Error('invalid slice version ' + this.version);
        if (this.version == '2') {
            if (this.chain.length === 0)
                throw new Error('invalid slice chain cant be empty');
            if (!BywiseHelper_1.BywiseHelper.isValidAlfaNum(this.chain))
                throw new Error('invalid chain');
        }
        if (!BywiseHelper_1.BywiseHelper.isValidAddress(this.from))
            throw new Error('invalid slice from address ' + this.from);
        if (!BywiseHelper_1.BywiseHelper.isValidDate(this.created))
            throw new Error('invalid slice created date ' + this.created);
        if (this.end !== true && this.end !== false)
            throw new Error('invalid slice end flag ' + this.version);
        if (!BywiseHelper_1.BywiseHelper.isValidHash(this.lastBlockHash))
            throw new Error('invalid lastBlockHash ' + this.lastBlockHash);
        if (this.hash !== this.toHash())
            throw new Error(`invalid slice hash ${this.hash} ${this.toHash()}`);
        if (!BywiseHelper_1.BywiseHelper.isValidSign(this.sign, this.from, this.hash))
            throw new Error('invalid slice signature');
    }
}
exports.Slice = Slice;
