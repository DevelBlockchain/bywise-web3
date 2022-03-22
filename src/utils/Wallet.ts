import { ethers } from "ethers";
import { BywiseHelper } from "./BywiseHelper";

export class Wallet {
    public readonly seed: string;
    public readonly publicKey: string;
    public readonly address: string;
    public readonly isMainnet: boolean;
    private readonly account: ethers.Wallet;

    constructor(config?: { isMainnet?: boolean, seed?: string }) {
        if (config) {
            this.isMainnet = config.isMainnet ? config.isMainnet : true;
            this.seed = config.seed ? config.seed : ethers.Wallet.createRandom()._mnemonic().phrase;
        } else {
            this.isMainnet = true;
            this.seed = ethers.Wallet.createRandom()._mnemonic().phrase;
        }
        this.account = ethers.Wallet.fromMnemonic(this.seed);
        this.publicKey = this.account.publicKey;
        this.address = this.getAddress();
    }

    getAddress = (tag = ''): string => {
        return BywiseHelper.encodeBWSAddress(this.isMainnet, false, this.account.address, tag);
    }

    signHash = async (hash: string): Promise<string> => {
        return (await this.account.signMessage(hash));
    }
}