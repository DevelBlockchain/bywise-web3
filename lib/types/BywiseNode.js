"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BywiseNode = void 0;
class BywiseNode {
    constructor(config) {
        var _a, _b, _c, _d;
        this.version = (_a = config.version) !== null && _a !== void 0 ? _a : '';
        this.chains = (_b = config.chains) !== null && _b !== void 0 ? _b : [];
        this.host = (_c = config.host) !== null && _c !== void 0 ? _c : '';
        this.address = (_d = config.address) !== null && _d !== void 0 ? _d : '';
        this.expire = config.expire;
        this.token = config.token;
    }
}
exports.BywiseNode = BywiseNode;
