import { BywiseTransaction } from "./BywiseTransaction";
export declare type SliceData = {
    hash: string;
    data: string[];
};
export declare class Slice implements BywiseTransaction {
    height: number;
    blockHeight: number;
    transactions: string[];
    transactionsCount: number;
    transactionsData?: SliceData[];
    version: string;
    chain: string;
    from: string;
    created: number;
    end: boolean;
    hash: string;
    sign: string;
    constructor(slice?: Partial<Slice>);
    private getMerkleRoot;
    private getMerkleRootData;
    toHash(): string;
    isValid(): void;
}
export declare type PublishedSlice = {
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
};
