import { Block, Slice } from "../types";
import { Web3 } from "./Web3";
export declare class BlocksActions {
    private readonly web3;
    constructor(web3: Web3);
    findLastBlocks: (limit?: number) => Promise<Block[]>;
    findBlocksFromHeight: (height: number, limit?: number) => Promise<Block[]>;
    getBlockByHash: (blockHash: string) => Promise<Block | undefined>;
    getBlocks: (parameters: {
        height?: number;
        from?: string;
        offset?: number;
        limit?: number;
        asc?: boolean;
    }) => Promise<Block[] | undefined>;
    countBlocks: (parameters: {
        height?: number;
        from?: string;
    }) => Promise<number | undefined>;
    getSlicesFromBlock: (sliceHash: string) => Promise<Slice[] | undefined>;
}
