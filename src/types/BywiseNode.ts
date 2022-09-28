export class BywiseNode {
    version: string;
    expire: number;
    chains: string[];
    host: string;
    address: string;
    token?: string;

    constructor(config: Partial<BywiseNode>) {
        this.version = config.version ?? '';
        this.expire = config.expire ?? 0;
        this.chains = config.chains ?? [];
        this.host = config.host ?? '';
        this.address = config.address ?? '';
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
    host: string;
    version: string;
    timestamp: string;
    chains: string[];
    explorers: string[];
    nodes: BywiseNode[];
    configs: ConfigNode[];
}

export type CountType = {
    count: number
}