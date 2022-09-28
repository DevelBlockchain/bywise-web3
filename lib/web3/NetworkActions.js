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
exports.NetworkActions = void 0;
const types_1 = require("../types");
const randomstring = require("randomstring");
class NetworkActions {
    constructor(configs) {
        this.onlineNodes = [];
        this.isMainnet = true;
        this.isDisconnect = false;
        this.isConnected = false;
        this.connectedNodes = [];
        this.createConnection = () => __awaiter(this, void 0, void 0, function* () {
            return new types_1.BywiseNode({
                isFullNode: false,
                token: randomstring.generate()
            });
        });
        this.exportConnections = () => {
            return {
                isConnected: this.isConnected,
                connectedNodes: this.connectedNodes,
            };
        };
        this.importConnections = (payload) => __awaiter(this, void 0, void 0, function* () {
            this.isConnected = payload.isConnected;
            this.connectedNodes = payload.connectedNodes;
            yield this.tryConnection();
        });
        this.tryConnection = () => __awaiter(this, void 0, void 0, function* () {
            if (this.network.nodes.length === 0) {
                this.isConnected = true;
                return;
            }
            for (let i = this.connectedNodes.length - 1; i >= 0; i--) {
                const node = this.connectedNodes[i];
                let req = yield this.api.tryToken(node);
                if (req.error) {
                    this.connectedNodes = this.connectedNodes.filter(n => n.host !== node.host);
                }
            }
            let testNodes = [];
            this.onlineNodes.forEach(host => {
                let connected = false;
                this.connectedNodes.forEach(n => {
                    if (n.host === host) {
                        connected = true;
                    }
                });
                if (!connected) {
                    testNodes.push(host);
                }
            });
            this.network.nodes.forEach(host => {
                testNodes.push(host);
            });
            for (let i = 0; i < testNodes.length && this.connectedNodes.length < this.maxConnectedNodes; i++) {
                const nodeHost = testNodes[i];
                if (nodeHost !== this.network.myHost) {
                    let info = yield this.api.getInfo(nodeHost);
                    if (info.error) {
                        this.onlineNodes = this.onlineNodes.filter(host => host !== nodeHost);
                    }
                    else {
                        if (!this.onlineNodes.includes(nodeHost)) {
                            this.onlineNodes.push(nodeHost);
                        }
                        let isConnected = false;
                        this.connectedNodes.forEach(n => {
                            if (n.host === nodeHost) {
                                isConnected = true;
                            }
                        });
                        if (!isConnected) {
                            let handshake = yield this.api.tryHandshake(nodeHost, yield this.createConnection());
                            if (!handshake.error) {
                                this.connectedNodes.push(handshake.data);
                            }
                        }
                        info.data.nodes.forEach((node) => {
                            if (node.isFullNode && node.host) {
                                if (!testNodes.includes(node.host)) {
                                    testNodes.push(node.host);
                                }
                            }
                        });
                    }
                }
            }
            if (this.connectedNodes.length > 0) {
                this.isConnected = true;
            }
            else {
                this.isConnected = false;
            }
            return this.connectedNodes.length;
        });
        this.getRandomNode = () => {
            if (!this.isConnected)
                throw new Error('First connect to blockchain - "web3.network.connect()"');
            return this.connectedNodes[Math.floor(Math.random() * (this.connectedNodes.length - 1))];
        };
        this.maxConnectedNodes = configs.maxConnectedNodes;
        this.api = new types_1.BywiseApi(configs.debug);
        this.network = configs.network;
        this.isMainnet = configs.network.isMainnet;
        if (configs.createConnection) {
            this.createConnection = configs.createConnection;
        }
    }
    sendAll(sendAction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected)
                throw new Error('First connect to blockchain - "web3.network.connect()"');
            let success = false;
            for (let i = 0; i < this.connectedNodes.length; i++) {
                const node = this.connectedNodes[i];
                let req = yield sendAction(node);
                if (!req.error) {
                    success = true;
                }
            }
            return success;
        });
    }
    findAll(filterAction) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected)
                throw new Error('First connect to blockchain - "web3.network.connect()"');
            for (let i = 0; i < this.connectedNodes.length; i++) {
                const node = this.connectedNodes[i];
                let req = yield filterAction(node);
                if (req !== undefined) {
                    return req;
                }
            }
        });
    }
}
exports.NetworkActions = NetworkActions;
