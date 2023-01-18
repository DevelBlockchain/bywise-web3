import { Tx, BywiseNode, SimulateTx, Slice, TxOutput, InfoNode, TxBlockchainInfo, PublishedTx, BywiseResponse, BlockPack, OutputSimulateContract, SimulateContract } from '.';
import { WalletInfo } from '../utils';
import { Block, PublishedBlock } from './Block';
import { CountType } from './BywiseNode';
import { PublishedSlice } from './Slice';
const axios = require('axios');

export class BywiseApiV2 {

    private debug: boolean;

    constructor(debug?: boolean) {
        this.debug = debug !== undefined ? debug : false;
    }

    private async get(url: string, token: string | undefined, parameters: any = {}): Promise<BywiseResponse<any>> {
        let params = ''
        if (parameters) {
            params = '?' + (Object.entries(parameters).map(([key, value]) => {
                if (typeof value === 'object') {
                    return `${key}=${encodeURI(JSON.stringify(value))}`;
                }
                return `${key}=${encodeURI(`${value}`)}`;
            })).join('&');
        }
        let response: BywiseResponse<any> = {
            data: {}
        };
        try {
            let req = await axios.get(url + params, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Node ${token}` } : {})
                },
                timeout: 30000
            })
            response.data = req.data;
            if (this.debug) {
                console.log(`response`,response.data)
            }
        } catch (err: any) {
            response.error = `bywise-api error: ${err.message}`;
            if (err.response) {
                response.data = err.response.data;
                response.error = `bywise-api error ${err.response.statusText}: ${err.response.data.error}`;
            }
        }
        if (this.debug) {
            console.log(`get ${url + params}`)
            if (response.error) {
                console.log(response.error, response.data)
            }
        }
        return response;
    }

    private async post(url: string, token: string | undefined, parameters: any = {}): Promise<BywiseResponse<any>> {
        let response: BywiseResponse<any> = {
            data: {}
        };
        try {
            let req = await axios.post(url, parameters, {
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { 'Authorization': `Node ${token}` } : {})
                },
                timeout: 30000
            })
            response.data = req.data;
            if (this.debug) {
                console.log(`response`,response.data)
            }
        } catch (err: any) {
            response.error = `bywise-api error: ${err.message}`;
            if (err.response) {
                response.data = err.response.data;
                response.error = `bywise-api error ${err.response.statusText}: ${err.response.data.error}`;
            }
        }
        if (this.debug) {
            console.log(`post ${url}`)
            if (response.error) {
                console.log(response.error, response.data)
            }
        }
        return response;
    }

    publishNewBlock(node: BywiseNode, block: Block): Promise<BywiseResponse<void>> {
        return this.post(`${node.host}/api/v2/blocks`, node.token, block);
    }

    getBlocks(node: BywiseNode, chain: string, parameters: { status?: string, offset?: number, limit?: number, asc?: boolean } = {}): Promise<BywiseResponse<PublishedBlock[]>> {
        let query: any = {};
        if (parameters.offset !== undefined) query.offset = parameters.offset
        if (parameters.limit !== undefined) query.limit = parameters.limit
        if (parameters.asc !== undefined) query.asc = parameters.asc
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(`${node.host}/api/v2/blocks/last/${chain}`, node.token, query);
    }

    countBlocks(node: BywiseNode, chain: string, parameters: { status?: string } = {}): Promise<BywiseResponse<CountType>> {
        let query: any = {};
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(`${node.host}/api/v2/blocks/count/${chain}`, node.token, query);
    }

    getBlockByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedBlock>> {
        return this.get(`${node.host}/api/v2/blocks/hash/${hash}`, node.token);
    }

    getBlockByHeight(node: BywiseNode, chain: string, height: number): Promise<BywiseResponse<Block>> {
        return this.get(`${node.host}/api/v2/blocks/height/${chain}/${height}`, node.token);
    }

    getBlockPackByHeight(node: BywiseNode, chain: string, height: number): Promise<BywiseResponse<BlockPack>> {
        return this.get(`${node.host}/api/v2/blocks/pack/${chain}/${height}`, node.token);
    }

    getSlicesFromBlock(node: BywiseNode, blockHash: string): Promise<BywiseResponse<PublishedSlice[]>> {
        return this.get(`${node.host}/api/v2/blocks/slices/${blockHash}`, node.token);
    }

    publishNewSlice(node: BywiseNode, slice: Slice): Promise<BywiseResponse<void>> {
        return this.post(`${node.host}/api/v2/slices`, node.token, slice);
    }

    getSlices(node: BywiseNode, chain: string, parameters: { status?: string, offset?: number, limit?: number, asc?: boolean }): Promise<BywiseResponse<PublishedSlice[]>> {
        let query: any = {};
        if (parameters.offset !== undefined) query.offset = parameters.offset
        if (parameters.limit !== undefined) query.limit = parameters.limit
        if (parameters.asc !== undefined) query.asc = parameters.asc
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(`${node.host}/api/v2/slices/last/${chain}`, node.token, query);
    }

    countSlices(node: BywiseNode, chain: string, parameters: { status?: string } = {}): Promise<BywiseResponse<CountType>> {
        let query: any = {};
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(`${node.host}/api/v2/slices/count/${chain}`, node.token, query);
    }

    getSliceByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedSlice>> {
        return this.get(`${node.host}/api/v2/slices/hash/${hash}`, node.token);
    }

    getTransactionsFromSlice(node: BywiseNode, sliceHash: string): Promise<BywiseResponse<PublishedTx[]>> {
        return this.get(`${node.host}/api/v2/slices/transactions/${sliceHash}`, node.token);
    }

    publishNewTransaction(node: BywiseNode, tx: Tx): Promise<BywiseResponse<void>> {
        return this.post(`${node.host}/api/v2/transactions`, node.token, tx);
    }

    getTxs(node: BywiseNode, chain: string, parameters: { status?: string, offset?: number, limit?: number, asc?: boolean, find?: { searchBy: 'address' | 'from' | 'to' | 'key', value: string } }): Promise<BywiseResponse<PublishedTx[]>> {
        let query: any = {};
        if(parameters.find) {
            query.searchBy = parameters.find.searchBy
            query.value = parameters.find.value
        }
        if (parameters.status !== undefined) query.status = parameters.status;
        if (parameters.offset !== undefined) query.offset = parameters.offset;
        if (parameters.limit !== undefined) query.limit = parameters.limit;
        if (parameters.asc !== undefined) query.asc = parameters.asc;
        return this.get(`${node.host}/api/v2/transactions/last/${chain}`, node.token, query);
    }

    countTxs(node: BywiseNode, parameters: { chain?: string, status?: string, find?: { searchBy: 'address' | 'from' | 'to' | 'key', value: string } }): Promise<BywiseResponse<CountType>> {
        let query: any = {};
        if(parameters.find) {
            query.searchBy = parameters.find.searchBy
            query.value = parameters.find.value
        }
        if (parameters.status !== undefined) query.status = parameters.status;
        if (parameters.chain !== undefined) query.chain = parameters.chain;
        return this.get(`${node.host}/api/v2/transactions/count`, node.token, query);
    }

    getTransactionByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedTx>> {
        return this.get(`${node.host}/api/v2/transactions/hash/${hash}`, node.token);
    }

    getContractByAddress(node: BywiseNode, address: string): Promise<BywiseResponse<TxOutput>> {
        return this.get(`${node.host}/api/v2/transactions/contract/${address}`, node.token);
    }

    trySimulate(node: BywiseNode, simulateTx: SimulateContract): Promise<BywiseResponse<OutputSimulateContract>> {
        return this.post(`${node.host}/api/v2/transactions/simulate`, node.token, simulateTx);
    }

    getFeeTransaction(node: BywiseNode, simulateTx: SimulateTx): Promise<BywiseResponse<TxOutput>> {
        return this.post(`${node.host}/api/v2/transactions/fee`, node.token, simulateTx);
    }

    getWalletInfo(node: BywiseNode, address: string, chain: string): Promise<BywiseResponse<WalletInfo>> {
        return this.get(`${node.host}/api/v2/wallets/${address}/${chain}`, node.token);
    }

    tryToken(node: BywiseNode): Promise<BywiseResponse<InfoNode>> {
        return this.get(`${node.host}/api/v2/nodes/try-token`, node.token);
    }

    getInfo(host: string): Promise<BywiseResponse<InfoNode>> {
        return this.get(`${host}/api/v2/nodes/info`, undefined);
    }

    tryHandshake(host: string, myNode?: BywiseNode): Promise<BywiseResponse<BywiseNode>> {
        return this.post(`${host}/api/v2/nodes/handshake`, undefined, myNode ?? {});
    }
}