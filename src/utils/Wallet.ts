import { ethers } from "ethers";
import BywiseHelper from './BywiseHelper';


export class InfoAddress {
    public readonly version: string;
    public readonly isMainnet: boolean;
    public readonly isContract: boolean;
    public readonly ethAddress: string;
    public readonly tag: string;

    constructor(config: { version: string, isMainnet: boolean, isContract: boolean, ethAddress: string, tag: string }) {
        this.version = config.version;
        this.isMainnet = config.isMainnet;
        this.isContract = config.isContract;
        this.ethAddress = config.ethAddress;
        this.tag = config.tag;
    }
}

export default class Wallet {
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