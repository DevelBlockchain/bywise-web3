import { PublishedTx, Tx, TxBlockchainInfo, TxType } from "../types";
import { Wallet } from "../utils";
import { Web3 } from "./Web3";
declare class ConfigTransactions {
    private readonly web3;
    constructor(web3: Web3);
    private toTransaction;
    setConfig(wallet: Wallet, chain: string, name: string, value: string): Promise<Tx>;
    addAdmin(wallet: Wallet, chain: string, address: string): Promise<Tx>;
    removeAdmin(wallet: Wallet, chain: string, address: string): Promise<Tx>;
    addValidator(wallet: Wallet, chain: string, address: string, type: 'block' | 'slice'): Promise<Tx>;
    removeValidator(wallet: Wallet, chain: string, address: string, type: 'block' | 'slice'): Promise<Tx>;
    setBalance(wallet: Wallet, chain: string, address: string, balance: string): Promise<Tx>;
    addBalance(wallet: Wallet, chain: string, address: string, balance: string): Promise<Tx>;
    subBalance(wallet: Wallet, chain: string, address: string, balance: string): Promise<Tx>;
}
export declare class TransactionsActions {
    private readonly web3;
    buildConfig: ConfigTransactions;
    constructor(web3: Web3);
    buildSimpleTx: (wallet: Wallet, chain: string, to: string, amount: string, type?: TxType | undefined, data?: any, foreignKeys?: string[] | undefined) => Promise<Tx>;
    buildTx: (chain: string, from: string[], to: string[], amount: string[], type?: TxType | undefined, data?: any, foreignKeys?: string[] | undefined) => Promise<Tx>;
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
    waitConfirmation: (txHash: string, timeout: number) => Promise<PublishedTx | undefined>;
}
export {};
