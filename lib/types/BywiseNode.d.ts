export declare class BywiseNode {
    isFullNode: boolean;
    version: string;
    updated: string;
    host?: string;
    address?: string;
    token?: string;
    constructor(config: Partial<BywiseNode>);
}
export declare type ConfigNode = {
    name: string;
    value: string;
    type: string;
};
export declare type InfoNode = {
    address: string;
    host?: string;
    version: string;
    timestamp: string;
    isFullNode: boolean;
    nodesLimit: number;
    explorer: string;
    nodes: BywiseNode[];
    configs: ConfigNode[];
};
export declare type CountType = {
    count: number;
};
