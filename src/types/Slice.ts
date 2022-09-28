import { BywiseHelper } from "../utils/BywiseHelper";
import { BywisePack } from "./BywisePack";
import { BywiseTransaction } from "./BywiseTransaction";

export class Slice implements BywiseTransaction, BywisePack {
    height: number;
    transactions: string[];
    version: string;
    from: string;
    next: string;
    created: string;
    lastBlockHash: string;
    hash: string;
    sign: string;

    constructor(slice?: Partial<Slice>) {
        this.height = slice?.height ?? 0;
        this.transactions = slice?.transactions ?? [];
        this.version = slice?.version ?? '';
        this.from = slice?.from ?? '';
        this.next = slice?.next ?? '';
        this.created = slice?.created ?? '';
        this.lastBlockHash = slice?.lastBlockHash ?? '';
        this.hash = slice?.hash ?? '';
        this.sign = slice?.sign ?? '';
    }

    getMerkleRoot() {
        let merkleRoot = '';
        if (this.transactions.length > 0) {
            this.transactions.forEach(txHash => {
                merkleRoot += txHash;
            })
            merkleRoot = BywiseHelper.makeHash(merkleRoot);
        } else {
            merkleRoot = '0000000000000000000000000000000000000000000000000000000000000000'
        }
        return merkleRoot
    }

    toHash(): string {
        let bytes = '';
        bytes += BywiseHelper.numberToHex(this.height);
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        bytes += Buffer.from(this.from, 'utf-8').toString('hex');
        bytes += Buffer.from(this.next, 'utf-8').toString('hex');
        bytes += Buffer.from(this.created, 'utf-8').toString('hex');
        bytes += this.getMerkleRoot();
        bytes += this.lastBlockHash;
        bytes = BywiseHelper.makeHash(bytes);
        return bytes;
    }

    isValid(): void {
        if (this.height < 0) throw new Error('invalid slice height ' + this.height);
        if (this.transactions.length == 0) throw new Error('invalid slice length');
        for (let i = 0; i < this.transactions.length; i++) {
            let txHash = this.transactions[i];
            if (!BywiseHelper.isValidHash(txHash)) throw new Error(`invalid tx hash ${i} - ${txHash}`);
        }
        if (this.version !== '1') throw new Error('invalid slice version ' + this.version);
        if (!BywiseHelper.isValidAddress(this.from)) throw new Error('invalid slice from address ' + this.from);
        if (!BywiseHelper.isValidAddress(this.next)) throw new Error('invalid slice next address ' + this.next);
        if (!BywiseHelper.isValidDate(this.created)) throw new Error('invalid slice created date ' + this.created);
        if (!BywiseHelper.isValidHash(this.lastBlockHash)) throw new Error('invalid lastBlockHash ' + this.lastBlockHash);
        if (this.hash !== this.toHash()) throw new Error(`invalid slice hash ${this.hash} ${this.toHash()}`);
        if (!BywiseHelper.isValidSign(this.sign, this.from, this.hash)) throw new Error('invalid slice signature');
    }
}

export type PublishedSlice = {
    height: number;
    transactions: string[];
    version: string;
    from: string;
    next: string;
    created: string;
    lastBlockHash: string;
    hash: string;
    sign: string;
}