import { BywiseApi, BywiseNode, BywiseResponse, Network } from "../types";
const randomstring = require("randomstring");

export type SendAction = (node: BywiseNode) => Promise<BywiseResponse<any>>
export type FilterAction<T> = (node: BywiseNode) => Promise<T | undefined>

export type NetworkConfigs = {
    isMainnet: boolean,
    network: Network,
    maxConnectedNodes: number,
    createConnection?: () => Promise<BywiseNode>
    debug: boolean,
};

export class NetworkActions {
    private updateInterval: any;
    private readonly network: Network;
    public onlineNodes: string[] = [];
    public readonly api: BywiseApi;
    public readonly isMainnet: boolean = true;
    public readonly maxConnectedNodes: number;
    private isDisconnect: boolean = false;
    public isConnected: boolean = false;
    public connectedNodes: BywiseNode[] = [];

    constructor(configs: NetworkConfigs) {
        this.maxConnectedNodes = configs.maxConnectedNodes;
        this.api = new BywiseApi(configs.debug);
        this.network = configs.network;
        this.isMainnet = configs.network.isMainnet;
        if (configs.createConnection) {
            this.createConnection = configs.createConnection
        }
    }

    private createConnection = async () => {
        return new BywiseNode({
            isFullNode: false,
            token: randomstring.generate()
        });
    }

    exportConnections = () => {
        return {
            isConnected: this.isConnected,
            connectedNodes: this.connectedNodes,
        }
    }

    importConnections = async (payload: any) => {
        this.isConnected = payload.isConnected;
        this.connectedNodes = payload.connectedNodes;
        await this.tryConnection();
    }

    tryConnection = async () => {
        if (this.network.nodes.length === 0) {
            this.isConnected = true;
            return;
        }
        for (let i = this.connectedNodes.length - 1; i >= 0; i--) {
            const node = this.connectedNodes[i];
            let req = await this.api.tryToken(node);
            if (req.error) {
                this.connectedNodes = this.connectedNodes.filter(n => n.host !== node.host);
            }
        }
        let testNodes: string[] = [];
        this.onlineNodes.forEach(host => {
            let connected = false;
            this.connectedNodes.forEach(n => {
                if (n.host === host) {
                    connected = true;
                }
            })
            if (!connected) {
                testNodes.push(host)
            }
        });
        this.network.nodes.forEach(host => {
            testNodes.push(host)
        });
        for (let i = 0; i < testNodes.length && this.connectedNodes.length < this.maxConnectedNodes; i++) {
            const nodeHost = testNodes[i];
            if (nodeHost !== this.network.myHost) {
                let info = await this.api.getInfo(nodeHost);
                if (info.error) {
                    this.onlineNodes = this.onlineNodes.filter(host => host !== nodeHost);
                } else {
                    if (!this.onlineNodes.includes(nodeHost)) {
                        this.onlineNodes.push(nodeHost);
                    }
                    let isConnected = false;
                    this.connectedNodes.forEach(n => {
                        if (n.host === nodeHost) {
                            isConnected = true;
                        }
                    })
                    if (!isConnected) {
                        let handshake = await this.api.tryHandshake(nodeHost, await this.createConnection());
                        if (!handshake.error) {
                            this.connectedNodes.push(handshake.data);
                        }
                    }
                    info.data.nodes.forEach((node: BywiseNode) => {
                        if (node.isFullNode && node.host) {
                            if (!testNodes.includes(node.host)) {
                                testNodes.push(node.host);
                            }
                        }
                    });
                }
            }
        }
        if (this.connectedNodes.length > 0) {
            this.isConnected = true;
        } else {
            this.isConnected = false;
        }
        return this.connectedNodes.length;
    }

    getRandomNode = () => {
        if (!this.isConnected) throw new Error('First connect to blockchain - "web3.network.connect()"');
        return this.connectedNodes[Math.floor(Math.random() * (this.connectedNodes.length - 1))];
    }

    async sendAll(sendAction: SendAction): Promise<boolean> {
        if (!this.isConnected) throw new Error('First connect to blockchain - "web3.network.connect()"');
        let success = false;
        for (let i = 0; i < this.connectedNodes.length; i++) {
            const node = this.connectedNodes[i];
            let req = await sendAction(node);
            if (!req.error) {
                success = true;
            }
        }
        return success;
    }

    async findAll<T>(filterAction: FilterAction<T>): Promise<T | undefined> {
        if (!this.isConnected) throw new Error('First connect to blockchain - "web3.network.connect()"');
        for (let i = 0; i < this.connectedNodes.length; i++) {
            const node = this.connectedNodes[i];
            let req = await filterAction(node);
            if (req !== undefined) {
                return req;
            }
        }
    }
}