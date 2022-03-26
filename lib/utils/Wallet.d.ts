export declare class Wallet {
    readonly seed: string;
    readonly publicKey: string;
    readonly address: string;
    readonly isMainnet: boolean;
    private readonly account;
    constructor(config?: {
        isMainnet?: boolean;
        seed?: string;
    });
    getAddress: (tag?: string) => string;
    signHash: (hash: string) => Promise<string>;
}
export declare type WalletInfo = {
    balance: string;
    address: string;
    name?: string;
    photo?: string;
    url?: string;
    bio?: string;
    publicKey?: string;
};
