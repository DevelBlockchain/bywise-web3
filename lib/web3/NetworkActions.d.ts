import { BywiseApi, BywiseNode, BywiseResponse, Network } from "../types";
export declare type SendAction = (node: BywiseNode) => Promise<BywiseResponse<any>>;
export declare type FilterAction<T> = (node: BywiseNode) => Promise<T | undefined>;
export declare type NetworkConfigs = {
    isClient: boolean;
    networks: Network[];
    maxConnectedNodes: number;
    createConnection?: () => Promise<BywiseNode>;
    debug: boolean;
};
export declare class NetworkActions {
    private readonly networks;
    private readonly chains;
    readonly api: BywiseApi;
    readonly isClient: boolean;
    readonly maxConnectedNodes: number;
    isConnected: boolean;
    connectedNodes: BywiseNode[];
    constructor(configs: NetworkConfigs);
    private createConnection;
    exportConnections: () => {
        isConnected: boolean;
        connectedNodes: BywiseNode[];
    };
    importConnections: (payload: any) => Promise<void>;
    private populateKnowHosts;
    private includesChain;
    private excludeOfflineNodesAndUpdateKnowHosts;
    private removeConnectedNodes;
    private tryConnecteKnowNodes;
    tryConnection: () => Promise<number>;
    addNode: (node: BywiseNode) => void;
    getRandomNode: (chain?: string | undefined) => BywiseNode;
    sendAll(sendAction: SendAction, chain?: string): Promise<boolean>;
    findAll<T>(filterAction: FilterAction<T>, chain?: string): Promise<T | undefined>;
}
