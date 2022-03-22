export class Network {
    public readonly isMainnet: boolean;
    public readonly nodes: string[];
    public readonly explorer: string;

    constructor(network: { isMainnet: boolean, nodes: string[], explorer: string }) {
        this.isMainnet = network.isMainnet;
        this.nodes = network.nodes;
        this.explorer = network.explorer;
    }
}