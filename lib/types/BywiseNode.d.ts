export declare class BywiseNode {
    version: string;
    chains: string[];
    host: string;
    address: string;
    expire?: number;
    token?: string;
    constructor(config: Partial<BywiseNode>);
}
export type ConfigNode = {
    name: string;
    value: string;
    type: string;
};
export type InfoNode = {
    address: string;
    host: string;
    version: string;
    timestamp: number;
    chains: string[];
    explorers: string[];
    nodes: BywiseNode[];
};
export type CountType = {
    count: number;
};
