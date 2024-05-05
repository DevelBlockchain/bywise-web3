import { PublishedTx, Tx, TxOutput, TxType } from "../types";
import { Wallet } from "../utils";
import { Web3 } from "./Web3";
declare class ConfigTransactions {
    private readonly web3;
    constructor(web3: Web3);
    private toTransaction;
    voteBlock(wallet: Wallet, chain: string, hash: string, height: number): Promise<Tx>;
    startSlice(wallet: Wallet, chain: string, height: number): Promise<Tx>;
    stopSlice(wallet: Wallet, chain: string, height: number): Promise<Tx>;
    setConfigBlockTime(wallet: Wallet, chain: string, delay: number): Promise<Tx>;
    setConfigFeeBasic(wallet: Wallet, chain: string, coef: number): Promise<Tx>;
    setConfigFeeCoefSize(wallet: Wallet, chain: string, coef: number): Promise<Tx>;
    setConfigFeeCoefAmount(wallet: Wallet, chain: string, coef: number): Promise<Tx>;
    setConfigFeeCoefCost(wallet: Wallet, chain: string, coef: number): Promise<Tx>;
    setConfigPOI(wallet: Wallet, chain: string, count: number): Promise<Tx>;
    setConfigExecuteLimit(wallet: Wallet, chain: string, limit: number): Promise<Tx>;
    setConfigSizeLimit(wallet: Wallet, chain: string, limit: number): Promise<Tx>;
    setInfoName(wallet: Wallet, chain: string, name: string): Promise<Tx>;
    setInfoBio(wallet: Wallet, chain: string, bio: string): Promise<Tx>;
    setInfoUrl(wallet: Wallet, chain: string, url: string): Promise<Tx>;
    setInfoPhoto(wallet: Wallet, chain: string, photo: string): Promise<Tx>;
    setInfoPublicKey(wallet: Wallet, chain: string, publicKey: string): Promise<Tx>;
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
    buildSimpleTx: (wallet: Wallet, chain: string, to: string | string[], amount: string | string[], type?: TxType, data?: any, foreignKeys?: string[]) => Promise<Tx>;
    signTx: (wallets: Wallet[], tx: Tx) => Promise<Tx>;
    estimateFee: (tx: Tx) => Promise<TxOutput>;
    sendTransactionSync: (tx: Tx) => Promise<TxOutput>;
    sendTransaction: (tx: Tx) => Promise<string | undefined>;
    getTransactionByHash: (txHash: string) => Promise<PublishedTx | undefined>;
    getTxs: (chain: string, parameters?: {
        offset?: number;
        limit?: number;
        asc?: boolean;
        find?: {
            searchBy: 'address' | 'from' | 'to' | 'key' | 'status';
            value: string;
        };
    }) => Promise<PublishedTx[] | undefined>;
    countTxs: (parameters?: {
        chain?: string;
        find?: {
            searchBy: 'address' | 'from' | 'to' | 'key' | 'status';
            value: string;
        };
    }) => Promise<number | undefined>;
    waitConfirmation: (txHash: string, timeout?: number) => Promise<PublishedTx | undefined>;
}
export {};
