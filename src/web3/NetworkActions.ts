import { BywiseApiV1, BywiseApiV2, BywiseNode, BywiseResponse, Network } from "../types";
const randomstring = require("randomstring");

export type SendAction = (node: BywiseNode) => Promise<BywiseResponse<any>>
export type FilterAction<T> = (node: BywiseNode) => Promise<T | undefined>

export type NetworkConfigs = {
    isClient: boolean,
    myHost: string,
    initialNodes: string[],
    maxConnectedNodes: number,
    createConnection?: () => Promise<BywiseNode>
    debug: boolean,
};

export class NetworkActions {
    public readonly api: BywiseApiV2;
    public readonly apiv1: BywiseApiV1;
    public readonly isClient: boolean;
    public readonly myHost: string;
    public readonly maxConnectedNodes: number;
    public initialNodes: string[];
    public isConnected: boolean = false;
    public connectedNodes: BywiseNode[] = [];

    constructor(configs: NetworkConfigs) {
        this.maxConnectedNodes = configs.maxConnectedNodes;
        this.apiv1 = new BywiseApiV1(configs.debug);
        this.api = new BywiseApiV2(configs.debug);
        this.initialNodes = configs.initialNodes;
        this.myHost = configs.myHost;
        this.isClient = configs.isClient;
        if (configs.createConnection) {
            this.createConnection = configs.createConnection
        }
    }

    private createConnection = async () => {
        return new BywiseNode({});
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
    }

    private async populateKnowHosts(knowHosts: string[]) {
        this.initialNodes.forEach(host => {
            if (!knowHosts.includes(host)) {
                knowHosts.push(host);
            }
        })
    }

    private async excludeOfflineNodesAndUpdateKnowHosts(knowHosts: string[]) {
        for (let i = this.connectedNodes.length - 1; i >= 0; i--) {
            const node = this.connectedNodes[i];
            let req = await this.api.tryToken(node);
            if (req.error) {
                this.connectedNodes = this.connectedNodes.filter(n => n.host !== node.host);
            } else {
                const nodes = req.data.nodes;
                for (let j = 0; j < nodes.length; j++) {
                    const knowNode = nodes[j];
                    if (!knowHosts.includes(knowNode.host)) {
                        knowHosts.push(knowNode.host);
                    }
                }
            }
        }
    }

    private async removeConnectedNodes(knowHosts: string[]) {
        const newKnowHosts: string[] = [];
        for (let i = knowHosts.length - 1; i >= 0; i--) {
            const host = knowHosts[i];

            let found = false;
            if (host === this.myHost) {
                found = true;
            }
            this.connectedNodes.forEach(n => {
                if (n.host === host) {
                    found = true;
                }
            })
            if (!found) {
                newKnowHosts.push(host);
            }
        }
        return newKnowHosts;
    }

    private async tryConnectNode(host: string): Promise<BywiseNode | null> {
        let myNode = undefined;
        if (!this.isClient) {
            myNode = await this.createConnection();
        }
        let handshake = await this.api.tryHandshake(host, myNode);
        if (!handshake.error) {
            handshake.data.host = host;
            return handshake.data;
        }
        return null;
    }

    private async tryConnecteKnowNodes(knowHosts: string[]) {
        for (let i = 0; i < knowHosts.length; i++) {
            const host = knowHosts[i];

            const node = await this.tryConnectNode(host);
            if (node) {
                this.connectedNodes.push(node);
            }
            if (this.connectedNodes.length >= this.maxConnectedNodes) {
                return;
            }
        }
    }

    async tryConnection() {
        this.isConnected = false;
        let knowHosts: string[] = [];
        await this.populateKnowHosts(knowHosts);
        if (knowHosts.length === 0) {
            this.isConnected = true;
        }
        await this.excludeOfflineNodesAndUpdateKnowHosts(knowHosts);
        knowHosts = await this.removeConnectedNodes(knowHosts);
        await this.tryConnecteKnowNodes(knowHosts);
        if (this.connectedNodes.length > 0) {
            this.isConnected = true;
        }
        return this.connectedNodes.length;
    }

