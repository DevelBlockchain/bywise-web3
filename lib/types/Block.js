"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const BywiseHelper_1 = require("../utils/BywiseHelper");
class Block {
    constructor(block) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.height = (_a = block === null || block === void 0 ? void 0 : block.height) !== null && _a !== void 0 ? _a : 0;
        this.slices = (_b = block === null || block === void 0 ? void 0 : block.slices) !== null && _b !== void 0 ? _b : [];
        this.version = (_c = block === null || block === void 0 ? void 0 : block.version) !== null && _c !== void 0 ? _c : '';
        this.chain = (_d = block === null || block === void 0 ? void 0 : block.chain) !== null && _d !== void 0 ? _d : '';
        this.from = (_e = block === null || block === void 0 ? void 0 : block.from) !== null && _e !== void 0 ? _e : '';
        this.created = (_f = block === null || block === void 0 ? void 0 : block.created) !== null && _f !== void 0 ? _f : '';
        this.lastHash = (_g = block === null || block === void 0 ? void 0 : block.lastHash) !== null && _g !== void 0 ? _g : '';
        this.hash = (_h = block === null || block === void 0 ? void 0 : block.hash) !== null && _h !== void 0 ? _h : '';
        this.sign = (_j = block === null || block === void 0 ? void 0 : block.sign) !== null && _j !== void 0 ? _j : '';
        this.externalTxID = (_k = block === null || block === void 0 ? void 0 : block.externalTxID) !== null && _k !== void 0 ? _k : [];
    }
    getMerkleRoot() {
        let merkleRoot = '';
        if (this.slices.length > 0) {
            this.slices.forEach(sliceHash => {
                merkleRoot += sliceHash;
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
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        if (this.version == '2') {
            bytes += Buffer.from(this.chain, 'utf-8').toString('hex');
        }
        bytes += Buffer.from(this.from, 'utf-8').toString('hex');
        if (this.version == '1') {
            bytes += Buffer.from(this.from, 'utf-8').toString('hex'); // nextSlice
            bytes += Buffer.from(this.from, 'utf-8').toString('hex'); // nextBlock
        }
        bytes += Buffer.from(this.created, 'utf-8').toString('hex');
        bytes += this.getMerkleRoot();
        bytes += this.lastHash;
        bytes = BywiseHelper_1.BywiseHelper.makeHash(bytes);
        return bytes;
    }
    isValid() {
        if (this.height < 0)
            throw new Error('invalid block height ' + this.height);
        for (let i = 0; i < this.slices.length; i++) {
            let sliceHash = this.slices[i];
            if (!BywiseHelper_1.BywiseHelper.isValidHash(sliceHash))
                throw new Error(`invalid slice hash ${i} - ${sliceHash}`);
        }
        if (this.version !== '1' && this.version !== '2')
            throw new Error('invalid block version ' + this.version);
        if (this.version == '2') {
            if (this.chain.length === 0)
                throw new Error('invalid block chain cant be empty');
            if (!BywiseHelper_1.BywiseHelper.isValidAlfaNum(this.chain))
                throw new Error('invalid chain');
        }
        if (!BywiseHelper_1.BywiseHelper.isValidAddress(this.from))
            throw new Error('invalid block from address ' + this.from);
        if (!BywiseHelper_1.BywiseHelper.isValidDate(this.created))
            throw new Error('invalid block created date ' + this.created);
        if (!BywiseHelper_1.BywiseHelper.isValidHash(this.lastHash))
            throw new Error('invalid lastHash ' + this.lastHash);
        if (this.hash !== this.toHash())
            throw new Error(`invalid block hash ${this.hash} ${this.toHash()}`);
        if (!BywiseHelper_1.BywiseHelper.isValidSign(this.sign, this.from, this.hash))
            throw new Error('invalid block signature');
    }
}
exports.Block = Block;
