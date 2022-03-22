"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Block = void 0;
const Helper_1 = __importDefault(require("../utils/Helper"));
class Block {
    constructor() {
        this.height = 0;
        this.numberOfSlices = 0;
        this.slices = [];
        this.version = '';
        this.from = '';
        this.created = '';
        this.merkleRoot = '';
        this.lastHash = '';
        this.hash = '';
        this.sign = '';
        this.externalTxID = [];
    }
    getMerkleRoot() {
        let merkleRoot = '';
        if (this.slices.length > 0) {
            this.slices.forEach(sliceHash => {
                merkleRoot += sliceHash;
            });
            merkleRoot = Helper_1.default.makeHash(merkleRoot);
        }
        else {
            merkleRoot = '0000000000000000000000000000000000000000000000000000000000000000';
        }
        return merkleRoot;
    }
    toHash() {
        let bytes = '';
        bytes += Helper_1.default.numberToHex(this.height);
        bytes += Helper_1.default.numberToHex(this.numberOfSlices);
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        bytes += Buffer.from(this.from, 'utf-8').toString('hex');
        bytes += Buffer.from(this.created, 'utf-8').toString('hex');
        bytes += this.merkleRoot;
        bytes += this.lastHash;
        bytes = Helper_1.default.makeHash(bytes);
        return bytes;
    }
    isValid() {
        if (this.height < 0)
            throw new Error('invalid block height ' + this.height);
        if (this.numberOfSlices < 0)
            throw new Error('invalid numberOfSlices ' + this.numberOfSlices);
        if (this.slices.length !== this.numberOfSlices)
            throw new Error('invalid slice length ' + this.slices.length + ' ' + this.numberOfSlices);
        for (let i = 0; i < this.slices.length; i++) {
            let sliceHash = this.slices[i];
            if (!Helper_1.default.isValidHash(sliceHash))
                throw new Error(`invalid slice hash ${i} - ${sliceHash}`);
        }
        if (this.version !== '1')
            throw new Error('invalid block version ' + this.version);
        if (!Helper_1.default.isValidAddress(this.from))
            throw new Error('invalid block from address ' + this.from);
        if (!Helper_1.default.isValidDate(this.created))
            throw new Error('invalid block created date ' + this.created);
        if (this.merkleRoot !== this.getMerkleRoot())
            throw new Error(`invalid block merkle root ${this.merkleRoot} !== ${this.getMerkleRoot()}`);
        if (!Helper_1.default.isValidHash(this.lastHash))
            throw new Error('invalid lastHash ' + this.lastHash);
        if (this.hash !== this.toHash())
            throw new Error(`invalid block hash ${this.hash} ${this.toHash()}`);
        if (!Helper_1.default.isValidSign(this.sign, this.from, this.hash))
            throw new Error('invalid block signature');
    }
}
exports.Block = Block;
