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
