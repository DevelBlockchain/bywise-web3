import { BywiseHelper } from "../utils/BywiseHelper";
import { BywiseTransaction } from "./BywiseTransaction";

export type SliceData = {
    hash: string;
    data: string[];
}

export class Slice implements BywiseTransaction {
    height: number;
    blockHeight: number;
    transactions: string[];
    transactionsCount: number;
    transactionsData?: SliceData[]; // atomic swap
    version: string;
    chain: string;
    from: string;
    created: number;
    end: boolean;
    hash: string;
    sign: string;

    constructor(slice?: Partial<Slice>) {
        this.height = slice?.height ?? 0;
        this.blockHeight = slice?.blockHeight ?? 0;
        this.transactions = slice?.transactions ?? [];
        this.transactionsCount = slice?.transactionsCount ?? 0;
        this.transactionsData = slice?.transactionsData;
        this.version = slice?.version ?? '';
        this.chain = slice?.chain ?? '';
        this.from = slice?.from ?? '';
        this.created = slice?.created ?? 0;
        this.end = slice?.end ?? false;
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
    
    private getMerkleRootData() {
        let merkleRoot = '';
        if (this.transactionsData && this.transactionsData.length > 0) {
            this.transactionsData.forEach(txData => {
                merkleRoot += txData.hash;
                txData.data.forEach(data => {
                    merkleRoot += Buffer.from(data, 'utf-8').toString('hex');
                })
            })
            merkleRoot = BywiseHelper.makeHash(merkleRoot);
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
        bytes += this.getMerkleRootData();
        bytes = BywiseHelper.makeHash(bytes);
        return bytes;
    }

    isValid(): void {
        if (!BywiseHelper.isValidInteger(this.height)) throw new Error('invalid slice height');
        
        if (!BywiseHelper.isValidInteger(this.blockHeight)) throw new Error('invalid slice blockHeight');
        
        if (!BywiseHelper.isValidInteger(this.transactionsCount)) throw new Error('invalid slice transactionsCount');

        if (!BywiseHelper.isStringArray(this.transactions)) throw new Error('invalid array');
        if (this.transactions.length === 0) throw new Error('invalid slice length');
        if (this.transactions.length !== this.transactionsCount) throw new Error('invalid slice length');
        for (let i = 0; i < this.transactions.length; i++) {
            let txHash = this.transactions[i];
            if (!BywiseHelper.isValidHash(txHash)) throw new Error(`invalid tx hash ${i} - ${txHash}`);
        }
        if(this.transactionsData) {
            if (this.transactionsData.length > this.transactions.length) throw new Error('invalid slice transactionsData length');
            for (let i = 0; i < this.transactionsData.length; i++) {
                let data = this.transactionsData[i];
                if (!BywiseHelper.isValidHash(data.hash)) throw new Error(`invalid dataTx hash ${i} - ${data.hash}`);
                if (!BywiseHelper.isStringArray(data.data)) throw new Error(`invalid dataTx data ${i} - ${data.hash}`);
            }
        }
        if (this.version !== '1' && this.version !== '2') throw new Error('invalid version');
        if (this.version == '2') {
            if (this.chain.length === 0) throw new Error('invalid slice chain cant be empty');
            if (!BywiseHelper.isValidAlfaNum(this.chain)) throw new Error('invalid chain');
        }
        if (!BywiseHelper.isValidAddress(this.from)) throw new Error('invalid slice from address ' + this.from);
        if (!BywiseHelper.isValidDate(this.created)) throw new Error('invalid created date');
        if (this.end !== true && this.end !== false) throw new Error('invalid slice end flag');
        if (this.hash !== this.toHash()) throw new Error(`corrupt transaction`);
        if (!BywiseHelper.isValidSign(this.sign, this.from, this.hash)) throw new Error('invalid slice signature');
    }
}

export type PublishedSlice = {
    height: number;
    blockHeight: number;
    transactions: string[];
    transactionsCount: number;
    transactionsData: SliceData[];
    version: string;
    from: string;
    created: number;
    end: boolean;
    hash: string;
    sign: string;
    status: string;
}