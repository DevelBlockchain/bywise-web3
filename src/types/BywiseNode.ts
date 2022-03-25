export class BywiseNode {
    isFullNode: boolean;
    version: string;
    updated: string;
    host?: string;
    address?: string;
    token?: string;

    constructor(config: Partial<BywiseNode>) {
        this.isFullNode = config.isFullNode ? config.isFullNode : false;
        this.version = config.version ? config.version : '1';
        this.updated = config.updated ? config.updated : new Date().toISOString();
        this.host = config.host;
        this.address = config.address;
        this.token = config.token;
    }
}

export type ConfigNode = {
    name: string;
    value: string;
    type: string;
}

export type InfoNode = {
    address: string;
    host?: string;
    version: string;
    timestamp: string;
    isFullNode: boolean;
    nodesLimit: number;
    explorer: string;
    nodes: BywiseNode[];
    configs: ConfigNode[];
}

export type CountType = {
    count: number
}