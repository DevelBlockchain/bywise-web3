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
const types_1 = require("./types");
const Helper_1 = __importDefault(require("./utils/Helper"));
const Web3_1 = __importDefault(require("./web3/Web3"));
(() => __awaiter(void 0, void 0, void 0, function* () {
    let web3 = new Web3_1.default({
        //isMainnet: false,
        network: new types_1.Network({ isMainnet: false, nodes: ['http://localhost:443'], explorer: '' }),
    });
    let wallet = web3.accounts.importWallet('theme enter range boat shine brain coffee exact reflect ability mask hair');
    console.log('create web3');
    yield web3.network.connect();
    console.log('connect web3');
    let tx = yield web3.transactions.buildTx(wallet, Helper_1.default.ZERO_ADDRESS, '0');
    console.log('tx', JSON.stringify(tx));
    tx.isValid();
    let response = yield web3.transactions.sendTransaction(tx);
    console.log('response', response);
    yield web3.network.disconnect();
}))();
