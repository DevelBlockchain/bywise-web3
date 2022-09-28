import { Wallet, WalletInfo } from "../utils/Wallet";
import { Web3 } from "./Web3";

export class WalletsActions {
    private readonly web3: Web3;

    constructor(web3: Web3) {
        this.web3 = web3;
    }

    createWallet() {
        return new Wallet();
    }

    importWallet(seed: string) {
        return new Wallet({ seed });
    }

    getWalletInfo = async (address: string): Promise<WalletInfo | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.getWalletInfo(node, address);
            if (!req.error) {
                return req.data;
            }
        });
    }

    countWallets = async (): Promise<number | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.api.countWallets(node);
            if (!req.error) {
                return req.data.count;
            }
        });
    }
}