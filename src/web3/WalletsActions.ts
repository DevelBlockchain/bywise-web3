import { Wallet } from "../utils/Wallet";
import { Web3 } from "./Web3";

export class WalletsActions {
    private readonly web3: Web3;

    constructor(web3: Web3) {
        this.web3 = web3;
    }

    createWallet() {
        return new Wallet({ isMainnet: this.web3.network.isMainnet });
    }

    importWallet(seed: string) {
        return new Wallet({ isMainnet: this.web3.network.isMainnet, seed });
    }
}