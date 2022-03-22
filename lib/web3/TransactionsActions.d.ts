import { BywiseResponse, Tx, TxType } from "../types";
import Wallet from "../utils/Wallet";
import Web3 from "./Web3";
export default class TransactionsActions {
    private readonly web3;
    constructor(web3: Web3);
    buildTx: (wallet: Wallet, to: string, amount: string, type?: TxType | undefined, data?: any, foreignKeys?: string[] | undefined, validator?: string | undefined) => Promise<Tx>;
    sendTransaction: (tx: Tx) => Promise<BywiseResponse>;
}
