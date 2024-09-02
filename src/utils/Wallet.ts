import { ethers } from "ethers";
import { BywiseAddressType, BywiseHelper } from "./BywiseHelper";

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
            if (!mnemonic) throw new Error('cant generate mnemonic phrase')
            this.seed = mnemonic.phrase;
        }
        this.account = ethers.Wallet.fromPhrase(this.seed);
        this.publicKey = this.account.publicKey;
        this.address = this.getAddress();
    }

    getExtendedPublicKey = (account: number): string => {
        const node = ethers.HDNodeWallet.fromPhrase(this.seed).derivePath(`${account}'`);
        return node.neuter().extendedKey;
    }

    getAddress = (tag = ''): string => {
        return BywiseHelper.encodeBWSAddress(BywiseAddressType.ADDRESS_TYPE_USER, this.account.address, tag);
    }

    getStealthAddress = (account: number, index: number, tag = ''): string => {
        const node = ethers.HDNodeWallet.fromPhrase(this.seed).derivePath(`${account}'/${index}`);
        return BywiseHelper.encodeBWSAddress(BywiseAddressType.ADDRESS_TYPE_STEALTH, node.address, tag);
    }

    signHash = async (hash: string): Promise<string> => {
        return (await this.account.signMessage(hash));
    }

    signStealthAddressHash = async (hash: string, account: number, index: number): Promise<string> => {
        const node = ethers.HDNodeWallet.fromPhrase(this.seed).derivePath(`${account}'/${index}`);
        return (await node.signMessage(hash));
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