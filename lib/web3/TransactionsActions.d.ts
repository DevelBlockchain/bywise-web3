import { BywiseResponse, Tx, TxType } from "../types";
import { Wallet } from "../utils";
import { Web3 } from "./Web3";
export declare class TransactionsActions {
    private readonly web3;
    constructor(web3: Web3);
    buildTx: (wallet: Wallet, to: string, amount: string, type?: TxType | undefined, data?: any, foreignKeys?: string[] | undefined) => Promise<Tx>;
    sendTransaction: (tx: Tx) => Promise<BywiseResponse>;
}
