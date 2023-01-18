import { BywiseHelper } from "../utils/BywiseHelper";
import { BywiseTransaction } from "./BywiseTransaction";

export class Slice implements BywiseTransaction {
    height: number;
    blockHeight: number;
    transactions: string[];
    transactionsCount: number;
    version: string;
    chain: string;
    from: string;
    created: number;
    end: boolean;
    lastBlockHash: string;
    hash: string;
    sign: string;

    constructor(slice?: Partial<Slice>) {
        this.height = slice?.height ?? 0;
        this.blockHeight = slice?.blockHeight ?? 0;
        this.transactions = slice?.transactions ?? [];
        this.transactionsCount = slice?.transactionsCount ?? 0;
        this.version = slice?.version ?? '';
        this.chain = slice?.chain ?? '';
        this.from = slice?.from ?? '';
        this.created = slice?.created ?? 0;
        this.end = slice?.end ?? false;
        this.lastBlockHash = slice?.lastBlockHash ?? '';
        this.hash = slice?.hash ?? '';
        this.sign = slice?.sign ?? '';
    }

    private getMerkleRoot() {
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
        bytes += BywiseHelper.numberToHex(this.blockHeight);
        bytes += BywiseHelper.numberToHex(this.transactionsCount);
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        bytes += Buffer.from(this.chain, 'utf-8').toString('hex');
        bytes += Buffer.from(this.from, 'utf-8').toString('hex');
        bytes += BywiseHelper.numberToHex(this.created);
        bytes += Buffer.from(this.end ? 'true' : 'false', 'utf-8').toString('hex');
        bytes += this.getMerkleRoot();
        bytes += this.lastBlockHash;
        bytes = BywiseHelper.makeHash(bytes);
        return bytes;
    }

    isValid(): void {
        if (typeof this.height === 'number') throw new Error('invalid slice height ' + this.height);
        if (this.height < 0) throw new Error('invalid slice height ' + this.height);
        
        if (typeof this.blockHeight === 'number') throw new Error('invalid slice blockHeight ' + this.blockHeight);
        if (this.blockHeight < 0) throw new Error('invalid slice blockHeight ' + this.blockHeight);

        if (typeof this.transactionsCount === 'number') throw new Error('invalid slice transactionsCount ' + this.transactionsCount);
        if (this.transactionsCount >= 0) throw new Error('invalid slice transactionsCount ' + this.transactionsCount);

        if (this.transactions.length == 0) throw new Error('invalid slice length');
        for (let i = 0; i < this.transactions.length; i++) {
            let txHash = this.transactions[i];
            if (!BywiseHelper.isValidHash(txHash)) throw new Error(`invalid tx hash ${i} - ${txHash}`);
        }
        if (this.version !== '2') throw new Error('invalid slice version ' + this.version);
        if (this.version == '2') {
            if (this.chain.length === 0) throw new Error('invalid slice chain cant be empty');
            if (!BywiseHelper.isValidAlfaNum(this.chain)) throw new Error('invalid chain');
        }
        if (!BywiseHelper.isValidAddress(this.from)) throw new Error('invalid slice from address ' + this.from);
        if (!BywiseHelper.isValidDate(this.created)) throw new Error('invalid slice created date ' + this.created);
        if (this.end !== true && this.end !== false) throw new Error('invalid slice end flag ' + this.version);
        if (!BywiseHelper.isValidHash(this.lastBlockHash)) throw new Error('invalid lastBlockHash ' + this.lastBlockHash);
        if (this.hash !== this.toHash()) throw new Error(`invalid slice hash ${this.hash} ${this.toHash()}`);
        if (!BywiseHelper.isValidSign(this.sign, this.from, this.hash)) throw new Error('invalid slice signature');
    }
}

export type PublishedSlice = {
    height: number;
    blockHeight: number;
    transactions: string[];
    transactionsCount: number;
    version: string;
    from: string;
    created: number;
    end: boolean;
    lastBlockHash: string;
    hash: string;
    sign: string;
    status: string;
}