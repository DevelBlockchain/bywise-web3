import { PublishedSlice, PublishedTx, Slice } from "../types";
import { Web3 } from "./Web3";
export declare class SlicesActions {
    private readonly web3;
    constructor(web3: Web3);
    sendSlice: (slice: Slice) => Promise<string | undefined>;
    getSliceByHash: (sliceHash: string) => Promise<PublishedSlice | undefined>;
    getSlices: (chain: string, parameters?: {
        status?: string;
        offset?: number;
        limit?: number;
        asc?: boolean;
    }) => Promise<PublishedSlice[] | undefined>;
    countSlices: (chain: string) => Promise<number | undefined>;
    getTransactionsFromSlice: (sliceHash: string) => Promise<PublishedTx[] | undefined>;
}
