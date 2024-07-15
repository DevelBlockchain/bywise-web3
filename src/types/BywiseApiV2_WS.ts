import { Tx, BywiseNode, SimulateTx, Slice, TxOutput, InfoNode, PublishedTx, BywiseResponse, BlockPack, OutputSimulateContract, SimulateContract } from '.';
import { BywiseHelper, WalletInfo } from '../utils';
import { Block, PublishedBlock } from './Block';
import { CountType } from './BywiseNode';
import { PublishedSlice } from './Slice';
import ws from 'ws';
const randomstring = require("randomstring");

export type WSResponse = {
    id: string;
    status: number;
    body: any;
}

export type WSRequest = {
    id: string;
    path: string;
    method: string;
    token?: string;
    query: { [key: string]: string };
    body: any;
}

export class BywiseApiV2_WS {

    private debug: boolean;
    private connections: Map<string, ws> = new Map();
    private requests: Map<string, WSResponse> = new Map();

    constructor(debug?: boolean) {
        this.debug = debug !== undefined ? debug : false;
    }

    private async getSocket(host: string): Promise<ws> {
        let client = this.connections.get(host);
        if (client) {
            return client;
        }
        client = new ws(host);
        this.connections.set(host, client);
        let isOpen = false;
        let error = false;
        client.on('open', () => {
            if (this.debug) {
                console.log(`connected ${host}`)
            }
            isOpen = true;
        });
        client.on('message', data => {
            const res: WSResponse = JSON.parse(data.toString());
            this.requests.set(res.id, res);
        });
        client.on('error', data => {
            error = true;
        })
        for (let i = 0; i < 300 && !isOpen; i++) {
            await BywiseHelper.sleep(100);
            if (error) {
                this.connections.delete(host);
                throw new Error("Failed connection");
            }
        }
        if (!isOpen) {
            this.connections.delete(host);
            client.close();
            throw new Error("timeout");
        }
        return client;
    }

    private async get(host: string, path: string, token: string | undefined, parameters: any = {}): Promise<BywiseResponse<any>> {
        const req: WSRequest = {
            id: randomstring.generate(40),
            path: path,
            method: "GET",
            token,
            query: {},
            body: {},
        }
        Object.entries(parameters).map(([key, value]) => {
            req.query[key] = `${value}`;
        });

        const response: BywiseResponse<any> = {
            data: {}
        };
        try {
            const client = await this.getSocket(host);
            client.send(JSON.stringify(req));
            for (let i = 0; i < 300; i++) {
                await BywiseHelper.sleep(100);
                const res = this.requests.get(req.id);
                if (res) {
                    this.requests.delete(req.id);
                    if (res.status < 200 || res.status >= 300) {
                        response.error = `${res.body.error}`;
                    }
                    response.data = res.body;
                    if (this.debug) {
                        console.log(`get ${host}${path}`)
                        if (response.error) {
                            console.log(response.error, response.data)
                        }
                    }
                    return response;
                }
            }
            client.close();
            throw new Error("timeout");
        } catch (err: any) {
            this.connections.delete(host);
            response.data = { error: err.message };
            response.error = `${err.message}`;
        }
        if (this.debug) {
            console.log(`get ${host}${path}`)
            if (response.error) {
                console.log(response.error, response.data)
            }
        }
        return response;
    }

    private async post(host: string, path: string, token: string | undefined, parameters: any = {}): Promise<BywiseResponse<any>> {
        const req = {
            id: randomstring.generate(40),
            path: path,
            method: "POST",
            token,
            query: {},
            body: parameters,
        }

        const response: BywiseResponse<any> = {
            data: {}
        };
        try {
            const client = await this.getSocket(host);
            client.send(JSON.stringify(req));
            for (let i = 0; i < 300; i++) {
                await BywiseHelper.sleep(100);
                const res = this.requests.get(req.id);
                if (res) {
                    this.requests.delete(req.id);
                    if (res.status < 200 || res.status >= 300) {
                        response.error = `${res.body.error}`;
                    }
                    response.data = res.body;
                    if (this.debug) {
                        console.log(`post ${host}${path}`)
                        if (response.error) {
                            console.log(response.error, response.data)
                        }
                    }
                    return response;
                }
            }
            client.close();
            throw new Error("timeout");
        } catch (err: any) {
            this.connections.delete(host);
            response.data = { error: err.message };
            response.error = `${err.message}`;
        }
        if (this.debug) {
            console.log(`post ${host}${path}`)
            if (response.error) {
                console.log(response.error, response.data)
            }
        }
        return response;
    }

    publishNewBlock(node: BywiseNode, block: Block): Promise<BywiseResponse<void>> {
        return this.post(node.host, `/api/v2/blocks`, node.token, block);
    }

    getBlocks(node: BywiseNode, chain: string, parameters: { status?: string, offset?: number, limit?: number, asc?: boolean } = {}): Promise<BywiseResponse<PublishedBlock[]>> {
        let query: any = {};
        if (parameters.offset !== undefined) query.offset = parameters.offset
        if (parameters.limit !== undefined) query.limit = parameters.limit
        if (parameters.asc !== undefined) query.asc = parameters.asc
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(node.host, `/api/v2/blocks/last/${chain}`, node.token, query);
    }

    countBlocks(node: BywiseNode, chain: string, parameters: { status?: string } = {}): Promise<BywiseResponse<CountType>> {
        let query: any = {};
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(node.host, `/api/v2/blocks/count/${chain}`, node.token, query);
    }

    getBlockByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedBlock>> {
        return this.get(node.host, `/api/v2/blocks/hash/${hash}`, node.token);
    }

    getBlockByHeight(node: BywiseNode, chain: string, height: number): Promise<BywiseResponse<Block>> {
        return this.get(node.host, `/api/v2/blocks/height/${chain}/${height}`, node.token);
    }

    getBlockPackByHeight(node: BywiseNode, chain: string, height: number): Promise<BywiseResponse<BlockPack>> {
        return this.get(node.host, `/api/v2/blocks/pack/${chain}/${height}`, node.token);
    }

    getSlicesFromBlock(node: BywiseNode, blockHash: string): Promise<BywiseResponse<PublishedSlice[]>> {
        return this.get(node.host, `/api/v2/blocks/slices/${blockHash}`, node.token);
    }

    publishNewSlice(node: BywiseNode, slice: Slice): Promise<BywiseResponse<void>> {
        return this.post(node.host, `/api/v2/slices`, node.token, slice);
    }

    getSlices(node: BywiseNode, chain: string, parameters: { status?: string, offset?: number, limit?: number, asc?: boolean }): Promise<BywiseResponse<PublishedSlice[]>> {
        let query: any = {};
        if (parameters.offset !== undefined) query.offset = parameters.offset
        if (parameters.limit !== undefined) query.limit = parameters.limit
        if (parameters.asc !== undefined) query.asc = parameters.asc
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(node.host, `/api/v2/slices/last/${chain}`, node.token, query);
    }

    countSlices(node: BywiseNode, chain: string, parameters: { status?: string } = {}): Promise<BywiseResponse<CountType>> {
        let query: any = {};
        if (parameters.status !== undefined) query.status = parameters.status
        return this.get(node.host, `/api/v2/slices/count/${chain}`, node.token, query);
    }

    getSliceByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedSlice>> {
        return this.get(node.host, `/api/v2/slices/hash/${hash}`, node.token);
    }

    getTransactionsFromSlice(node: BywiseNode, sliceHash: string): Promise<BywiseResponse<PublishedTx[]>> {
        return this.get(node.host, `/api/v2/slices/transactions/${sliceHash}`, node.token);
    }

    publishNewTransaction(node: BywiseNode, tx: Tx): Promise<BywiseResponse<void>> {
        return this.post(node.host, `/api/v2/transactions`, node.token, tx);
    }

    getTxs(node: BywiseNode, chain: string, parameters: { offset?: number, limit?: number, asc?: boolean, find?: { searchBy: 'address' | 'from' | 'to' | 'key' | 'status', value: string } }): Promise<BywiseResponse<PublishedTx[]>> {
        let query: any = {};
        if (parameters.find) {
            query.searchBy = parameters.find.searchBy
            query.value = parameters.find.value
        }
        if (parameters.offset !== undefined) query.offset = parameters.offset;
        if (parameters.limit !== undefined) query.limit = parameters.limit;
        if (parameters.asc !== undefined) query.asc = parameters.asc;
        return this.get(node.host, `/api/v2/transactions/last/${chain}`, node.token, query);
    }

    countTxs(node: BywiseNode, parameters: { chain?: string, find?: { searchBy: 'address' | 'from' | 'to' | 'key' | 'status', value: string } }): Promise<BywiseResponse<CountType>> {
        let query: any = {};
        if (parameters.find) {
            query.searchBy = parameters.find.searchBy
            query.value = parameters.find.value
        }
        if (parameters.chain !== undefined) query.chain = parameters.chain;
        return this.get(node.host, `/api/v2/transactions/count`, node.token, query);
    }

    getTransactionByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedTx>> {
        return this.get(node.host, `/api/v2/transactions/hash/${hash}`, node.token);
    }

    getFeeTransaction(node: BywiseNode, simulateTx: SimulateTx): Promise<BywiseResponse<TxOutput>> {
        return this.post(node.host, `/api/v2/transactions/fee`, node.token, simulateTx);
    }

    getContractByAddress(node: BywiseNode, chain: string, address: string): Promise<BywiseResponse<TxOutput>> {
        return this.get(node.host, `/api/v2/contracts/abi/${chain}/${address}`, node.token);
    }

    getContractEventByAddress(node: BywiseNode, chain: string, address: string, event: string, byKey?: { key: string, value: string }): Promise<BywiseResponse<TxOutput>> {
        return this.get(node.host, `/api/v2/contracts/events/${chain}/${address}/${event}`, node.token, byKey);
    }

    trySimulate(node: BywiseNode, simulateTx: SimulateContract): Promise<BywiseResponse<OutputSimulateContract>> {
        return this.post(node.host, `/api/v2/contracts/simulate`, node.token, simulateTx);
    }

    getWalletInfo(node: BywiseNode, address: string, chain: string): Promise<BywiseResponse<WalletInfo>> {
        return this.get(node.host, `/api/v2/wallets/${address}/${chain}`, node.token);
    }

    tryToken(node: BywiseNode): Promise<BywiseResponse<InfoNode>> {
        return this.get(node.host, `/api/v2/nodes/try-token`, node.token);
    }

    getInfo(host: string): Promise<BywiseResponse<InfoNode>> {
        return this.get(host, `/api/v2/nodes/info`, undefined);
    }

    tryHandshake(host: string, myNode?: BywiseNode): Promise<BywiseResponse<BywiseNode>> {
        return this.post(host, `/api/v2/nodes/handshake`, undefined, myNode ?? {});
    }
}