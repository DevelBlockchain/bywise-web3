import { BywiseApiV1, BywiseApiV2, BywiseNode, BywiseResponse } from "../types";
export declare type SendAction = (node: BywiseNode) => Promise<BywiseResponse<any>>;
export declare type FilterAction<T> = (node: BywiseNode) => Promise<T | undefined>;
export declare type NetworkConfigs = {
    isClient: boolean;
    myHost: string;
    initialNodes: string[];
    maxConnectedNodes: number;
    createConnection?: () => Promise<BywiseNode>;
    debug: boolean;
};
export declare class NetworkActions {
    readonly initialNodes: string[];
    readonly api: BywiseApiV2;
    readonly apiv1: BywiseApiV1;
    readonly isClient: boolean;
    readonly myHost: string;
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
    private excludeOfflineNodesAndUpdateKnowHosts;
    private removeConnectedNodes;
    private tryConnecteKnowNodes;
    tryConnection: () => Promise<number>;
    testConnections(): Promise<boolean>;
    addNode: (node: BywiseNode) => void;
    getRandomNode: (chain?: string | undefined) => BywiseNode;
    sendAll(sendAction: SendAction, chain?: string): Promise<boolean>;
    findAll<T>(filterAction: FilterAction<T>, chain?: string): Promise<T | undefined>;
}
