export declare class Network {
    readonly isMainnet: boolean;
    readonly nodes: string[];
    readonly explorer: string;
    constructor(network: {
        isMainnet: boolean;
        nodes: string[];
        explorer: string;
    });
}
