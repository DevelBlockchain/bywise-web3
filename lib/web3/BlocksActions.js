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
class BlocksActions {
    constructor(web3) {
        this.findLastBlocks = (limit = 100) => __awaiter(this, void 0, void 0, function* () {
            let lastBlocks = [];
            let lastBlockHeight = -1;
            yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.getBlocks(node, { limit });
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
        this.findBlocksFromHeight = (height, limit = 1) => __awaiter(this, void 0, void 0, function* () {
            let lastBlocks = [];
            let lastBlockHeight = -1;
            yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.getBlocks(node, {
                    height,
                    limit,
                    asc: true,
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
        this.getBlocks = (parameters) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.getBlocks(node, parameters);
                if (!req.error) {
                    return req.data;
                }
            }));
        });
        this.countBlocks = (parameters) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.countBlocks(node, parameters);
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
