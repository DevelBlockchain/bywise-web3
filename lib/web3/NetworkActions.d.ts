import { BywiseApi, BywiseNode, BywiseResponse, Network } from "../types";
export declare type SendAction = (node: BywiseNode) => Promise<BywiseResponse<any>>;
export declare type FilterAction<T> = (node: BywiseNode) => Promise<T | undefined>;
export declare type NetworkConfigs = {
    isMainnet: boolean;
    network: Network;
    maxConnectedNodes: number;
    createConnection?: () => Promise<BywiseNode>;
    debug: boolean;
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
    sendAll(sendAction: SendAction): Promise<boolean>;
    findAll<T>(filterAction: FilterAction<T>): Promise<T | undefined>;
}
