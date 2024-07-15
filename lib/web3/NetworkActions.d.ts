import { BywiseApiV2, BywiseNode, BywiseResponse } from "../types";
import { BywiseApiV2_WS } from "../types/BywiseApiV2_WS";
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
    private readonly apiWS;
    private readonly api;
    private readonly apiv1;
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
    getAPI(node: BywiseNode): BywiseApiV2 | BywiseApiV2_WS;
    private tryConnectNode;
    connect(initialNodes?: string[]): Promise<boolean>;
    disconnect(): void;
    testConnections(): Promise<boolean>;
    addNode: (node: BywiseNode) => void;
    getRandomNode: (chain?: string) => BywiseNode;
    sendAll(sendAction: SendAction, chain?: string): Promise<string | undefined>;
    findAll<T>(filterAction: FilterAction<T>, chain?: string): Promise<T | undefined>;
}
