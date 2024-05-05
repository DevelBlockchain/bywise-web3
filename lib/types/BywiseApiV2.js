"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BywiseApiV2 = void 0;
class BywiseApiV2 {
    constructor(debug) {
        this.debug = debug !== undefined ? debug : false;
    }
    get(url_1, token_1) {
        return __awaiter(this, arguments, void 0, function* (url, token, parameters = {}) {
            let params = '';
            if (parameters) {
                params = '?' + (Object.entries(parameters).map(([key, value]) => {
                    if (typeof value === 'object') {
                        return `${key}=${encodeURI(JSON.stringify(value))}`;
                    }
                    return `${key}=${encodeURI(`${value}`)}`;
                })).join('&');
            }
            let response = {
                data: {}
            };
            const AbortController = globalThis.AbortController;
            const controller = new AbortController();
            const timeout = setTimeout(() => {
                controller.abort();
            }, 30000);
            try {
                const req = yield fetch(url + params, {
                    method: 'GET',
                    signal: controller.signal,
                    headers: Object.assign({ 'Content-Type': 'application/json' }, (token ? { 'Authorization': `Node ${token}` } : {})),
                });
                response.data = yield req.json();
                if (this.debug) {
                    console.log(`response`, response.data);
                }
                if (req.status < 200 || req.status >= 300) {
                    response.error = `${req.statusText} - ${response.data.error}`;
                }
            }
            catch (err) {
                response.error = `${err.message}`;
                if (err.response) {
                    response.data = err.response.data;
                    response.error = `${err.response.data.error}`;
                }
            }
            finally {
                clearTimeout(timeout);
            }
            if (this.debug) {
                console.log(`get ${url + params}`);
                if (response.error) {
                    console.log(response.error, response.data);
                }
            }
            return response;
        });
    }
    post(url_1, token_1) {
        return __awaiter(this, arguments, void 0, function* (url, token, parameters = {}) {
            let response = {
                data: {}
            };
            const AbortController = globalThis.AbortController;
            const controller = new AbortController();
            const timeout = setTimeout(() => {
                controller.abort();
            }, 30000);
            try {
                const req = yield fetch(url, {
                    method: 'POST',
                    signal: controller.signal,
                    headers: Object.assign({ 'Content-Type': 'application/json' }, (token ? { 'Authorization': `Node ${token}` } : {})),
                    body: JSON.stringify(parameters)
                });
                response.data = yield req.json();
                if (this.debug) {
                    console.log(`response`, response.data);
                }
                if (req.status < 200 || req.status >= 300) {
                    response.error = `Error ${req.statusText}: ${response.data.error}`;
                }
            }
            catch (err) {
                response.error = `${err.message}`;
                if (err.response) {
                    response.data = err.response.data;
                    response.error = `${err.response.statusText}: ${err.response.data.error}`;
                }
            }
            finally {
                clearTimeout(timeout);
            }
            if (this.debug) {
                console.log(`post ${url}`);
                if (response.error) {
                    console.log(response.error, response.data);
                }
            }
            return response;
        });
    }
    publishNewBlock(node, block) {
        return this.post(`${node.host}/api/v2/blocks`, node.token, block);
    }
    getBlocks(node, chain, parameters = {}) {
        let query = {};
        if (parameters.offset !== undefined)
            query.offset = parameters.offset;
        if (parameters.limit !== undefined)
            query.limit = parameters.limit;
        if (parameters.asc !== undefined)
            query.asc = parameters.asc;
        if (parameters.status !== undefined)
            query.status = parameters.status;
        return this.get(`${node.host}/api/v2/blocks/last/${chain}`, node.token, query);
    }
    countBlocks(node, chain, parameters = {}) {
        let query = {};
        if (parameters.status !== undefined)
            query.status = parameters.status;
        return this.get(`${node.host}/api/v2/blocks/count/${chain}`, node.token, query);
    }
    getBlockByHash(node, hash) {
        return this.get(`${node.host}/api/v2/blocks/hash/${hash}`, node.token);
    }
    getBlockByHeight(node, chain, height) {
        return this.get(`${node.host}/api/v2/blocks/height/${chain}/${height}`, node.token);
    }
    getBlockPackByHeight(node, chain, height) {
        return this.get(`${node.host}/api/v2/blocks/pack/${chain}/${height}`, node.token);
    }
    getSlicesFromBlock(node, blockHash) {
        return this.get(`${node.host}/api/v2/blocks/slices/${blockHash}`, node.token);
    }
    publishNewSlice(node, slice) {
        return this.post(`${node.host}/api/v2/slices`, node.token, slice);
    }
    getSlices(node, chain, parameters) {
        let query = {};
        if (parameters.offset !== undefined)
            query.offset = parameters.offset;
        if (parameters.limit !== undefined)
            query.limit = parameters.limit;
        if (parameters.asc !== undefined)
            query.asc = parameters.asc;
        if (parameters.status !== undefined)
            query.status = parameters.status;
        return this.get(`${node.host}/api/v2/slices/last/${chain}`, node.token, query);
    }
    countSlices(node, chain, parameters = {}) {
        let query = {};
        if (parameters.status !== undefined)
            query.status = parameters.status;
        return this.get(`${node.host}/api/v2/slices/count/${chain}`, node.token, query);
    }
    getSliceByHash(node, hash) {
        return this.get(`${node.host}/api/v2/slices/hash/${hash}`, node.token);
    }
    getTransactionsFromSlice(node, sliceHash) {
        return this.get(`${node.host}/api/v2/slices/transactions/${sliceHash}`, node.token);
    }
    publishNewTransaction(node, tx) {
        return this.post(`${node.host}/api/v2/transactions`, node.token, tx);
    }
    getTxs(node, chain, parameters) {
        let query = {};
        if (parameters.find) {
            query.searchBy = parameters.find.searchBy;
            query.value = parameters.find.value;
        }
        if (parameters.offset !== undefined)
            query.offset = parameters.offset;
        if (parameters.limit !== undefined)
            query.limit = parameters.limit;
        if (parameters.asc !== undefined)
            query.asc = parameters.asc;
        return this.get(`${node.host}/api/v2/transactions/last/${chain}`, node.token, query);
    }
    countTxs(node, parameters) {
        let query = {};
        if (parameters.find) {
            query.searchBy = parameters.find.searchBy;
            query.value = parameters.find.value;
        }
        if (parameters.chain !== undefined)
            query.chain = parameters.chain;
        return this.get(`${node.host}/api/v2/transactions/count`, node.token, query);
    }
    getTransactionByHash(node, hash) {
        return this.get(`${node.host}/api/v2/transactions/hash/${hash}`, node.token);
    }
    getFeeTransaction(node, simulateTx) {
        return this.post(`${node.host}/api/v2/transactions/fee`, node.token, simulateTx);
    }
    getContractByAddress(node, chain, address) {
        return this.get(`${node.host}/api/v2/contracts/abi/${chain}/${address}`, node.token);
    }
    getContractEventByAddress(node, chain, address, event, byKey) {
        return this.get(`${node.host}/api/v2/contracts/events/${chain}/${address}/${event}`, node.token, byKey);
    }
    trySimulate(node, simulateTx) {
        return this.post(`${node.host}/api/v2/contracts/simulate`, node.token, simulateTx);
    }
    getWalletInfo(node, address, chain) {
        return this.get(`${node.host}/api/v2/wallets/${address}/${chain}`, node.token);
    }
    tryToken(node) {
        return this.get(`${node.host}/api/v2/nodes/try-token`, node.token);
    }
    getInfo(host) {
        return this.get(`${host}/api/v2/nodes/info`, undefined);
    }
    tryHandshake(host, myNode) {
        return this.post(`${host}/api/v2/nodes/handshake`, undefined, myNode !== null && myNode !== void 0 ? myNode : {});
    }
}
exports.BywiseApiV2 = BywiseApiV2;
