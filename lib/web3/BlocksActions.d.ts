import { Block, BlockPack, PublishedBlock, PublishedSlice } from "../types";
import { Web3 } from "./Web3";
export declare class BlocksActions {
    private readonly web3;
    constructor(web3: Web3);
    sendBlock: (block: Block) => Promise<boolean>;
    findLastBlocks: (limit: number | undefined, chain: string) => Promise<PublishedBlock[]>;
    getBlockByHash: (blockHash: string) => Promise<PublishedBlock | undefined>;
    getBlockPackByHeight: (chain: string, height: number) => Promise<BlockPack | undefined>;
    getBlocks: (chain: string, parameters?: {
        height?: number;
        status?: string;
        offset?: number;
        limit?: number;
        asc?: boolean;
    }) => Promise<PublishedBlock[] | undefined>;
    countBlocks: (chain: string) => Promise<number | undefined>;
    getSlicesFromBlock: (sliceHash: string) => Promise<PublishedSlice[] | undefined>;
}
