export class BywiseNode {
    isFullNode: boolean;
    version: string;
    updated: string;
    host?: string;
    address?: string;
    token?: string;

    constructor(config: { address?: string, isFullNode: boolean, host?: string, version?: string, updated?: string, token?: string }) {
        this.isFullNode = config.isFullNode;
        this.version = config.version ? config.version : '1';
        this.updated = config.updated ? config.updated : new Date().toISOString();
        this.host = config.host;
        this.address = config.address;
        this.token = config.token;
    }
}