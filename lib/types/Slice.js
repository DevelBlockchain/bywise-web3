"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Slice = void 0;
const Helper_1 = __importDefault(require("../utils/Helper"));
class Slice {
    constructor() {
        this.height = 0;
        this.transactions = [];
        this.numberOfTransactions = 0;
        this.version = '';
        this.from = '';
        this.created = '';
        this.merkleRoot = '';
        this.lastBlockHash = '';
        this.hash = '';
        this.sign = '';
    }
    getMerkleRoot() {
        let merkleRoot = '';
        if (this.transactions.length > 0) {
            this.transactions.forEach(txHash => {
                merkleRoot += txHash;
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
        bytes += Helper_1.default.numberToHex(this.numberOfTransactions);
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        bytes += Buffer.from(this.from, 'utf-8').toString('hex');
        bytes += Buffer.from(this.created, 'utf-8').toString('hex');
        bytes += this.merkleRoot;
        bytes += this.lastBlockHash;
        bytes = Helper_1.default.makeHash(bytes);
        return bytes;
    }
    isValid() {
        if (this.height < 0)
            throw new Error('invalid slice height ' + this.height);
        if (this.numberOfTransactions <= 0)
            throw new Error('invalid numberOfTransactions ' + this.numberOfTransactions);
        if (this.transactions.length !== this.numberOfTransactions)
            throw new Error('invalid slice length ' + this.transactions.length + ' ' + this.numberOfTransactions);
        for (let i = 0; i < this.transactions.length; i++) {
            let txHash = this.transactions[i];
            if (!Helper_1.default.isValidHash(txHash))
                throw new Error(`invalid tx hash ${i} - ${txHash}`);
        }
        if (this.version !== '1')
            throw new Error('invalid slice version ' + this.version);
        if (!Helper_1.default.isValidAddress(this.from))
            throw new Error('invalid slice from address ' + this.from);
        if (!Helper_1.default.isValidDate(this.created))
            throw new Error('invalid slice created date ' + this.created);
        if (this.merkleRoot !== this.getMerkleRoot())
            throw new Error(`invalid slice merkle root ${this.merkleRoot} !== ${this.getMerkleRoot()}`);
        if (!Helper_1.default.isValidHash(this.lastBlockHash))
            throw new Error('invalid lastBlockHash ' + this.lastBlockHash);
        if (this.hash !== this.toHash())
            throw new Error(`invalid slice hash ${this.hash} ${this.toHash()}`);
        if (!Helper_1.default.isValidSign(this.sign, this.from, this.hash))
            throw new Error('invalid slice signature');
    }
}
exports.Slice = Slice;
