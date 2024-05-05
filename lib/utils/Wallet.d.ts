export declare class Wallet {
    readonly seed: string;
    readonly publicKey: string;
    readonly address: string;
    private readonly account;
    constructor(config?: {
        isMainnet?: boolean;
        seed?: string;
    });
    getExtendedPublicKey: (account: number) => string;
    getAddress: (tag?: string) => string;
    getStealthAddress: (account: number, index: number, tag?: string) => string;
    signHash: (hash: string) => Promise<string>;
    signStealthAddressHash: (hash: string, account: number, index: number) => Promise<string>;
}
export type WalletInfo = {
    balance: string;
    address: string;
    name?: string;
    photo?: string;
    url?: string;
    bio?: string;
    publicKey?: string;
};
