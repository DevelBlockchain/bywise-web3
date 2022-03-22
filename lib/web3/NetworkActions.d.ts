import { BywiseApi, BywiseNode, BywiseResponse, Network } from "../types";
export declare type SendAction = (node: BywiseNode) => Promise<BywiseResponse>;
export declare type NetworkConfigs = {
    isMainnet: boolean;
    network: Network;
    maxConnectedNodes: number;
    createConnection?: () => Promise<BywiseNode>;
};
export declare class NetworkActions {
    private updateInterval;
    private readonly network;
    private onlineNodes;
    readonly api: BywiseApi;
    readonly isMainnet: boolean;
    readonly maxConnectedNodes: number;
    isConnected: boolean;
    connectedNodes: BywiseNode[];
    constructor(configs: NetworkConfigs);
    private createConnection;
    connect: () => Promise<void>;
    disconnect: () => void;
    private updateConnection;
    getRandomNode: () => BywiseNode;
    send: (sendAction: SendAction) => Promise<BywiseResponse>;
}
