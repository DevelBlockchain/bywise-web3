import BywiseTransaction from './BywiseTransaction';
import BywisePack from './BywisePack';
export declare class Block implements BywiseTransaction, BywisePack {
    height: number;
    numberOfSlices: number;
    slices: string[];
    version: string;
    from: string;
    created: string;
    merkleRoot: string;
    lastHash: string;
    hash: string;
    sign: string;
    externalTxID: string[];
    getMerkleRoot(): string;
    toHash(): string;
    isValid(): void;
}
