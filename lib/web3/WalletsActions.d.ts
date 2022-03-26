import { Wallet } from "../utils/Wallet";
import { Web3 } from "./Web3";
export declare class WalletsActions {
    private readonly web3;
    constructor(web3: Web3);
    createWallet(): Wallet;
    importWallet(seed: string): Wallet;
}
