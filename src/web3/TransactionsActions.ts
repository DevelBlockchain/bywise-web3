import { BywiseResponse, SimulateTx, Tx, TxType } from "../types";
import { BywiseHelper, Wallet } from "../utils";
import { Web3 } from "./Web3";

export class TransactionsActions {
    private readonly web3: Web3;

    constructor(web3: Web3) {
        this.web3 = web3;
    }

    buildTx = async (wallet: Wallet, to: string, amount: string, type?: TxType, data?: any, foreignKeys?: string[]): Promise<Tx> => {
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

        tx.fee = simulate.data.fee;
        tx.hash = tx.toHash();
        tx.sign = [await wallet.signHash(tx.hash)];
        return tx;
    }

    sendTransaction = async (tx: Tx): Promise<BywiseResponse> => {
        return await this.web3.network.send(async (node) => {
            return await this.web3.network.api.publishNewTransaction(node, tx);
        });
    }
}