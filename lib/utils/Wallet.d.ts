export declare class InfoAddress {
    readonly version: string;
    readonly isMainnet: boolean;
    readonly isContract: boolean;
    readonly ethAddress: string;
    readonly tag: string;
    constructor(config: {
        version: string;
        isMainnet: boolean;
        isContract: boolean;
        ethAddress: string;
        tag: string;
    });
}
export default class Wallet {
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
