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
const types_1 = require("../types");
const Helper_1 = __importDefault(require("../utils/Helper"));
class TransactionsActions {
    constructor(web3) {
        this.buildTx = (wallet, to, amount, type, data, foreignKeys, validator) => __awaiter(this, void 0, void 0, function* () {
            let tx = new types_1.Tx();
            tx.version = "1";
            tx.validator = validator ? validator : wallet.address;
            tx.from = wallet.address;
            tx.to = to;
            tx.amount = amount;
            tx.tag = Helper_1.default.getAddressTag(to);
            tx.type = type ? type : types_1.TxType.TX_NONE;
            if (type) {
                tx.data = data ? data : {};
            }
            else {
                tx.data = {};
            }
            tx.foreignKeys = foreignKeys;
            tx.created = new Date().toISOString();
            let simulateTx = {
                from: tx.from,
                to: tx.to,
                tag: tx.tag,
                amount: tx.amount,
                type: tx.type,
                data: tx.data,
                foreignKeys: tx.foreignKeys,
            };
            let simulate = yield this.web3.network.api.getFeeTransaction(this.web3.network.getRandomNode(), simulateTx);
            if (simulate.error) {
                throw new Error(`Can't simulate transaction - details: ${simulate.error}`);
            }
            ;
            tx.fee = simulate.data.fee;
            tx.hash = tx.toHash();
            tx.sign = yield wallet.signHash(tx.hash);
            tx.validatorSign = tx.sign;
            return tx;
        });
        this.sendTransaction = (tx) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.send((node) => __awaiter(this, void 0, void 0, function* () {
                return yield this.web3.network.api.publishNewTransaction(node, tx);
            }));
        });
        this.web3 = web3;
    }
}
exports.default = TransactionsActions;
