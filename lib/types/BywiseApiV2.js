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
    getConfigs(node, chain) {
        return this.get(`${node.host}/api/v2/configs/${chain}`, node.token);
    }
    getBlocks(node, parameters) {
        let query = {};
        if (parameters.height !== undefined)
            query.height = parameters.height;
        if (parameters.from !== undefined)
            query.from = parameters.from;
        if (parameters.lastHash !== undefined)
            query.lastHash = parameters.lastHash;
        if (parameters.offset !== undefined)
            query.offset = parameters.offset;
        if (parameters.limit !== undefined)
            query.limit = parameters.limit;
        if (parameters.asc !== undefined)
            query.asc = parameters.asc;
        return this.get(`${node.host}/api/v2/blocks`, node.token, query);
    }
    countBlocks(node, parameters) {
        let query = {};
        if (parameters.height !== undefined)
            query.height = parameters.height;
        if (parameters.from !== undefined)
            query.from = parameters.from;
        return this.get(`${node.host}/api/v2/blocks/count`, node.token, query);
    }
    getBlockByHash(node, hash) {
        return this.get(`${node.host}/api/v2/blocks/${hash}`, node.token);
    }
    getSlicesFromBlock(node, blockHash) {
        return this.get(`${node.host}/api/v2/blocks/${blockHash}/slices`, node.token);
    }
    publishNewSlice(node, slice) {
        return this.post(`${node.host}/api/v2/slices`, node.token, slice);
    }
    getSlices(node, parameters) {
        let query = {};
        if (parameters.from !== undefined)
            query.from = parameters.from;
        if (parameters.lastBlockHash !== undefined)
            query.lastBlockHash = parameters.lastBlockHash;
        if (parameters.offset !== undefined)
            query.offset = parameters.offset;
        if (parameters.limit !== undefined)
            query.limit = parameters.limit;
        if (parameters.asc !== undefined)
            query.asc = parameters.asc;
        return this.get(`${node.host}/api/v2/slices`, node.token, query);
    }
    countSlices(node, parameters) {
        let query = {};
        if (parameters.from !== undefined)
            query.from = parameters.from;
        if (parameters.lastBlockHash !== undefined)
            query.lastBlockHash = parameters.lastBlockHash;
        return this.get(`${node.host}/api/v2/slices/count`, node.token, query);
    }
    getSliceByHash(node, hash) {
        return this.get(`${node.host}/api/v2/slices/${hash}`, node.token);
    }
    getTransactionsFromSlice(node, sliceHash) {
        return this.get(`${node.host}/api/v2/slices/${sliceHash}/transactions`, node.token);
    }
    publishNewTransaction(node, tx) {
        return this.post(`${node.host}/api/v2/transactions`, node.token, tx);
    }
    getTxs(node, parameters) {
        let query = {};
        if (parameters.from !== undefined)
            query.from = parameters.from.join(',');
        if (parameters.to !== undefined)
            query.to = parameters.to.join(',');
        if (parameters.foreignKeys !== undefined)
            query.foreignKeys = parameters.foreignKeys.join(',');
        if (parameters.tag !== undefined)
            query.tag = parameters.tag;
        if (parameters.type !== undefined)
            query.type = parameters.type;
        if (parameters.status !== undefined)
            query.status = parameters.status;
        if (parameters.validator !== undefined)
            query.validator = parameters.validator;
        if (parameters.offset !== undefined)
            query.offset = parameters.offset;
        if (parameters.limit !== undefined)
            query.limit = parameters.limit;
        if (parameters.asc !== undefined)
            query.asc = parameters.asc;
        return this.get(`${node.host}/api/v2/transactions`, node.token, query);
    }
    countTxs(node, parameters) {
        let query = {};
        if (parameters.from !== undefined)
            query.from = parameters.from.join(',');
        if (parameters.to !== undefined)
            query.to = parameters.to.join(',');
        if (parameters.foreignKeys !== undefined)
            query.foreignKeys = parameters.foreignKeys.join(',');
        if (parameters.tag !== undefined)
            query.tag = parameters.tag;
        if (parameters.type !== undefined)
            query.type = parameters.type;
        if (parameters.status !== undefined)
            query.status = parameters.status;
        if (parameters.validator !== undefined)
            query.validator = parameters.validator;
        return this.get(`${node.host}/api/v2/transactions/count`, node.token, query);
    }
    getTransactionByHash(node, hash) {
        return this.get(`${node.host}/api/v2/transactions/${hash}`, node.token);
    }
    getTxBlockchainInfo(node, hash) {
        return this.get(`${node.host}/api/v2/transactions/${hash}/blockchain`, node.token);
    }
    getFeeTransaction(node, simulateTx) {
        return this.post(`${node.host}/api/v2/transactions/fee`, node.token, simulateTx);
    }
    getWalletInfo(node, address) {
        return this.get(`${node.host}/api/v2/wallets/${address}`, node.token);
    }
    countWallets(node) {
        return this.get(`${node.host}/api/v2/wallets/count`, node.token);
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
