import { BywiseApiV1, BywiseApiV2, BywiseNode, BywiseResponse } from "../types";
export type SendAction = (node: BywiseNode) => Promise<BywiseResponse<any>>;
export type FilterAction<T> = (node: BywiseNode) => Promise<T | undefined>;
export type NetworkConfigs = {
    isClient: boolean;
    myHost: string;
    initialNodes: string[];
    maxConnectedNodes: number;
    createConnection?: () => Promise<BywiseNode>;
    debug: boolean;
};
export declare class NetworkActions {
    readonly api: BywiseApiV2;
    readonly apiv1: BywiseApiV1;
    readonly isClient: boolean;
    readonly myHost: string;
    readonly maxConnectedNodes: number;
    initialNodes: string[];
    isConnected: boolean;
    connectedNodes: BywiseNode[];
    knowHosts: string[];
    constructor(configs: NetworkConfigs);
    private createConnection;
    exportConnections: () => {
        isConnected: boolean;
        connectedNodes: BywiseNode[];
    };
    importConnections: (payload: any) => Promise<void>;
    private tryConnectNode;
    connect(initialNodes?: string[]): Promise<boolean>;
    disconnect(): void;
    testConnections(): Promise<boolean>;
    addNode: (node: BywiseNode) => void;
    getRandomNode: (chain?: string) => BywiseNode;
    sendAll(sendAction: SendAction, chain?: string): Promise<string | undefined>;
    findAll<T>(filterAction: FilterAction<T>, chain?: string): Promise<T | undefined>;
}
