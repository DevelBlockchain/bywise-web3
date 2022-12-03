import { Block, BlockPack, PublishedBlock, PublishedSlice } from "../types";
import { Web3 } from "./Web3";
export declare class BlocksActions {
    private readonly web3;
    constructor(web3: Web3);
    sendBlock: (block: Block) => Promise<boolean>;
    findLastBlocks: (limit: number | undefined, chain: string) => Promise<PublishedBlock[]>;
    findBlocksFromHeight: (height: number, chain: string, limit?: number) => Promise<PublishedBlock[]>;
    getBlockByHash: (blockHash: string) => Promise<PublishedBlock | undefined>;
    getBlockPackByHeight: (chain: string, height: number) => Promise<BlockPack | undefined>;
    getBlocks: (parameters?: {
        height?: number;
        from?: string;
        lastHash?: string;
        offset?: number;
        limit?: number;
        asc?: boolean;
        chain?: string;
    }) => Promise<PublishedBlock[] | undefined>;
    countBlocks: (parameters?: {
        height?: number;
        from?: string;
    }) => Promise<number | undefined>;
    getSlicesFromBlock: (sliceHash: string) => Promise<PublishedSlice[] | undefined>;
}
