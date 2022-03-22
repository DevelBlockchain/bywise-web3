"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoAddress = void 0;
class InfoAddress {
    constructor(config) {
        this.version = config.version;
        this.isMainnet = config.isMainnet;
        this.isContract = config.isContract;
        this.ethAddress = config.ethAddress;
        this.tag = config.tag;
    }
}
exports.InfoAddress = InfoAddress;
