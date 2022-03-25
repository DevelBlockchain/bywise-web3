import { BywiseResponse, CountType, SimulateTx, Tx, TxBlockchainInfo, TxOutput, TxType } from "../types";
import { BywiseHelper, Wallet } from "../utils";
import { Web3 } from "./Web3";

export class TransactionsActions {
    private readonly web3: Web3;

    constructor(web3: Web3) {
        this.web3 = web3;
    }

    buildSimpleTx = async (wallet: Wallet, to: string, amount: string, type?: TxType, data?: any, foreignKeys?: string[]): Promise<Tx> => {
        let tx = new Tx();
        tx.version = "1";
        tx.from = [wallet.address];
        tx.to = [to];
        tx.amount = [amount];
        tx.tag = BywiseHelper.getAddressTag(to);
        tx.type = type ? type : TxType.TX_NONE;
        if (type) {
            tx.data = data ? data : {};
        } else {
            tx.data = {};
        }
        tx.foreignKeys = foreignKeys;
        tx.created = new Date().toISOString();
        tx.fee = await this.estimateFee(tx);
        tx.hash = tx.toHash();
        tx.sign = [await wallet.signHash(tx.hash)];
        return tx;
    }

    buildTx = async (from: string[], to: string[], amount: string[], type?: TxType, data?: any, foreignKeys?: string[]): Promise<Tx> => {
        let tx = new Tx();
        tx.version = "1";
        tx.from = from;
        tx.to = to;
        tx.amount = amount;
        if (to.length === 0) throw new Error("field to can`t be empty")
        tx.tag = BywiseHelper.getAddressTag(to[0]);
        tx.type = type ? type : TxType.TX_NONE;
        if (type) {
            tx.data = data ? data : {};
        } else {
            tx.data = {};
        }
        tx.foreignKeys = foreignKeys;
        tx.created = new Date().toISOString();
        tx.sign = from.map(() => "");
        return tx;
    }

    signTx = async (wallets: Wallet[], tx: Tx): Promise<Tx> => {
        if (tx.sign.length !== tx.from.length) throw new Error('from field must be the same length as sign');
        tx.hash = tx.toHash();
        for (let i = 0; i < tx.from.length; i++) {
            const from = tx.from[i];
            for (let j = 0; j < wallets.length; j++) {
                const wallet = wallets[j];
                if (wallet.address === from) {
                    tx.sign[i] = await wallet.signHash(tx.hash);
                }
            }
        }
        return tx;
    }

    estimateFee = async (tx: Tx): Promise<string> => {
        let simulateTx: SimulateTx = {
            from: tx.from,
            to: tx.to,
            tag: tx.tag,
            amount: tx.amount,
            type: tx.type,
            data: tx.data,
            foreignKeys: tx.foreignKeys,
        };
        let simulate = await this.web3.network.api.getFeeTransaction(this.web3.network.getRandomNode(), simulateTx);
        if (simulate.error) {
            throw new Error(`Can't simulate transaction - details: ${simulate.error}`)
        };
        return simulate.data.fee;
    }

    sendTransaction = async (tx: Tx): Promise<boolean> => {
        return await this.web3.network.sendAll(async (node) => {
            return await this.web3.network.api.publishNewTransaction(node, tx);
        });
    }

    getTransactionByHash = async (txHash: string): Promise<Tx | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getTransactionByHash(node, txHash);
            if (!req.error) {
                return req.data;
            }
        });
    }

    getTransactionBlockchainInfo = async (txHash: string): Promise<TxBlockchainInfo | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getTxBlockchainInfo(node, txHash);
            if (!req.error) {
                return req.data;
            }
        });
    }

    getTxs = async (parameters: { from?: string[], to?: string[], foreignKeys?: string[], tag?: string, type?: string, status?: string, validator?: string, offset?: number, limit?: number, asc?: boolean }): Promise<Tx[] | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getTxs(node, parameters);
            if (!req.error) {
                return req.data;
            }
        });
    }

    countTxs = async (parameters: { from?: string[], to?: string[], foreignKeys?: string[], tag?: string, type?: string, status?: string, validator?: string }): Promise<number | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.countTxs(node, parameters);
            if (!req.error) {
                return req.data.count;
            }
        });
    }
}