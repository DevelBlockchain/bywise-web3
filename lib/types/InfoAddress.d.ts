export declare class InfoAddress {
    readonly version: string;
    readonly isContract: boolean;
    readonly ethAddress: string;
    readonly tag: string;
    constructor(config: {
        version: string;
        isContract: boolean;
        ethAddress: string;
        tag: string;
    });
}
