export declare class BywiseNode {
    version: string;
    chains: string[];
    host: string;
    address: string;
    expire?: number;
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
    host: string;
    version: string;
    timestamp: number;
    chains: string[];
    explorers: string[];
    nodes: BywiseNode[];
};
export declare type CountType = {
    count: number;
};
