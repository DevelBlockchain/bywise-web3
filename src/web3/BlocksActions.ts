import { Block, BlockPack, PublishedBlock, PublishedSlice, Slice, Tx } from "../types";
import { Web3 } from "./Web3";

export class BlocksActions {
    private readonly web3: Web3;

    constructor(web3: Web3) {
        this.web3 = web3;
    }

    sendBlock = async (block: Block): Promise<boolean> => {
        return await this.web3.network.sendAll(async (node) => {
            return await this.web3.network.api.publishNewBlock(node, block);
        });
    }

    findLastBlocks = async (limit: number = 1, chain: string): Promise<PublishedBlock[]> => {
        let lastBlocks: PublishedBlock[] = [];
        let lastBlockHeight = -1;
        await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getBlocks(node, chain, {
                limit,
                status: 'mined',
            });
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

    getBlockByHash = async (blockHash: string): Promise<PublishedBlock | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getBlockByHash(node, blockHash);
            if (!req.error) {
                return req.data;
            }
        });
    }
    
    getBlockPackByHeight = async (chain: string, height: number): Promise<BlockPack | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getBlockPackByHeight(node, chain, height);
            if (!req.error) {
                return {
                    block: new Block(req.data.block),
                    slices: req.data.slices.map(s => new Slice(s)),
                    txs: req.data.txs.map(tx => new Tx(tx)),
                };
            }
        });
    }

    getBlocks = async (chain: string, parameters: { height?: number, status?: string, offset?: number, limit?: number, asc?: boolean } = {}): Promise<PublishedBlock[] | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getBlocks(node, chain, parameters);
            if (!req.error) {
                return req.data;
            }
        });
    }

    countBlocks = async (chain: string): Promise<number | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.countBlocks(node, chain);
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