"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BywiseNode = void 0;
class BywiseNode {
    constructor(config) {
        var _a, _b, _c, _d, _e;
        this.version = (_a = config.version) !== null && _a !== void 0 ? _a : '';
        this.expire = (_b = config.expire) !== null && _b !== void 0 ? _b : 0;
        this.chains = (_c = config.chains) !== null && _c !== void 0 ? _c : [];
        this.host = (_d = config.host) !== null && _d !== void 0 ? _d : '';
        this.address = (_e = config.address) !== null && _e !== void 0 ? _e : '';
        this.token = config.token;
    }
}
exports.BywiseNode = BywiseNode;
