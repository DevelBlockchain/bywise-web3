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
exports.TransactionsActions = void 0;
const types_1 = require("../types");
const utils_1 = require("../utils");
class ConfigTransactions {
    constructor(web3) {
        this.web3 = web3;
    }
    toTransaction(wallet, chain, cfg, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield this.web3.transactions.buildSimpleTx(wallet, chain, utils_1.BywiseHelper.ZERO_ADDRESS, '0', type, cfg);
            tx.isValid();
            return tx;
        });
    }
    voteBlock(wallet, chain, hash, height) {
        return this.toTransaction(wallet, chain, {
            name: 'vote-block',
            input: [hash, `${height}`]
        }, types_1.TxType.TX_BLOCKCHAIN_COMMAND);
    }
    startSlice(wallet, chain, height) {
        return this.toTransaction(wallet, chain, {
            name: 'start-slice',
            input: [`${height}`]
        }, types_1.TxType.TX_BLOCKCHAIN_COMMAND);
    }
    stopSlice(wallet, chain, height) {
        return this.toTransaction(wallet, chain, {
            name: 'stop-slice',
            input: [`${height}`]
        }, types_1.TxType.TX_BLOCKCHAIN_COMMAND);
    }
    setConfigBlockTime(wallet, chain, delay) {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['blockTime', `${delay}`]
        }, types_1.TxType.TX_COMMAND);
    }
    setConfigFeeBasic(wallet, chain, coef) {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['feeBasic', `${coef}`]
        }, types_1.TxType.TX_COMMAND);
    }
    setConfigFeeCoefSize(wallet, chain, coef) {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['feeCoefSize', `${coef}`]
        }, types_1.TxType.TX_COMMAND);
    }
    setConfigFeeCoefAmount(wallet, chain, coef) {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['feeCoefAmount', `${coef}`]
        }, types_1.TxType.TX_COMMAND);
    }
    setConfigFeeCoefCost(wallet, chain, coef) {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['feeCoefCost', `${coef}`]
        }, types_1.TxType.TX_COMMAND);
    }
    setConfigPOI(wallet, chain, count) {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['poi', `${count}`]
        }, types_1.TxType.TX_COMMAND);
    }
    setConfigExecuteLimit(wallet, chain, limit) {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['executeLimit', `${limit}`]
        }, types_1.TxType.TX_COMMAND);
    }
    setConfigSizeLimit(wallet, chain, limit) {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['sizeLimit', `${limit}`]
        }, types_1.TxType.TX_COMMAND);
    }
    setInfoName(wallet, chain, name) {
        return this.toTransaction(wallet, chain, {
            name: 'setInfo',
            input: ['name', name]
        }, types_1.TxType.TX_COMMAND_INFO);
    }
    setInfoBio(wallet, chain, bio) {
        return this.toTransaction(wallet, chain, {
            name: 'setInfo',
            input: ['bio', bio]
        }, types_1.TxType.TX_COMMAND_INFO);
    }
    setInfoUrl(wallet, chain, url) {
        return this.toTransaction(wallet, chain, {
            name: 'setInfo',
            input: ['url', url]
        }, types_1.TxType.TX_COMMAND_INFO);
    }
    setInfoPhoto(wallet, chain, photo) {
        return this.toTransaction(wallet, chain, {
            name: 'setInfo',
            input: ['photo', photo]
        }, types_1.TxType.TX_COMMAND_INFO);
    }
    setInfoPublicKey(wallet, chain, publicKey) {
        return this.toTransaction(wallet, chain, {
            name: 'setInfo',
            input: ['publicKey', publicKey]
        }, types_1.TxType.TX_COMMAND_INFO);
    }
    addAdmin(wallet, chain, address) {
        return this.toTransaction(wallet, chain, {
            name: 'addAdmin',
            input: [address]
        }, types_1.TxType.TX_COMMAND);
    }
    removeAdmin(wallet, chain, address) {
        return this.toTransaction(wallet, chain, {
            name: 'removeAdmin',
            input: [address]
        }, types_1.TxType.TX_COMMAND);
    }
    addValidator(wallet, chain, address, type) {
        return this.toTransaction(wallet, chain, {
            name: 'addValidator',
            input: [address, type]
        }, types_1.TxType.TX_COMMAND);
    }
    removeValidator(wallet, chain, address, type) {
        return this.toTransaction(wallet, chain, {
            name: 'removeValidator',
            input: [address, type]
        }, types_1.TxType.TX_COMMAND);
    }
    setBalance(wallet, chain, address, balance) {
        return this.toTransaction(wallet, chain, {
            name: 'setBalance',
            input: [address, balance]
        }, types_1.TxType.TX_COMMAND);
    }
    addBalance(wallet, chain, address, balance) {
        return this.toTransaction(wallet, chain, {
            name: 'addBalance',
            input: [address, balance]
        }, types_1.TxType.TX_COMMAND);
    }
    subBalance(wallet, chain, address, balance) {
        return this.toTransaction(wallet, chain, {
            name: 'subBalance',
            input: [address, balance]
        }, types_1.TxType.TX_COMMAND);
    }
}
class TransactionsActions {
    constructor(web3) {
        this.buildSimpleTx = (wallet, chain, to, amount, type, data, foreignKeys) => __awaiter(this, void 0, void 0, function* () {
            const node = yield this.web3.network.getRandomNode();
            const info = yield this.web3.network.api.getInfo(node.host);
            let tx = new types_1.Tx();
            tx.chain = chain;
            tx.version = "2";
            tx.from = [wallet.address];
            tx.to = Array.isArray(to) ? to : [to];
            tx.amount = Array.isArray(amount) ? amount : [amount];
            tx.type = type ? type : types_1.TxType.TX_NONE;
            if (type) {
                tx.data = data ? data : {};
            }
            else {
                tx.data = {};
            }
            tx.foreignKeys = foreignKeys ? foreignKeys : [];
            tx.created = info.data.timestamp;
            tx.fee = (yield this.estimateFee(tx)).feeUsed;
            tx.hash = tx.toHash();
            tx.sign = [yield wallet.signHash(tx.hash)];
            return tx;
        });
        this.signTx = (wallets, tx) => __awaiter(this, void 0, void 0, function* () {
            if (tx.sign.length !== tx.from.length)
                throw new Error('from field must be the same length as sign');
            tx.hash = tx.toHash();
            for (let i = 0; i < tx.from.length; i++) {
                const from = tx.from[i];
                for (let j = 0; j < wallets.length; j++) {
                    const wallet = wallets[j];
                    if (wallet.address === from) {
                        tx.sign[i] = yield wallet.signHash(tx.hash);
                    }
                }
            }
            return tx;
        });
        this.estimateFee = (tx) => __awaiter(this, void 0, void 0, function* () {
            let simulateTx = {
                chain: tx.chain,
                from: tx.from,
                to: tx.to,
                amount: tx.amount,
                type: tx.type,
                data: tx.data,
                foreignKeys: tx.foreignKeys,
            };
            let simulate = yield this.web3.network.api.getFeeTransaction(this.web3.network.getRandomNode(), simulateTx);
            if (simulate.error) {
                throw new Error(`Internal error - details: ${simulate.error}`);
            }
            ;
            if (simulate.data.error) {
                throw new Error(`Can't simulate transaction - details: ${simulate.data.error}`);
            }
            ;
            return simulate.data;
        });
        this.sendTransactionSync = (tx) => __awaiter(this, void 0, void 0, function* () {
            const error = yield this.sendTransaction(tx);
            if (error)
                throw new Error(`Failed send transaction - ${error}`);
            const minedTx = yield this.waitConfirmation(tx.hash, 120000);
            if (!minedTx)
                throw new Error(`Timeout`);
            if (minedTx.status === 'confirmed' || minedTx.status === 'mined') {
                return minedTx.output;
            }
            else {
                throw new Error(`Invalidated transaction${minedTx.output ? (' - ' + minedTx.output.error) : ''}`);
            }
        });
        this.sendTransaction = (tx) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.sendAll((node) => __awaiter(this, void 0, void 0, function* () {
                return yield this.web3.network.api.publishNewTransaction(node, tx);
            }));
        });
        this.getTransactionByHash = (txHash) => __awaiter(this, void 0, void 0, function* () {
            return yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.getTransactionByHash(node, txHash);
                if (!req.error) {
                    return req.data;
                }
            }));
        });
        this.getTxs = (chain_1, ...args_1) => __awaiter(this, [chain_1, ...args_1], void 0, function* (chain, parameters = {}) {
            return yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.getTxs(node, chain, parameters);
                if (!req.error) {
                    return req.data;
                }
            }));
        });
        this.countTxs = (...args_1) => __awaiter(this, [...args_1], void 0, function* (parameters = {}) {
            return yield this.web3.network.findAll((node) => __awaiter(this, void 0, void 0, function* () {
                let req = yield this.web3.network.api.countTxs(node, parameters);
                if (!req.error) {
                    return req.data.count;
                }
            }));
        });
        this.waitConfirmation = (txHash_1, ...args_1) => __awaiter(this, [txHash_1, ...args_1], void 0, function* (txHash, timeout = 30000) {
            let uptime = Date.now();
            let response;
            while (Date.now() < uptime + timeout) {
                response = yield this.getTransactionByHash(txHash);
                yield utils_1.BywiseHelper.sleep(500);
                if (response && response.status !== 'mempool') {
                    return response;
                }
            }
            return response;
        });
        this.web3 = web3;
        this.buildConfig = new ConfigTransactions(web3);
    }
}
exports.TransactionsActions = TransactionsActions;
