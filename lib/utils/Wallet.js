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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InfoAddress = void 0;
const ethers_1 = require("ethers");
const Helper_1 = __importDefault(require("./Helper"));
class InfoAddress {
    constructor(config) {
        this.version = config.version;
        this.isMainnet = config.isMainnet;
        this.isContract = config.isContract;
        this.ethAddress = config.ethAddress;
        this.tag = config.tag;
    }
}
exports.InfoAddress = InfoAddress;
class Wallet {
    constructor(config) {
        this.getAddress = (tag = '') => {
            return Helper_1.default.encodeBWSAddress(this.isMainnet, false, this.account.address, tag);
        };
        this.signHash = (hash) => __awaiter(this, void 0, void 0, function* () {
            return (yield this.account.signMessage(hash));
        });
        if (config) {
            this.isMainnet = config.isMainnet ? config.isMainnet : true;
            this.seed = config.seed ? config.seed : ethers_1.ethers.Wallet.createRandom()._mnemonic().phrase;
        }
        else {
            this.isMainnet = true;
            this.seed = ethers_1.ethers.Wallet.createRandom()._mnemonic().phrase;
        }
        this.account = ethers_1.ethers.Wallet.fromMnemonic(this.seed);
        this.publicKey = this.account.publicKey;
        this.address = this.getAddress();
    }
}
exports.default = Wallet;
