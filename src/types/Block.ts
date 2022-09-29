import { BywiseHelper } from "../utils/BywiseHelper";
import { BywisePack } from "./BywisePack";
import { BywiseTransaction } from "./BywiseTransaction";

export class Block implements BywiseTransaction, BywisePack {
    height: number;
    slices: string[];
    version: string;
    chain: string;
    from: string;
    created: string;
    lastHash: string;
    hash: string;
    sign: string;
    externalTxID: string[];

    constructor(block?: Partial<Block>) {
        this.height = block?.height ?? 0;
        this.slices = block?.slices ?? [];
        this.version = block?.version ?? '';
        this.chain = block?.chain ?? '';
        this.from = block?.from ?? '';
        this.created = block?.created ?? '';
        this.lastHash = block?.lastHash ?? '';
        this.hash = block?.hash ?? '';
        this.sign = block?.sign ?? '';
        this.externalTxID = block?.externalTxID ?? [];
    }

    getMerkleRoot() {
        let merkleRoot = '';
        if (this.slices.length > 0) {
            this.slices.forEach(sliceHash => {
                merkleRoot += sliceHash;
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
        if(this.version == '2') {
            bytes += Buffer.from(this.chain, 'utf-8').toString('hex');
        }
        bytes += Buffer.from(this.from, 'utf-8').toString('hex');
        if(this.version == '1') {
            bytes += Buffer.from(this.from, 'utf-8').toString('hex'); // nextSlice
            bytes += Buffer.from(this.from, 'utf-8').toString('hex'); // nextBlock
        }
        bytes += Buffer.from(this.created, 'utf-8').toString('hex');
        bytes += this.getMerkleRoot();
        bytes += this.lastHash;
        bytes = BywiseHelper.makeHash(bytes);
        return bytes;
    }

    isValid(): void {
        if (this.height < 0) throw new Error('invalid block height ' + this.height);
        for (let i = 0; i < this.slices.length; i++) {
            let sliceHash = this.slices[i];
            if (!BywiseHelper.isValidHash(sliceHash)) throw new Error(`invalid slice hash ${i} - ${sliceHash}`);
        }
        if (this.version !== '1' && this.version !== '2') throw new Error('invalid block version ' + this.version);
        if(this.version == '2') {
            if (this.chain.length === 0) throw new Error('invalid block chain cant be empty');
            if (!BywiseHelper.isValidAlfaNum(this.chain)) throw new Error('invalid chain');
        }
        if (!BywiseHelper.isValidAddress(this.from)) throw new Error('invalid block from address ' + this.from);
        if (!BywiseHelper.isValidDate(this.created)) throw new Error('invalid block created date ' + this.created);
        if (!BywiseHelper.isValidHash(this.lastHash)) throw new Error('invalid lastHash ' + this.lastHash);
        if (this.hash !== this.toHash()) throw new Error(`invalid block hash ${this.hash} ${this.toHash()}`);
        if (!BywiseHelper.isValidSign(this.sign, this.from, this.hash)) throw new Error('invalid block signature');
    }
}

export type PublishedBlock = {
    height: number;
    slices: string[];
    version: string;
    from: string;
    created: string;
    lastHash: string;
    hash: string;
    sign: string;
    externalTxID: string[];
}