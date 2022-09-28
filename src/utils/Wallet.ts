import { ethers } from "ethers";
import { BywiseHelper } from "./BywiseHelper";

export class Wallet {
    public readonly seed: string;
    public readonly publicKey: string;
    public readonly address: string;
    private readonly account: ethers.Wallet;

    constructor(config?: { isMainnet?: boolean, seed?: string }) {
        if (config) {
            this.seed = config.seed ? config.seed : ethers.Wallet.createRandom()._mnemonic().phrase;
        } else {
            this.seed = ethers.Wallet.createRandom()._mnemonic().phrase;
        }
        this.account = ethers.Wallet.fromMnemonic(this.seed);
        this.publicKey = this.account.publicKey;
        this.address = this.getAddress();
    }

    getAddress = (tag = ''): string => {
        return BywiseHelper.encodeBWSAddress(true, false, this.account.address, tag);
    }

    signHash = async (hash: string): Promise<string> => {
        return (await this.account.signMessage(hash));
    }
}

export type WalletInfo = {
    balance: string,
    address: string,
    name?: string,
    photo?: string,
    url?: string,
    bio?: string,
    publicKey?: string,
}