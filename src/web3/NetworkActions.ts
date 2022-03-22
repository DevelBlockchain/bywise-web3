import { BywiseApi, BywiseNode, BywiseResponse, Network } from "../types";
const randomstring = require("randomstring");

export type SendAction = (node: BywiseNode) => Promise<BywiseResponse>

export type NetworkConfigs = {
    isMainnet: boolean,
    network: Network,
    maxConnectedNodes: number,
    createConnection?: () => Promise<BywiseNode>
};

export default class NetworkActions {
    private updateInterval: any;
    private readonly network: Network;
    private onlineNodes: string[] = [];
    public readonly api: BywiseApi;
    public readonly isMainnet: boolean = true;
    public readonly maxConnectedNodes: number;
    public isConnected: boolean = false;
    public connectedNodes: BywiseNode[] = [];

    constructor(configs: NetworkConfigs) {
        this.maxConnectedNodes = configs.maxConnectedNodes;
        this.api = new BywiseApi();
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

    connect = async () => {
        if (!this.isConnected) {
            await this.updateConnection();
            this.updateInterval = setInterval(this.updateConnection, 30000);
        }
    }

    disconnect = () => {
        clearInterval(this.updateInterval);
        this.isConnected = false;
        this.connectedNodes = [];
        this.onlineNodes = [];
    }

    private updateConnection = async () => {
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
        if (this.connectedNodes.length > 0) {
            this.isConnected = true;
        } else {
            this.isConnected = false;
            throw new Error('Bywise Web3 - Can\'t connect any node');
        }
    }

    getRandomNode = () => {
        if (!this.isConnected) throw new Error('First connect to blockchain - "web3.network.connect()"');
        return this.connectedNodes[Math.floor(Math.random() * (this.connectedNodes.length - 1))];
    }

    send = async (sendAction: SendAction) => {
        if (!this.isConnected) throw new Error('First connect to blockchain - "web3.network.connect()"');
        let req = new BywiseResponse();
        let successReq: BywiseResponse | undefined = undefined;
        for (let i = 0; i < this.connectedNodes.length; i++) {
            const node = this.connectedNodes[i];
            req = await sendAction(node);
            if (!req.error) {
                successReq = req;
            }
        }
        if (!successReq) throw new Error(`send failed - details: ${req.error}`);
        return successReq;
    }
}