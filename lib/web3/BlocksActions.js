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
exports.BlocksActions = void 0;
const types_1 = require("../types");
class BlocksActions {
    constructor(web3) {
        this.sendBlock = (block) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.sendAll((node) => __awaiter(this, void 0, void 0, function* () {
                return yield this.web3.network.api.publishNewBlock(node, block);
            }));
        });
        this.findLastBlocks = (...args_1) => __awaiter(this, [...args_1], void 0, function* (limit = 1, chain) {
            let lastBlocks = [];
            let lastBlockHeight = -1;
            yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.getBlocks(node, chain, {
                    limit,
                    status: 'mined',
                });
                if (!req.error) {
                    let blocks = req.data;
                    blocks.forEach(block => {
                        if (block.height > lastBlockHeight) {
                            lastBlockHeight = block.height;
                            lastBlocks = blocks;
                        }
                    });
                }
            }));
            return lastBlocks;
        });
        this.getBlockByHash = (blockHash) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.getBlockByHash(node, blockHash);
                if (!req.error) {
                    return req.data;
                }
            }));
        });
        this.getBlockPackByHeight = (chain, height) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.getBlockPackByHeight(node, chain, height);
                if (!req.error) {
                    return {
                        block: new types_1.Block(req.data.block),
                        slices: req.data.slices.map(s => new types_1.Slice(s)),
                        txs: req.data.txs.map(tx => new types_1.Tx(tx)),
                    };
                }
            }));
        });
        this.getBlocks = (chain_1, ...args_2) => __awaiter(this, [chain_1, ...args_2], void 0, function* (chain, parameters = {}) {
            return yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.getBlocks(node, chain, parameters);
                if (!req.error) {
                    return req.data;
                }
            }));
        });
        this.countBlocks = (chain) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.countBlocks(node, chain);
                if (!req.error) {
                    return req.data.count;
                }
            }));
        });
        this.getSlicesFromBlock = (sliceHash) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.getSlicesFromBlock(node, sliceHash);
                if (!req.error) {
                    return req.data;
                }
            }));
        });
        this.web3 = web3;
    }
}
exports.BlocksActions = BlocksActions;
