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
exports.BywiseApiV2_WS = void 0;
const utils_1 = require("../utils");
const ws_1 = __importDefault(require("ws"));
const randomstring = require("randomstring");
class BywiseApiV2_WS {
    constructor(debug) {
        this.connections = new Map();
        this.requests = new Map();
        this.debug = debug !== undefined ? debug : false;
    }
    getSocket(host) {
        return __awaiter(this, void 0, void 0, function* () {
            let client = this.connections.get(host);
            if (client) {
                return client;
            }
            client = new ws_1.default(host);
            this.connections.set(host, client);
            let isOpen = false;
            let error = false;
            client.on('open', () => {
                if (this.debug) {
                    console.log(`connected ${host}`);
                }
                isOpen = true;
            });
            client.on('message', data => {
                const res = JSON.parse(data.toString());
                this.requests.set(res.id, res);
            });
            client.on('close', () => {
                this.connections.delete(host);
            });
            client.on('error', data => {
                error = true;
            });
            for (let i = 0; i < 300 && !isOpen; i++) {
                yield utils_1.BywiseHelper.sleep(100);
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
        });
    }
    get(host_1, path_1, token_1) {
        return __awaiter(this, arguments, void 0, function* (host, path, token, parameters = {}) {
            const req = {
                id: randomstring.generate(40),
                path: path,
                method: "GET",
                token,
                query: {},
                body: {},
            };
            Object.entries(parameters).map(([key, value]) => {
                req.query[key] = `${value}`;
            });
            const response = {
                data: {}
            };
            try {
                const client = yield this.getSocket(host);
                client.send(JSON.stringify(req));
                for (let i = 0; i < 300; i++) {
                    yield utils_1.BywiseHelper.sleep(100);
                    const res = this.requests.get(req.id);
                    if (res) {
                        this.requests.delete(req.id);
                        if (res.status < 200 || res.status >= 300) {
                            response.error = `${res.body.error}`;
                        }
                        response.data = res.body;
                        if (this.debug) {
                            console.log(`get ${host}${path}`);
                            if (response.error) {
                                console.log(response.error, response.data);
                            }
                        }
                        return response;
                    }
                }
                client.close();
                throw new Error("timeout");
            }
            catch (err) {
                this.connections.delete(host);
                response.data = { error: err.message };
                response.error = `${err.message}`;
            }
            if (this.debug) {
                console.log(`get ${host}${path}`);
                if (response.error) {
                    console.log(response.error, response.data);
                }
            }
            return response;
        });
    }
    post(host_1, path_1, token_1) {
        return __awaiter(this, arguments, void 0, function* (host, path, token, parameters = {}) {
            const req = {
                id: randomstring.generate(40),
                path: path,
                method: "POST",
                token,
                query: {},
                body: parameters,
            };
            const response = {
                data: {}
            };
            try {
                const client = yield this.getSocket(host);
                client.send(JSON.stringify(req));
                for (let i = 0; i < 300; i++) {
                    yield utils_1.BywiseHelper.sleep(100);
                    const res = this.requests.get(req.id);
                    if (res) {
                        this.requests.delete(req.id);
                        if (res.status < 200 || res.status >= 300) {
                            response.error = `${res.body.error}`;
                        }
                        response.data = res.body;
                        if (this.debug) {
                            console.log(`post ${host}${path}`);
                            if (response.error) {
                                console.log(response.error, response.data);
                            }
                        }
                        return response;
                    }
                }
                client.close();
                throw new Error("timeout");
            }
            catch (err) {
                this.connections.delete(host);
                response.data = { error: err.message };
                response.error = `${err.message}`;
            }
            if (this.debug) {
                console.log(`post ${host}${path}`);
                if (response.error) {
                    console.log(response.error, response.data);
                }
            }
            return response;
        });
    }
    disconnect() {
        for (let [key, client] of this.connections) {
            try {
                client.close();
            }
            catch (err) {
            }
        }
        this.connections = new Map();
        this.requests = new Map();
    }
    publishNewBlock(node, block) {
        return this.post(node.host, `/api/v2/blocks`, node.token, block);
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
        return this.get(node.host, `/api/v2/blocks/last/${chain}`, node.token, query);
    }
    countBlocks(node, chain, parameters = {}) {
        let query = {};
        if (parameters.status !== undefined)
            query.status = parameters.status;
        return this.get(node.host, `/api/v2/blocks/count/${chain}`, node.token, query);
    }
    getBlockByHash(node, hash) {
        return this.get(node.host, `/api/v2/blocks/hash/${hash}`, node.token);
    }
    getBlockByHeight(node, chain, height) {
        return this.get(node.host, `/api/v2/blocks/height/${chain}/${height}`, node.token);
    }
    getBlockPackByHeight(node, chain, height) {
        return this.get(node.host, `/api/v2/blocks/pack/${chain}/${height}`, node.token);
    }
    getSlicesFromBlock(node, blockHash) {
        return this.get(node.host, `/api/v2/blocks/slices/${blockHash}`, node.token);
    }
    publishNewSlice(node, slice) {
        return this.post(node.host, `/api/v2/slices`, node.token, slice);
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
        return this.get(node.host, `/api/v2/slices/last/${chain}`, node.token, query);
    }
    countSlices(node, chain, parameters = {}) {
        let query = {};
        if (parameters.status !== undefined)
            query.status = parameters.status;
        return this.get(node.host, `/api/v2/slices/count/${chain}`, node.token, query);
    }
    getSliceByHash(node, hash) {
        return this.get(node.host, `/api/v2/slices/hash/${hash}`, node.token);
    }
    getTransactionsFromSlice(node, sliceHash) {
        return this.get(node.host, `/api/v2/slices/transactions/${sliceHash}`, node.token);
    }
    publishNewTransaction(node, tx) {
        return this.post(node.host, `/api/v2/transactions`, node.token, tx);
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
        return this.get(node.host, `/api/v2/transactions/last/${chain}`, node.token, query);
    }
    countTxs(node, parameters) {
        let query = {};
        if (parameters.find) {
            query.searchBy = parameters.find.searchBy;
            query.value = parameters.find.value;
        }
        if (parameters.chain !== undefined)
            query.chain = parameters.chain;
        return this.get(node.host, `/api/v2/transactions/count`, node.token, query);
    }
    getTransactionByHash(node, hash) {
        return this.get(node.host, `/api/v2/transactions/hash/${hash}`, node.token);
    }
    getFeeTransaction(node, simulateTx) {
        return this.post(node.host, `/api/v2/transactions/fee`, node.token, simulateTx);
    }
    getContractByAddress(node, chain, address) {
        return this.get(node.host, `/api/v2/contracts/abi/${chain}/${address}`, node.token);
    }
    getContractEventByAddress(node, chain, address, event, byKey) {
        return this.get(node.host, `/api/v2/contracts/events/${chain}/${address}/${event}`, node.token, byKey);
    }
    trySimulate(node, simulateTx) {
        return this.post(node.host, `/api/v2/contracts/simulate`, node.token, simulateTx);
    }
    getWalletInfo(node, address, chain) {
        return this.get(node.host, `/api/v2/wallets/${address}/${chain}`, node.token);
    }
    tryToken(node) {
        return this.get(node.host, `/api/v2/nodes/try-token`, node.token);
    }
    getInfo(host) {
        return this.get(host, `/api/v2/nodes/info`, undefined);
    }
    tryHandshake(host, myNode) {
        return this.post(host, `/api/v2/nodes/handshake`, undefined, myNode !== null && myNode !== void 0 ? myNode : {});
    }
}
exports.BywiseApiV2_WS = BywiseApiV2_WS;
