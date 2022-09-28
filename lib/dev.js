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
const Web3_1 = require("./web3/Web3");
(() => __awaiter(void 0, void 0, void 0, function* () {
    let web3 = new Web3_1.Web3({
        //isMainnet: false,
        //network: { isMainnet: false, nodes: ['http://localhost'], explorer: '' },
        network: { isMainnet: false, nodes: [], explorer: '' },
        debug: true
    });
    let wallet = web3.wallets.importWallet('theme enter range boat shine brain coffee exact reflect ability mask hair');
    console.log('create web3');
    yield web3.network.tryConnection();
    console.log('connected web3');
    let blocks = yield web3.blocks.findLastBlocks(3);
    console.log(blocks);
    console.log('disconnected web3');
}))();