    async updateConnections(initialNodes?: string[]) {
        if (initialNodes !== undefined) {
            this.initialNodes = initialNodes;
        }
        const now = Math.floor(Date.now() / 1000);
        const updatedNodes: BywiseNode[] = [];
        for (let i = this.connectedNodes.length - 1; i >= 0; i--) {
            const node = this.connectedNodes[i];
            if (node.expire && node.expire < now) {
                const updateNode = await this.tryConnectNode(node.host);
                if (updateNode) {
                    updatedNodes.push(updateNode);
                }
            } else {
                updatedNodes.push(node);
            }
        }
        for (let i = 0; i < this.initialNodes.length; i++) {
            const host = this.initialNodes[i];
            let found = false;
            for (let j = 0; j < updatedNodes.length && !found; j++) {
                const node = updatedNodes[j];
                if (node.host === host) {
                    found = true;
                }
            }
            if (!found && updatedNodes.length < this.maxConnectedNodes) {
                const newNode = await this.tryConnectNode(host);
                if (newNode) {
                    updatedNodes.push(newNode);
                }
            }
        }
        this.connectedNodes = updatedNodes;
        let isConnected = false;
        if (this.initialNodes.length === 0) {
            isConnected = true;
        }
        if (this.connectedNodes.length > 0) {
            isConnected = true;
        }
        this.isConnected = isConnected;
        return this.isConnected;
    }

    disconnect() {
        this.connectedNodes = [];
        this.isConnected = false;
    }

    async testConnections() {
        let success = this.initialNodes.length === 0;
        for (let i = this.connectedNodes.length - 1; i >= 0 && !success; i--) {
            const node = this.connectedNodes[i];
            let req = await this.api.tryToken(node);
            if (req.error) {
                this.connectedNodes = this.connectedNodes.filter(n => n.host !== node.host);
            } else {
                success = true;
            }
        }
        return success;
    }

    addNode = (node: BywiseNode) => {
        if (node.host === this.myHost) {
            return;
        }
        for (let i = 0; i < this.connectedNodes.length; i++) {
            const connectedNode = this.connectedNodes[i];
            if (connectedNode.host === node.host) {
                connectedNode.address = node.address;
                connectedNode.chains = node.chains;
                connectedNode.expire = node.expire;
                connectedNode.token = node.token;
                connectedNode.version = node.version;
                return;
            }
        }
        this.connectedNodes.push(node);
    }

    getRandomNode = (chain?: string) => {
        if (!this.isConnected) throw new Error('First connect to blockchain - "web3.network.connect()"');
        let chainNodes: BywiseNode[] = [];
        if (chain) {
            this.connectedNodes.forEach(n => {
                if (n.chains.includes(chain)) {
                    chainNodes.push(n);
                }
            })
        } else {
            chainNodes = this.connectedNodes.map(n => n);
        }
        return chainNodes[Math.floor(Math.random() * (chainNodes.length - 1))];
    }

    async sendAll(sendAction: SendAction, chain?: string): Promise<string | undefined> {
        if (!this.isConnected) throw new Error('First connect to blockchain - "web3.network.connect()"');
        let error: string | undefined = undefined;
        let success = false;
        for (let i = 0; i < this.connectedNodes.length; i++) {
            const node = this.connectedNodes[i];
            if (chain === undefined || node.chains.includes(chain)) {
                let req = await sendAction(node);
                if (!req.error) {
                    success = true;
                } else {
                    error = req.error;
                }
            }
        }
        if (success) {
            return undefined;
        }
        return error;
    }

    async findAll<T>(filterAction: FilterAction<T>, chain?: string): Promise<T | undefined> {
        if (!this.isConnected) throw new Error('First connect to blockchain - "web3.network.connect()"');
        for (let i = 0; i < this.connectedNodes.length; i++) {
            const node = this.connectedNodes[i];
            if (chain === undefined || node.chains.includes(chain)) {
                let req = await filterAction(node);
                if (req !== undefined) {
                    return req;
                }
            }
        }
    }
}