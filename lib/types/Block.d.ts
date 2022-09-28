import { BywisePack } from "./BywisePack";
import { BywiseTransaction } from "./BywiseTransaction";
export declare class Block implements BywiseTransaction, BywisePack {
    height: number;
    slices: string[];
    version: string;
    from: string;
    nextSlice: string;
    nextBlock: string;
    created: string;
    lastHash: string;
    hash: string;
    sign: string;
    externalTxID: string[];
    constructor(block?: Partial<Block>);
    getMerkleRoot(): string;
    toHash(): string;
    isValid(): void;
}
export declare type PublishedBlock = {
    height: number;
    slices: string[];
    version: string;
    from: string;
    nextSlice: string;
    nextBlock: string;
    created: string;
    lastHash: string;
    hash: string;
    sign: string;
    externalTxID: string[];
};
