import { ethers } from "ethers";
import { BywiseHelper } from "./BywiseHelper";

export class Wallet {
    public readonly seed: string;
    public readonly publicKey: string;
    public readonly address: string;
    private readonly account: ethers.HDNodeWallet;

    constructor(config?: { isMainnet?: boolean, seed?: string }) {
        if (config && config.seed) {
            this.seed = config.seed;
        } else {
            let mnemonic = ethers.Wallet.createRandom().mnemonic
            if(!mnemonic) throw new Error('cant generate mnemonic phrase')
            this.seed = mnemonic.phrase;
        }
        this.account = ethers.Wallet.fromPhrase(this.seed);
        this.publicKey = this.account.publicKey;
        this.address = this.getAddress();
    }

    getAddress = (tag = ''): string => {
        return BywiseHelper.encodeBWSAddress(false, this.account.address, tag);
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