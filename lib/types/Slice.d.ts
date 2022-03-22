import BywiseTransaction from './BywiseTransaction';
import BywisePack from './BywisePack';
export declare class Slice implements BywiseTransaction, BywisePack {
    height: number;
    transactions: string[];
    numberOfTransactions: number;
    version: string;
    from: string;
    created: string;
    merkleRoot: string;
    lastBlockHash: string;
    hash: string;
    sign: string;
    getMerkleRoot(): string;
    toHash(): string;
    isValid(): void;
}
