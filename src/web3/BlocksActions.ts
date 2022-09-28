import { Block, PublishedBlock, PublishedSlice, Slice } from "../types";
import { Web3 } from "./Web3";

export class BlocksActions {
    private readonly web3: Web3;

    constructor(web3: Web3) {
        this.web3 = web3;
    }

    findLastBlocks = async (limit: number = 100): Promise<PublishedBlock[]> => {
        let lastBlocks: PublishedBlock[] = [];
        let lastBlockHeight = -1;
        await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getBlocks(node, { limit });
            if (!req.error) {
                let blocks = req.data;
                blocks.forEach(block => {
                    if (block.height > lastBlockHeight) {
                        lastBlockHeight = block.height;
                        lastBlocks = blocks;
                    }
                });
            }
        });
        return lastBlocks;
    }

    findBlocksFromHeight = async (height: number, limit = 1): Promise<PublishedBlock[]> => {
        let lastBlocks: PublishedBlock[] = [];
        let lastBlockHeight = -1;
        await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getBlocks(node, {
                height,
                limit,
                asc: true,
            });
            if (!req.error) {
                let blocks = req.data;
                blocks.forEach(block => {
                    if (block.height > lastBlockHeight) {
                        lastBlockHeight = block.height;
                        lastBlocks = blocks;
                    }
                })
            }
        });
        return lastBlocks;
    }

    getBlockByHash = async (blockHash: string): Promise<PublishedBlock | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getBlockByHash(node, blockHash);
            if (!req.error) {
                return req.data;
            }
        });
    }

    getBlocks = async (parameters: { height?: number, from?: string, lastHash?: string, offset?: number, limit?: number, asc?: boolean } = {}): Promise<PublishedBlock[] | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getBlocks(node, parameters);
            if (!req.error) {
                return req.data;
            }
        });
    }

    countBlocks = async (parameters: { height?: number, from?: string } = {}): Promise<number | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.countBlocks(node, parameters);
            if (!req.error) {
                return req.data.count;
            }
        });
    }

    getSlicesFromBlock = async (sliceHash: string): Promise<PublishedSlice[] | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getSlicesFromBlock(node, sliceHash);
            if (!req.error) {
                return req.data;
            }
        });
    }

}