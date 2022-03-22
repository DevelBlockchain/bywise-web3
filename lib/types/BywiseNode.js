"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BywiseNode = void 0;
class BywiseNode {
    constructor(config) {
        this.isFullNode = config.isFullNode;
        this.version = config.version ? config.version : '1';
        this.updated = config.updated ? config.updated : new Date().toISOString();
        this.host = config.host;
        this.address = config.address;
        this.token = config.token;
    }
}
exports.BywiseNode = BywiseNode;
