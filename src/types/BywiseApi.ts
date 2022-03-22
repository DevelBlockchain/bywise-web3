import { Tx, BywiseNode, SimulateTx } from '.';
const axios = require('axios');

export class BywiseResponse {
    data: any = {};
    error?: string;
}

export class BywiseApi {

    private static async get(url: string, token: string | undefined, parameters: any = {}) {
        let params = ''
        if (parameters) {
            params = '?' + (Object.entries(parameters).map(([key, value]) => {
                return `${key}=${encodeURI(JSON.stringify(value))}`;
            })).join('&');
        }
        let response = new BywiseResponse();
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
                response.error = `bywise-api error ${err.response.statusText}: ${err.response.data.error.message}`;
            }
        }
        return response;
    }

    private static async post(url: string, token: string | undefined, parameters: any = {}) {
        let response = new BywiseResponse();
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
        return response;
    }

    getFeeTransaction(node: BywiseNode, simulateTx: SimulateTx) {
        return BywiseApi.post(`${node.host}/api/v1/transactions/fee`, node.token, simulateTx);
    }

    publishNewTransaction(node: BywiseNode, tx: Tx) {
        return BywiseApi.post(`${node.host}/api/v1/transactions`, node.token, tx);
    }

    getBlocks(node: BywiseNode, filter: any) {
        return BywiseApi.get(`${node.host}/api/v1/blocks`, node.token, filter);
    }

    getSlice(node: BywiseNode, sliceHash: string) {
        return BywiseApi.get(`${node.host}/api/v1/slices/${sliceHash}`, node.token);
    }

    getTransactionFromSlice(node: BywiseNode, sliceHash: string) {
        return BywiseApi.get(`${node.host}/api/v1/slices/${sliceHash}/transactions`, node.token);
    }

    tryToken(node: BywiseNode) {
        return BywiseApi.get(`${node.host}/api/v1/nodes/try-token`, node.token);
    }

    getInfo(host: string) {
        return BywiseApi.get(`${host}/api/v1/nodes/info`, undefined);
    }

    getNodes(host: string) {
        return BywiseApi.get(`${host}/api/v1/nodes`, undefined);
    }

    tryHandshake(host: string, myNode: BywiseNode) {
        return BywiseApi.post(`${host}/api/v1/nodes/handshake`, undefined, myNode);
    }
}