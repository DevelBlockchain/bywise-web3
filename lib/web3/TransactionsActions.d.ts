import { PublishedTx, Tx, TxBlockchainInfo, TxType } from "../types";
import { Wallet } from "../utils";
import { Web3 } from "./Web3";
export declare class TransactionsActions {
    private readonly web3;
    constructor(web3: Web3);
    buildSimpleTx: (wallet: Wallet, to: string, amount: string, type?: TxType | undefined, data?: any, foreignKeys?: string[] | undefined) => Promise<Tx>;
    buildTx: (from: string[], to: string[], amount: string[], type?: TxType | undefined, data?: any, foreignKeys?: string[] | undefined) => Promise<Tx>;
    signTx: (wallets: Wallet[], tx: Tx) => Promise<Tx>;
    estimateFee: (tx: Tx) => Promise<string>;
    sendTransaction: (tx: Tx) => Promise<boolean>;
    getTransactionByHash: (txHash: string) => Promise<PublishedTx | undefined>;
    getTransactionBlockchainInfo: (txHash: string) => Promise<TxBlockchainInfo | undefined>;
    getTxs: (parameters?: {
        from?: string[];
        to?: string[];
        foreignKeys?: string[];
        tag?: string;
        type?: string;
        status?: string;
        validator?: string;
        offset?: number;
        limit?: number;
        asc?: boolean;
    }) => Promise<PublishedTx[] | undefined>;
    countTxs: (parameters?: {
        from?: string[];
        to?: string[];
        foreignKeys?: string[];
        tag?: string;
        type?: string;
        status?: string;
        validator?: string;
    }) => Promise<number | undefined>;
}
