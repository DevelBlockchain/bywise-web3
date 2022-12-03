import { Tx, BywiseNode, SimulateTx, Slice, TxOutput, InfoNode, TxBlockchainInfo, PublishedTx, BywiseResponse, BlockPack } from '.';
import { WalletInfo } from '../utils';
import { Block, PublishedBlock } from './Block';
import { ConfigNode, CountType } from './BywiseNode';
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

    getConfigs(node: BywiseNode, chain: string): Promise<BywiseResponse<ConfigNode[]>> {
        return this.get(`${node.host}/api/v2/configs/${chain}`, node.token);
    }

    publishNewBlock(node: BywiseNode, block: Block): Promise<BywiseResponse<void>> {
        return this.post(`${node.host}/api/v2/blocks`, node.token, block);
    }

    getBlocks(node: BywiseNode, parameters: { height?: any, status?: string, from?: string, lastHash?: string, offset?: number, limit?: number, asc?: boolean, chain?: string }): Promise<BywiseResponse<PublishedBlock[]>> {
        let query: any = {};
        if (parameters.offset !== undefined) query.offset = parameters.offset
        if (parameters.limit !== undefined) query.limit = parameters.limit
        if (parameters.asc !== undefined) query.asc = parameters.asc
        if (parameters.status !== undefined) query.status = parameters.status
        if (parameters.from !== undefined) query['block.from'] = parameters.from
        if (parameters.lastHash !== undefined) query['block.lastHash'] = parameters.lastHash
        if (parameters.from !== undefined) query['block.from'] = parameters.from
        if (parameters.height !== undefined) query['block.height'] = parameters.height
        if (parameters.chain !== undefined) query['block.chain'] = parameters.chain
        return this.get(`${node.host}/api/v2/blocks`, node.token, { where: query });
    }

    countBlocks(node: BywiseNode, parameters: { height?: number, from?: string }): Promise<BywiseResponse<CountType>> {
        let query: any = {};
        if (parameters.from !== undefined) query['block.from'] = parameters.from
        if (parameters.height !== undefined) query['block.height'] = parameters.height
        return this.get(`${node.host}/api/v2/blocks/count`, node.token, { where: query });
    }

    getBlockByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedBlock>> {
        return this.get(`${node.host}/api/v2/blocks/${hash}`, node.token);
    }

    getBlockPackByHeight(node: BywiseNode, chain: string, height: number): Promise<BywiseResponse<BlockPack>> {
        return this.get(`${node.host}/api/v2/blocks-pack/${chain}/${height}`, node.token);
    }

    getSlicesFromBlock(node: BywiseNode, blockHash: string): Promise<BywiseResponse<PublishedSlice[]>> {
        return this.get(`${node.host}/api/v2/blocks/${blockHash}/slices`, node.token);
    }

    publishNewSlice(node: BywiseNode, slice: Slice): Promise<BywiseResponse<void>> {
        return this.post(`${node.host}/api/v2/slices`, node.token, slice);
    }

    getSlices(node: BywiseNode, parameters: { from?: string, chain?: string, height?: string, lastBlockHash?: string, offset?: number, limit?: number, asc?: boolean }): Promise<BywiseResponse<PublishedSlice[]>> {
        let query: any = {};
        if (parameters.offset !== undefined) query.offset = parameters.offset
        if (parameters.limit !== undefined) query.limit = parameters.limit
        if (parameters.asc !== undefined) query.asc = parameters.asc
        if (parameters.from !== undefined) query['slice.from'] = parameters.from
        if (parameters.lastBlockHash !== undefined) query['slice.lastBlockHash'] = parameters.lastBlockHash
        if (parameters.chain !== undefined) query['slice.chain'] = parameters.chain
        if (parameters.height !== undefined) query['slice.height'] = parameters.height
        return this.get(`${node.host}/api/v2/slices`, node.token, { where: query });
    }

    countSlices(node: BywiseNode, parameters: { from?: string, lastBlockHash?: string }): Promise<BywiseResponse<CountType>> {
        let query: any = {};
        if (parameters.from !== undefined) query['slice.from'] = parameters.from
        if (parameters.lastBlockHash !== undefined) query['slice.lastBlockHash'] = parameters.lastBlockHash
        return this.get(`${node.host}/api/v2/slices/count`, node.token, { where: query });
    }

    getSliceByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedSlice>> {
        return this.get(`${node.host}/api/v2/slices/${hash}`, node.token);
    }

    getTransactionsFromSlice(node: BywiseNode, sliceHash: string): Promise<BywiseResponse<PublishedTx[]>> {
        return this.get(`${node.host}/api/v2/slices/${sliceHash}/transactions`, node.token);
    }

    publishNewTransaction(node: BywiseNode, tx: Tx): Promise<BywiseResponse<void>> {
        return this.post(`${node.host}/api/v2/transactions`, node.token, tx);
    }

    getTxs(node: BywiseNode, parameters: { chain?: string, from?: string[], to?: string[], foreignKeys?: string[], tag?: string, type?: string, status?: string, validator?: string, offset?: number, limit?: number, asc?: boolean }): Promise<BywiseResponse<PublishedTx[]>> {
        let query: any = {};
        if (parameters.chain !== undefined) query['tx.chain'] = parameters.chain
        if (parameters.from !== undefined) query['tx.from'] = { $in: parameters.from }
        if (parameters.to !== undefined) query['tx.to'] = { $in: parameters.to }
        if (parameters.foreignKeys !== undefined) query['tx.foreignKeys'] = { $in: parameters.foreignKeys }
        if (parameters.tag !== undefined) query['tx.tag'] = parameters.tag
        if (parameters.type !== undefined) query['tx.type'] = parameters.type

        if (parameters.status !== undefined) query.status = parameters.status;
        if (parameters.offset !== undefined) query.offset = parameters.offset;
        if (parameters.limit !== undefined) query.limit = parameters.limit;
        if (parameters.asc !== undefined) query.asc = parameters.asc;
        return this.get(`${node.host}/api/v2/transactions`, node.token, { where: query });
    }

    countTxs(node: BywiseNode, parameters: { chain?: string, from?: string[], to?: string[], foreignKeys?: string[], tag?: string, type?: string, status?: string, validator?: string }): Promise<BywiseResponse<CountType>> {
        let query: any = {};
        if (parameters.chain !== undefined) query['tx.chain'] = parameters.chain
        if (parameters.from !== undefined) query['tx.from'] = { $in: parameters.from }
        if (parameters.to !== undefined) query['tx.to'] = { $in: parameters.to }
        if (parameters.foreignKeys !== undefined) query['tx.foreignKeys'] = { $in: parameters.foreignKeys }
        if (parameters.tag !== undefined) query['tx.tag'] = parameters.tag
        if (parameters.type !== undefined) query['tx.type'] = parameters.type
        if (parameters.status !== undefined) query.status = parameters.status;
        return this.get(`${node.host}/api/v2/transactions/count`, node.token, { where: query });
    }

    getTransactionByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedTx>> {
        return this.get(`${node.host}/api/v2/transactions/${hash}`, node.token);
    }

    getTxBlockchainInfo(node: BywiseNode, hash: string): Promise<BywiseResponse<TxBlockchainInfo>> {
        return this.get(`${node.host}/api/v2/transactions/${hash}/blockchain`, node.token);
    }

    getFeeTransaction(node: BywiseNode, simulateTx: SimulateTx): Promise<BywiseResponse<TxOutput>> {
        return this.post(`${node.host}/api/v2/transactions/fee`, node.token, simulateTx);
    }

    getWalletInfo(node: BywiseNode, address: string, chain: string): Promise<BywiseResponse<WalletInfo>> {
        return this.get(`${node.host}/api/v2/wallets/${address}/${chain}`, node.token);
    }

    countWallets(node: BywiseNode): Promise<BywiseResponse<CountType>> {
        return this.get(`${node.host}/api/v2/wallets/count`, node.token);
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