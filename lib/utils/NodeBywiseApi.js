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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeBywiseAPI = void 0;
const abort_controller_1 = __importDefault(require("abort-controller"));
const types_1 = require("../types");
const fetch = require("node-fetch");
class NodeBywiseAPI {
    static makeRequest(url, requestInit) {
        return __awaiter(this, void 0, void 0, function* () {
            let response = new types_1.BywiseResponse();
            const controller = new abort_controller_1.default();
            const timeout = setTimeout(() => { controller.abort(); }, 30000);
            try {
                const req = yield fetch(url, requestInit).finally(() => {
                    clearTimeout(timeout);
                });
                let text = yield req.text();
                if (!req.ok) {
                    response.error = 'bywise-api error: HTTP-CODE ' + req.status;
                    if (text) {
                        let json = JSON.parse(text);
                        response.data = json;
                        response.error = 'bywise-api error: ' + json.error.message;
                    }
                }
                else {
                    if (text) {
                        let json = JSON.parse(text);
                        response.data = json;
                    }
                }
            }
            catch (err) {
                response.error = 'bywise-api error: ' + err.message;
            }
            return response;
        });
    }
    static get(url, token, parameters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = '';
            if (parameters) {
                params = '?' + (Object.entries(parameters).map(([key, value]) => {
                    return `${key}=${encodeURI(JSON.stringify(value))}`;
                })).join('&');
            }
            return yield NodeBywiseAPI.makeRequest(url + params, {
                method: 'GET',
                headers: Object.assign({ 'Content-Type': 'application/json' }, (token ? { 'Authorization': `Node ${token}` } : {})),
            });
        });
    }
    static post(url, token, parameters = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield NodeBywiseAPI.makeRequest(url, {
                method: 'POST',
                headers: Object.assign({ 'Content-Type': 'application/json' }, (token ? { 'Authorization': `Node ${token}` } : {})),
                body: JSON.stringify(parameters)
            });
        });
    }
    getFeeTransaction(node, tx) {
        return NodeBywiseAPI.post(`${node.host}/api/v1/transactions/fee`, node.token, tx);
    }
    publishNewTransaction(node, tx) {
        return NodeBywiseAPI.post(`${node.host}/api/v1/transactions`, node.token, tx);
    }
    getBlocks(node, filter) {
        return NodeBywiseAPI.get(`${node.host}/api/v1/blocks`, node.token, filter);
    }
    getSlice(node, sliceHash) {
        return NodeBywiseAPI.get(`${node.host}/api/v1/slices/${sliceHash}`, node.token);
    }
    getTransactionFromSlice(node, sliceHash) {
        return NodeBywiseAPI.get(`${node.host}/api/v1/slices/${sliceHash}/transactions`, node.token);
    }
    tryToken(node) {
        return NodeBywiseAPI.get(`${node.host}/api/v1/nodes/try-token`, node.token);
    }
    getInfo(host) {
        return NodeBywiseAPI.get(`${host}/api/v1/nodes/info`, undefined);
    }
    getNodes(host) {
        return NodeBywiseAPI.get(`${host}/api/v1/nodes`, undefined);
    }
    tryHandshake(host, myNode) {
        return NodeBywiseAPI.post(`${host}/api/v1/nodes/handshake`, undefined, myNode);
    }
}
exports.NodeBywiseAPI = NodeBywiseAPI;
