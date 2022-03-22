"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = void 0;
class Network {
    constructor(network) {
        this.isMainnet = network.isMainnet;
        this.nodes = network.nodes;
        this.explorer = network.explorer;
    }
}
exports.Network = Network;
