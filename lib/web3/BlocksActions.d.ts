import { PublishedBlock, PublishedSlice } from "../types";
import { Web3 } from "./Web3";
export declare class BlocksActions {
    private readonly web3;
    constructor(web3: Web3);
    findLastBlocks: (limit?: number) => Promise<PublishedBlock[]>;
    findBlocksFromHeight: (height: number, limit?: number) => Promise<PublishedBlock[]>;
    getBlockByHash: (blockHash: string) => Promise<PublishedBlock | undefined>;
    getBlocks: (parameters?: {
        height?: number;
        from?: string;
        lastHash?: string;
        offset?: number;
        limit?: number;
        asc?: boolean;
    }) => Promise<PublishedBlock[] | undefined>;
    countBlocks: (parameters?: {
        height?: number;
        from?: string;
    }) => Promise<number | undefined>;
    getSlicesFromBlock: (sliceHash: string) => Promise<PublishedSlice[] | undefined>;
}
