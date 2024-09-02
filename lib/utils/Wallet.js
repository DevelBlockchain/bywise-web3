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
        this.getExtendedPublicKey = (account) => {
            const node = ethers_1.ethers.HDNodeWallet.fromPhrase(this.seed).derivePath(`${account}'`);
            return node.neuter().extendedKey;
        };
        this.getAddress = (tag = '') => {
            return BywiseHelper_1.BywiseHelper.encodeBWSAddress(BywiseHelper_1.BywiseAddressType.ADDRESS_TYPE_USER, this.account.address, tag);
        };
        this.getStealthAddress = (account, index, tag = '') => {
            const node = ethers_1.ethers.HDNodeWallet.fromPhrase(this.seed).derivePath(`${account}'/${index}`);
            return BywiseHelper_1.BywiseHelper.encodeBWSAddress(BywiseHelper_1.BywiseAddressType.ADDRESS_TYPE_STEALTH, node.address, tag);
        };
        this.signHash = (hash) => __awaiter(this, void 0, void 0, function* () {
            return (yield this.account.signMessage(hash));
        });
        this.signStealthAddressHash = (hash, account, index) => __awaiter(this, void 0, void 0, function* () {
            const node = ethers_1.ethers.HDNodeWallet.fromPhrase(this.seed).derivePath(`${account}'/${index}`);
            return (yield node.signMessage(hash));
        });
        if (config && config.seed) {
            this.seed = config.seed;
        }
        else {
            let mnemonic = ethers_1.ethers.Wallet.createRandom().mnemonic;
            if (!mnemonic)
                throw new Error('cant generate mnemonic phrase');
            this.seed = mnemonic.phrase;
        }
        this.account = ethers_1.ethers.Wallet.fromPhrase(this.seed);
        this.publicKey = this.account.publicKey;
        this.address = this.getAddress();
    }
}
exports.Wallet = Wallet;
