import AbortController from 'abort-controller';
import { Tx, BywiseNode, BywiseAPI, BywiseResponse } from '../types';
const fetch = require("node-fetch");

export class NodeBywiseAPI implements BywiseAPI {

    private static async makeRequest(url: string, requestInit: RequestInit): Promise<BywiseResponse> {
        let response = new BywiseResponse();
        const controller = new AbortController();
        const timeout = setTimeout(
            () => { controller.abort(); },
            30000,
        );
        try {
            const req = await fetch(url, requestInit).finally(() => {
                clearTimeout(timeout);
            });
            let text = await req.text();
            if (!req.ok) {
                response.error = 'bywise-api error: HTTP-CODE ' + req.status;
                if (text) {
                    let json = JSON.parse(text);
                    response.data = json;
                    response.error = 'bywise-api error: ' + json.error.message;
                }
            } else {
                if (text) {
                    let json = JSON.parse(text);
                    response.data = json;
                }
            }
        } catch (err: any) {
            response.error = 'bywise-api error: ' + err.message;
        }
        return response;
    }

    private static async get(url: string, token: string | undefined, parameters: any = {}) {
        let params = ''
        if (parameters) {
            params = '?' + (Object.entries(parameters).map(([key, value]) => {
                return `${key}=${encodeURI(JSON.stringify(value))}`;
            })).join('&');
        }
        return await NodeBywiseAPI.makeRequest(url + params, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Node ${token}` } : {})
            },
        });
    }

    private static async post(url: string, token: string | undefined, parameters: any = {}) {
        return await NodeBywiseAPI.makeRequest(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { 'Authorization': `Node ${token}` } : {})
            },
            body: JSON.stringify(parameters)
        });
    }

    getFeeTransaction(node: BywiseNode, tx: Tx) {
        return NodeBywiseAPI.post(`${node.host}/api/v1/transactions/fee`, node.token, tx);
    }

    publishNewTransaction(node: BywiseNode, tx: Tx) {
        return NodeBywiseAPI.post(`${node.host}/api/v1/transactions`, node.token, tx);
    }

    getBlocks(node: BywiseNode, filter: any) {
        return NodeBywiseAPI.get(`${node.host}/api/v1/blocks`, node.token, filter);
    }

    getSlice(node: BywiseNode, sliceHash: string) {
        return NodeBywiseAPI.get(`${node.host}/api/v1/slices/${sliceHash}`, node.token);
    }

    getTransactionFromSlice(node: BywiseNode, sliceHash: string) {
        return NodeBywiseAPI.get(`${node.host}/api/v1/slices/${sliceHash}/transactions`, node.token);
    }

    tryToken(node: BywiseNode) {
        return NodeBywiseAPI.get(`${node.host}/api/v1/nodes/try-token`, node.token);
    }

    getInfo(host: string) {
        return NodeBywiseAPI.get(`${host}/api/v1/nodes/info`, undefined);
    }

    getNodes(host: string) {
        return NodeBywiseAPI.get(`${host}/api/v1/nodes`, undefined);
    }

    tryHandshake(host: string, myNode: BywiseNode) {
        return NodeBywiseAPI.post(`${host}/api/v1/nodes/handshake`, undefined, myNode);
    }
}