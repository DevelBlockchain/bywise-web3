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
exports.WalletsActions = void 0;
const Wallet_1 = require("../utils/Wallet");
class WalletsActions {
    constructor(web3) {
        this.getWalletInfo = (address, chain) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.getAPI(node).getWalletInfo(node, address, chain);
                if (!req.error) {
                    return req.data;
                }
            }));
        });
        this.web3 = web3;
    }
    createWallet() {
        return new Wallet_1.Wallet();
    }
    importWallet(seed) {
        return new Wallet_1.Wallet({ seed });
    }
}
exports.WalletsActions = WalletsActions;
