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
        this.isConnected = false;
        this.connectedNodes = [];
        this.createConnection = () => __awaiter(this, void 0, void 0, function* () {
            return new types_1.BywiseNode({});
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
        });
        this.addNode = (node) => {
            if (node.host === this.myHost) {
                return;
            }
            for (let i = 0; i < this.connectedNodes.length; i++) {
                const connectedNode = this.connectedNodes[i];
                if (connectedNode.host === node.host) {
                    connectedNode.address = node.address;
                    connectedNode.chains = node.chains;
                    connectedNode.expire = node.expire;
                    connectedNode.token = node.token;
                    connectedNode.version = node.version;
                    return;
                }
            }
            this.connectedNodes.push(node);
        };
        this.getRandomNode = (chain) => {
            if (!this.isConnected)
                throw new Error('First connect to blockchain - "web3.network.connect()"');
            let chainNodes = [];
            if (chain) {
                this.connectedNodes.forEach(n => {
                    if (n.chains.includes(chain)) {
                        chainNodes.push(n);
                    }
                });
            }
            else {
                chainNodes = this.connectedNodes.map(n => n);
            }
            return chainNodes[Math.floor(Math.random() * (chainNodes.length - 1))];
        };
        this.maxConnectedNodes = configs.maxConnectedNodes;
        this.apiv1 = new types_1.BywiseApiV1(configs.debug);
        this.api = new types_1.BywiseApiV2(configs.debug);
        this.initialNodes = configs.initialNodes;
        this.myHost = configs.myHost;
        this.isClient = configs.isClient;
        if (configs.createConnection) {
            this.createConnection = configs.createConnection;
        }
    }
    populateKnowHosts(knowHosts) {
        return __awaiter(this, void 0, void 0, function* () {
            this.initialNodes.forEach(host => {
                if (!knowHosts.includes(host)) {
                    knowHosts.push(host);
                }
            });
        });
    }
    excludeOfflineNodesAndUpdateKnowHosts(knowHosts) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = this.connectedNodes.length - 1; i >= 0; i--) {
                const node = this.connectedNodes[i];
                let req = yield this.api.tryToken(node);
                if (req.error) {
                    this.connectedNodes = this.connectedNodes.filter(n => n.host !== node.host);
                }
                else {
                    const nodes = req.data.nodes;
                    for (let j = 0; j < nodes.length; j++) {
                        const knowNode = nodes[j];
                        if (!knowHosts.includes(knowNode.host)) {
                            knowHosts.push(knowNode.host);
                        }
                    }
                }
            }
        });
    }
    removeConnectedNodes(knowHosts) {
        return __awaiter(this, void 0, void 0, function* () {
            const newKnowHosts = [];
            for (let i = knowHosts.length - 1; i >= 0; i--) {
                const host = knowHosts[i];
                let found = false;
                if (host === this.myHost) {
                    found = true;
                }
                this.connectedNodes.forEach(n => {
                    if (n.host === host) {
                        found = true;
                    }
                });
                if (!found) {
                    newKnowHosts.push(host);
                }
            }
            return newKnowHosts;
        });
    }
    tryConnectNode(host) {
        return __awaiter(this, void 0, void 0, function* () {
            let myNode = undefined;
            if (!this.isClient) {
                myNode = yield this.createConnection();
            }
            let handshake = yield this.api.tryHandshake(host, myNode);
            if (!handshake.error) {
                handshake.data.host = host;
                return handshake.data;
            }
            return null;
        });
    }
    tryConnecteKnowNodes(knowHosts) {
        return __awaiter(this, void 0, void 0, function* () {
            for (let i = 0; i < knowHosts.length; i++) {
                const host = knowHosts[i];
                const node = yield this.tryConnectNode(host);
                if (node) {
                    this.connectedNodes.push(node);
                }
                if (this.connectedNodes.length >= this.maxConnectedNodes) {
                    return;
                }
            }
        });
    }
    tryConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            this.isConnected = false;
            let knowHosts = [];
            yield this.populateKnowHosts(knowHosts);
            if (knowHosts.length === 0) {
                this.isConnected = true;
            }
            yield this.excludeOfflineNodesAndUpdateKnowHosts(knowHosts);
            knowHosts = yield this.removeConnectedNodes(knowHosts);
            yield this.tryConnecteKnowNodes(knowHosts);
            if (this.connectedNodes.length > 0) {
                this.isConnected = true;
            }
            return this.connectedNodes.length;
        });
    }
    updateConnections(initialNodes) {
        return __awaiter(this, void 0, void 0, function* () {
            if (initialNodes !== undefined) {
                this.initialNodes = initialNodes;
            }
            const now = Math.floor(Date.now() / 1000);
            const updatedNodes = [];
            for (let i = this.connectedNodes.length - 1; i >= 0; i--) {
                const node = this.connectedNodes[i];
                if (node.expire && node.expire < now) {
                    const updateNode = yield this.tryConnectNode(node.host);
                    if (updateNode) {
                        updatedNodes.push(updateNode);
                    }
                }
                else {
                    updatedNodes.push(node);
                }
            }
            for (let i = 0; i < this.initialNodes.length; i++) {
                const host = this.initialNodes[i];
                let found = false;
                for (let j = 0; j < updatedNodes.length && !found; j++) {
                    const node = updatedNodes[j];
                    if (node.host === host) {
                        found = true;
                    }
                }
                if (!found && updatedNodes.length >= this.maxConnectedNodes) {
                    const newNode = yield this.tryConnectNode(host);
                    if (newNode) {
                        updatedNodes.push(newNode);
                    }
                }
            }
            this.connectedNodes = updatedNodes;
            let isConnected = false;
            if (this.initialNodes.length === 0) {
                isConnected = true;
            }
            if (this.connectedNodes.length > 0) {
                isConnected = true;
            }
            this.isConnected = isConnected;
            return this.isConnected;
        });
    }
    disconnect() {
        this.connectedNodes = [];
        this.isConnected = false;
    }
    testConnections() {
        return __awaiter(this, void 0, void 0, function* () {
            let success = this.initialNodes.length === 0;
            for (let i = this.connectedNodes.length - 1; i >= 0 && !success; i--) {
                const node = this.connectedNodes[i];
                let req = yield this.api.tryToken(node);
                if (req.error) {
                    this.connectedNodes = this.connectedNodes.filter(n => n.host !== node.host);
                }
                else {
                    success = true;
                }
            }
            return success;
        });
    }
    sendAll(sendAction, chain) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected)
                throw new Error('First connect to blockchain - "web3.network.connect()"');
            let error = undefined;
            let success = false;
            for (let i = 0; i < this.connectedNodes.length; i++) {
                const node = this.connectedNodes[i];
                if (chain === undefined || node.chains.includes(chain)) {
                    let req = yield sendAction(node);
                    if (!req.error) {
                        success = true;
                    }
                    else {
                        error = req.error;
                    }
                }
            }
            if (success) {
                return undefined;
            }
            return error;
        });
    }
    findAll(filterAction, chain) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isConnected)
                throw new Error('First connect to blockchain - "web3.network.connect()"');
            for (let i = 0; i < this.connectedNodes.length; i++) {
                const node = this.connectedNodes[i];
                if (chain === undefined || node.chains.includes(chain)) {
                    let req = yield filterAction(node);
                    if (req !== undefined) {
                        return req;
                    }
                }
            }
        });
    }
}
exports.NetworkActions = NetworkActions;
