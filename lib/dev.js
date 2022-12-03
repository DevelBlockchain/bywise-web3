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
const types_1 = require("./types");
const utils_1 = require("./utils");
const Web3_1 = require("./web3/Web3");
const chain = 'local';
(() => __awaiter(void 0, void 0, void 0, function* () {
    let web3 = new Web3_1.Web3({
        initialNodes: ['http://localhost:3000'],
        debug: true
    });
    const wallet = web3.wallets.importWallet('theme enter range boat shine brain coffee exact reflect ability mask hair');
    console.log('create web3 ');
    yield web3.network.tryConnection();
    console.log('connected web3');
    let tx;
    let confirmedTx;
    let contractAddress = 'BWS1MC78B76926fE3157da1671C408a0cf27aaBDBb65589ff';
    tx = yield web3.transactions.buildConfig.addBalance(wallet, chain, wallet.address, `1000`);
    confirmedTx = yield web3.transactions.waitConfirmation(tx.hash, 10000);
    tx = yield web3.transactions.buildSimpleTx(wallet, chain, utils_1.BywiseHelper.ZERO_ADDRESS, '0', types_1.TxType.TX_CONTRACT, {
        code: '() => {return Math.random();}'
    });
    yield web3.transactions.sendTransaction(tx);
    confirmedTx = yield web3.transactions.waitConfirmation(tx.hash, 10000);
    contractAddress = confirmedTx === null || confirmedTx === void 0 ? void 0 : confirmedTx.output.output.contractAddress;
    tx = yield web3.transactions.buildSimpleTx(wallet, chain, contractAddress, '0', types_1.TxType.TX_CONTRACT_EXE, {
        code: '()'
    });
    yield web3.transactions.sendTransaction(tx);
    confirmedTx = yield web3.transactions.waitConfirmation(tx.hash, 10000);
    console.log(confirmedTx);
    console.log('disconnected web3');
}))();
