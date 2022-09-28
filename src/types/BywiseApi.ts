import { Tx, BywiseNode, SimulateTx, Slice, TxOutput, InfoNode, TxBlockchainInfo, PublishedTx } from '.';
import { WalletInfo } from '../utils';
import { Block, PublishedBlock } from './Block';
import { CountType } from './BywiseNode';
import { PublishedSlice } from './Slice';
const axios = require('axios');

export type BywiseResponse<T> = {
    data: T;
    error?: string;
}

export class BywiseApi {

    private debug: boolean;

    constructor(debug?: boolean) {
        this.debug = debug !== undefined ? debug : false;
    }

    private async get(url: string, token: string | undefined, parameters: any = {}): Promise<BywiseResponse<any>> {
        let params = ''
        if (parameters) {
            params = '?' + (Object.entries(parameters).map(([key, value]) => {
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
        } catch (err: any) {
            response.error = `bywise-api error: ${err.message}`;
            if (err.response) {
                response.data = err.response.data;
                response.error = `bywise-api error ${err.response.statusText}: ${err.response.data.error.message}`;
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
        } catch (err: any) {
            response.error = `bywise-api error: ${err.message}`;
            if (err.response) {
                response.data = err.response.data;
                response.error = `bywise-api error ${err.response.statusText}: ${err.response.data.error.message}`;
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

    getBlocks(node: BywiseNode, parameters: { height?: number, from?: string, lastHash?: string, offset?: number, limit?: number, asc?: boolean }): Promise<BywiseResponse<PublishedBlock[]>> {
        let query: any = {};
        if (parameters.height !== undefined) query.height = parameters.height
        if (parameters.from !== undefined) query.from = parameters.from
        if (parameters.lastHash !== undefined) query.lastHash = parameters.lastHash
        if (parameters.offset !== undefined) query.offset = parameters.offset
        if (parameters.limit !== undefined) query.limit = parameters.limit
        if (parameters.asc !== undefined) query.asc = parameters.asc
        return this.get(`${node.host}/api/v1/blocks`, node.token, query);
    }

    countBlocks(node: BywiseNode, parameters: { height?: number, from?: string }): Promise<BywiseResponse<CountType>> {
        let query: any = {};
        if (parameters.height !== undefined) query.height = parameters.height
        if (parameters.from !== undefined) query.from = parameters.from
        return this.get(`${node.host}/api/v1/blocks/count`, node.token, query);
    }

    getBlockByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedBlock>> {
        return this.get(`${node.host}/api/v1/blocks/${hash}`, node.token);
    }

    getSlicesFromBlock(node: BywiseNode, blockHash: string): Promise<BywiseResponse<PublishedSlice[]>> {
        return this.get(`${node.host}/api/v1/blocks/${blockHash}/slices`, node.token);
    }

    publishNewSlice(node: BywiseNode, slice: Slice): Promise<BywiseResponse<void>> {
        return this.post(`${node.host}/api/v1/slices`, node.token, slice);
    }

    getSlices(node: BywiseNode, parameters: { from?: string, lastBlockHash?: string, offset?: number, limit?: number, asc?: boolean }): Promise<BywiseResponse<PublishedSlice[]>> {
        let query: any = {};
        if (parameters.from !== undefined) query.from = parameters.from
        if (parameters.lastBlockHash !== undefined) query.lastBlockHash = parameters.lastBlockHash
        if (parameters.offset !== undefined) query.offset = parameters.offset
        if (parameters.limit !== undefined) query.limit = parameters.limit
        if (parameters.asc !== undefined) query.asc = parameters.asc
        return this.get(`${node.host}/api/v1/slices`, node.token, query);
    }

    countSlices(node: BywiseNode, parameters: { from?: string, lastBlockHash?: string }): Promise<BywiseResponse<CountType>> {
        let query: any = {};
        if (parameters.from !== undefined) query.from = parameters.from
        if (parameters.lastBlockHash !== undefined) query.lastBlockHash = parameters.lastBlockHash
        return this.get(`${node.host}/api/v1/slices/count`, node.token, query);
    }

    getSliceByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedSlice>> {
        return this.get(`${node.host}/api/v1/slices/${hash}`, node.token);
    }

    getTransactionsFromSlice(node: BywiseNode, sliceHash: string): Promise<BywiseResponse<PublishedTx[]>> {
        return this.get(`${node.host}/api/v1/slices/${sliceHash}/transactions`, node.token);
    }

    publishNewTransaction(node: BywiseNode, tx: Tx): Promise<BywiseResponse<void>> {
        return this.post(`${node.host}/api/v1/transactions`, node.token, tx);
    }

    getTxs(node: BywiseNode, parameters: { from?: string[], to?: string[], foreignKeys?: string[], tag?: string, type?: string, status?: string, validator?: string, offset?: number, limit?: number, asc?: boolean }): Promise<BywiseResponse<PublishedTx[]>> {
        let query: any = {};
        if (parameters.from !== undefined) query.from = parameters.from.join(',');
        if (parameters.to !== undefined) query.to = parameters.to.join(',');
        if (parameters.foreignKeys !== undefined) query.foreignKeys = parameters.foreignKeys.join(',');
        if (parameters.tag !== undefined) query.tag = parameters.tag;
        if (parameters.type !== undefined) query.type = parameters.type;
        if (parameters.status !== undefined) query.status = parameters.status;
        if (parameters.validator !== undefined) query.validator = parameters.validator;
        if (parameters.offset !== undefined) query.offset = parameters.offset;
        if (parameters.limit !== undefined) query.limit = parameters.limit;
        if (parameters.asc !== undefined) query.asc = parameters.asc;
        return this.get(`${node.host}/api/v1/transactions`, node.token, query);
    }

    countTxs(node: BywiseNode, parameters: { from?: string[], to?: string[], foreignKeys?: string[], tag?: string, type?: string, status?: string, validator?: string }): Promise<BywiseResponse<CountType>> {
        let query: any = {};
        if (parameters.from !== undefined) query.from = parameters.from.join(',');
        if (parameters.to !== undefined) query.to = parameters.to.join(',');
        if (parameters.foreignKeys !== undefined) query.foreignKeys = parameters.foreignKeys.join(',');
        if (parameters.tag !== undefined) query.tag = parameters.tag;
        if (parameters.type !== undefined) query.type = parameters.type;
        if (parameters.status !== undefined) query.status = parameters.status;
        if (parameters.validator !== undefined) query.validator = parameters.validator;
        return this.get(`${node.host}/api/v1/transactions/count`, node.token, query);
    }

    getTransactionByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedTx>> {
        return this.get(`${node.host}/api/v1/transactions/${hash}`, node.token);
    }

    getTxBlockchainInfo(node: BywiseNode, hash: string): Promise<BywiseResponse<TxBlockchainInfo>> {
        return this.get(`${node.host}/api/v1/transactions/${hash}/blockchain`, node.token);
    }

    getFeeTransaction(node: BywiseNode, simulateTx: SimulateTx): Promise<BywiseResponse<TxOutput>> {
        return this.post(`${node.host}/api/v1/transactions/fee`, node.token, simulateTx);
    }

    getWalletInfo(node: BywiseNode, address: string): Promise<BywiseResponse<WalletInfo>> {
        return this.get(`${node.host}/api/v1/wallets/${address}`, node.token);
    }

    countWallets(node: BywiseNode): Promise<BywiseResponse<CountType>> {
        return this.get(`${node.host}/api/v1/wallets/count`, node.token);
    }

    tryToken(node: BywiseNode): Promise<BywiseResponse<void>> {
        return this.get(`${node.host}/api/v1/nodes/try-token`, node.token);
    }

    getInfo(host: string): Promise<BywiseResponse<InfoNode>> {
        return this.get(`${host}/api/v1/nodes/info`, undefined);
    }

    tryHandshake(host: string, myNode: BywiseNode): Promise<BywiseResponse<BywiseNode>> {
        return this.post(`${host}/api/v1/nodes/handshake`, undefined, myNode);
    }
}