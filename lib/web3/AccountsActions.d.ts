import { Wallet } from "../utils/Wallet";
import { Web3 } from "./Web3";
export declare class AccountsActions {
    private readonly web3;
    constructor(web3: Web3);
    createWallet(): Wallet;
    importWallet(seed: string): Wallet;
}
