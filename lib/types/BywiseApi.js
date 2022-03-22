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
exports.BywiseApi = exports.BywiseResponse = void 0;
const axios = require('axios');
class BywiseResponse {
    constructor() {
        this.data = {};
    }
}
exports.BywiseResponse = BywiseResponse;
class BywiseApi {
    static get(url, token, parameters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = '';
            if (parameters) {
                params = '?' + (Object.entries(parameters).map(([key, value]) => {
                    return `${key}=${encodeURI(JSON.stringify(value))}`;
                })).join('&');
            }
            let response = new BywiseResponse();
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
                    response.error = `bywise-api error ${err.response.statusText}: ${err.response.data.error.message}`;
                }
            }
            return response;
        });
    }
    static post(url, token, parameters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new BywiseResponse();
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
                    response.error = `bywise-api error ${err.response.statusText}: ${err.response.data.error.message}`;
                }
            }
            return response;
        });
    }
    getFeeTransaction(node, simulateTx) {
        return BywiseApi.post(`${node.host}/api/v1/transactions/fee`, node.token, simulateTx);
    }
    publishNewTransaction(node, tx) {
        return BywiseApi.post(`${node.host}/api/v1/transactions`, node.token, tx);
    }
    getBlocks(node, filter) {
        return BywiseApi.get(`${node.host}/api/v1/blocks`, node.token, filter);
    }
    getSlice(node, sliceHash) {
        return BywiseApi.get(`${node.host}/api/v1/slices/${sliceHash}`, node.token);
    }
    getTransactionFromSlice(node, sliceHash) {
        return BywiseApi.get(`${node.host}/api/v1/slices/${sliceHash}/transactions`, node.token);
    }
    tryToken(node) {
        return BywiseApi.get(`${node.host}/api/v1/nodes/try-token`, node.token);
    }
    getInfo(host) {
        return BywiseApi.get(`${host}/api/v1/nodes/info`, undefined);
    }
    getNodes(host) {
        return BywiseApi.get(`${host}/api/v1/nodes`, undefined);
    }
    tryHandshake(host, myNode) {
        return BywiseApi.post(`${host}/api/v1/nodes/handshake`, undefined, myNode);
    }
}
exports.BywiseApi = BywiseApi;
