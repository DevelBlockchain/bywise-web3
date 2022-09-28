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
exports.Wallet = void 0;
const ethers_1 = require("ethers");
const BywiseHelper_1 = require("./BywiseHelper");
class Wallet {
    constructor(config) {
        this.getAddress = (tag = '') => {
            return BywiseHelper_1.BywiseHelper.encodeBWSAddress(true, false, this.account.address, tag);
        };
        this.signHash = (hash) => __awaiter(this, void 0, void 0, function* () {
            return (yield this.account.signMessage(hash));
        });
        if (config) {
            this.seed = config.seed ? config.seed : ethers_1.ethers.Wallet.createRandom()._mnemonic().phrase;
        }
        else {
            this.seed = ethers_1.ethers.Wallet.createRandom()._mnemonic().phrase;
        }
        this.account = ethers_1.ethers.Wallet.fromMnemonic(this.seed);
        this.publicKey = this.account.publicKey;
        this.address = this.getAddress();
    }
}
exports.Wallet = Wallet;
