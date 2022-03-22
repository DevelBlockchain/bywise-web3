export declare class BywiseNode {
    isFullNode: boolean;
    version: string;
    updated: string;
    host?: string;
    address?: string;
    token?: string;
    constructor(config: {
        address?: string;
        isFullNode: boolean;
        host?: string;
        version?: string;
        updated?: string;
        token?: string;
    });
}
