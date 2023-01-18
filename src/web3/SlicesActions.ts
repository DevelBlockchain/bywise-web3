import { PublishedSlice, PublishedTx, Slice } from "../types";
import { Web3 } from "./Web3";

export class SlicesActions {
    private readonly web3: Web3;

    constructor(web3: Web3) {
        this.web3 = web3;
    }

    sendSlice = async (slice: Slice): Promise<boolean> => {
        return await this.web3.network.sendAll(async (node) => {
            return await this.web3.network.api.publishNewSlice(node, slice);
        });
    }

    getSliceByHash = async (sliceHash: string): Promise<PublishedSlice | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getSliceByHash(node, sliceHash);
            if (!req.error) {
                return req.data;
            }
        });
    }

    getSlices = async (chain: string, parameters: { status?: string, offset?: number, limit?: number, asc?: boolean } = {}): Promise<PublishedSlice[] | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getSlices(node, chain, parameters);
            if (!req.error) {
                return req.data;
            }
        });
    }

    countSlices = async (chain: string): Promise<number | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.countSlices(node, chain);
            if (!req.error) {
                return req.data.count;
            }
        });
    }

    getTransactionsFromSlice = async (sliceHash: string): Promise<PublishedTx[] | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getTransactionsFromSlice(node, sliceHash);
            if (!req.error) {
                return req.data;
            }
        });
    }

}