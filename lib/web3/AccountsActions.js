"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountsActions = void 0;
const Wallet_1 = require("../utils/Wallet");
class AccountsActions {
    constructor(web3) {
        this.web3 = web3;
    }
    createWallet() {
        return new Wallet_1.Wallet({ isMainnet: this.web3.network.isMainnet });
    }
    importWallet(seed) {
        return new Wallet_1.Wallet({ isMainnet: this.web3.network.isMainnet, seed });
    }
}
exports.AccountsActions = AccountsActions;
