"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Wallet_1 = __importDefault(require("../utils/Wallet"));
class AccountsActions {
    constructor(web3) {
        this.web3 = web3;
    }
    createWallet() {
        return new Wallet_1.default({ isMainnet: this.web3.network.isMainnet });
    }
    importWallet(seed) {
        return new Wallet_1.default({ isMainnet: this.web3.network.isMainnet, seed });
    }
}
exports.default = AccountsActions;
