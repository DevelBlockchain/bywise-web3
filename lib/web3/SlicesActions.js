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
exports.SlicesActions = void 0;
class SlicesActions {
    constructor(web3) {
        this.sendSlice = (slice) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.sendAll((node) => __awaiter(this, void 0, void 0, function* () {
                return yield this.web3.network.api.publishNewSlice(node, slice);
            }));
        });
        this.getSliceByHash = (sliceHash) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.getSliceByHash(node, sliceHash);
                if (!req.error) {
                    return req.data;
                }
            }));
        });
        this.getSlices = (chain, parameters = {}) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.getSlices(node, chain, parameters);
                if (!req.error) {
                    return req.data;
                }
            }));
        });
        this.countSlices = (chain) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.countSlices(node, chain);
                if (!req.error) {
                    return req.data.count;
                }
            }));
        });
        this.getTransactionsFromSlice = (sliceHash) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.getTransactionsFromSlice(node, sliceHash);
                if (!req.error) {
                    return req.data;
                }
            }));
        });
        this.web3 = web3;
    }
}
exports.SlicesActions = SlicesActions;
