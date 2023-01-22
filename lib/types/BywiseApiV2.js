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
const axios = require('axios');
class BywiseApiV2 {
    constructor(debug) {
        this.debug = debug !== undefined ? debug : false;
    }
    get(url, token, parameters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
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
            try {
                let req = yield axios.get(url + params, {
                    headers: Object.assign({ 'Content-Type': 'application/json' }, (token ? { 'Authorization': `Node ${token}` } : {})),
                    timeout: 30000
                });
                response.data = req.data;
                if (this.debug) {
                    console.log(`response`, response.data);
                }
            }
            catch (err) {
                response.error = `bywise-api error: ${err.message}`;
                if (err.response) {
                    response.data = err.response.data;
                    response.error = `bywise-api error ${err.response.statusText}: ${err.response.data.error}`;
                }
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
    post(url, token, parameters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = {
                data: {}
            };
            try {
                let req = yield axios.post(url, parameters, {
                    headers: Object.assign({ 'Content-Type': 'application/json' }, (token ? { 'Authorization': `Node ${token}` } : {})),
                    timeout: 30000
                });
                response.data = req.data;
                if (this.debug) {
                    console.log(`response`, response.data);
                }
            }
            catch (err) {
                response.error = `bywise-api error: ${err.message}`;
                if (err.response) {
                    response.data = err.response.data;
                    response.error = `bywise-api error ${err.response.statusText}: ${err.response.data.error}`;
                }
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
        if (parameters.status !== undefined)
            query.status = parameters.status;
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
        if (parameters.status !== undefined)
            query.status = parameters.status;
        if (parameters.chain !== undefined)
            query.chain = parameters.chain;
        return this.get(`${node.host}/api/v2/transactions/count`, node.token, query);
    }
    getTransactionByHash(node, hash) {
        return this.get(`${node.host}/api/v2/transactions/hash/${hash}`, node.token);
    }
    getContractByAddress(node, chain, address) {
        return this.get(`${node.host}/api/v2/transactions/contract/${chain}/${address}`, node.token);
    }
    trySimulate(node, simulateTx) {
        return this.post(`${node.host}/api/v2/transactions/simulate`, node.token, simulateTx);
    }
    getFeeTransaction(node, simulateTx) {
        return this.post(`${node.host}/api/v2/transactions/fee`, node.token, simulateTx);
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
