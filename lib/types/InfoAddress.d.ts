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
