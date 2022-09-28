import { BywiseApiV1, BywiseApiV2, BywiseNode, BywiseResponse, Network } from "../types";
const randomstring = require("randomstring");

export type SendAction = (node: BywiseNode) => Promise<BywiseResponse<any>>
export type FilterAction<T> = (node: BywiseNode) => Promise<T | undefined>

export type NetworkConfigs = {
    isClient: boolean,
    myHost: string,
    networks: Network[],
    maxConnectedNodes: number,
    createConnection?: () => Promise<BywiseNode>
    debug: boolean,
};

export class NetworkActions {
    private readonly networks: Network[];
    private readonly chains: string[];
    public readonly api: BywiseApiV2;
    public readonly apiv1: BywiseApiV1;
    public readonly isClient: boolean;
    public readonly myHost: string;
    public readonly maxConnectedNodes: number;
    public isConnected: boolean = false;
    public connectedNodes: BywiseNode[] = [];

    constructor(configs: NetworkConfigs) {
        this.maxConnectedNodes = configs.maxConnectedNodes;
        this.apiv1 = new BywiseApiV1(configs.debug);
        this.api = new BywiseApiV2(configs.debug);
        this.networks = configs.networks;
        this.myHost = configs.myHost;
        this.isClient = configs.isClient;
        if (this.networks.length == 0) {
            throw new Error(`networks cant be empty`)
        }
        this.chains = [];
        for (let i = 0; i < this.networks.length; i++) {
            const networks = this.networks[i];
            if (!this.chains.includes(networks.chain)) {
                this.chains.push(networks.chain);
            }
        }
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
        await this.tryConnection();
    }

    private async populateKnowHosts(knowHosts: string[]) {
        for (let i = 0; i < this.networks.length; i++) {
            const network = this.networks[i];
            network.nodes.forEach(host => {
                if (!knowHosts.includes(host)) {
                    knowHosts.push(host);
                }
            })
        }
    }

    private includesChain(node: BywiseNode): boolean {
        for (let i = 0; i < node.chains.length; i++) {
            const chain = node.chains[i];
            if (this.chains.includes(chain)) {
                return true;
            }
        }
        return false;
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
                    if (this.includesChain(knowNode)) {
                        if (!knowHosts.includes(knowNode.host)) {
                            knowHosts.push(knowNode.host);
                        }
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

    private async tryConnecteKnowNodes(knowHosts: string[]) {
        for (let i = 0; i < knowHosts.length; i++) {
            const host = knowHosts[i];

            let myNode = undefined;
            if (!this.isClient) {
                myNode = await this.createConnection();
            }
            let handshake = await this.api.tryHandshake(host, myNode);
            if (!handshake.error) {
                handshake.data.host = host;
                this.connectedNodes.push(handshake.data);
            }
            if (this.connectedNodes.length >= this.maxConnectedNodes) {
                return;
            }
        }
    }

    tryConnection = async () => {
        let knowHosts: string[] = [];
        await this.populateKnowHosts(knowHosts);
        await this.excludeOfflineNodesAndUpdateKnowHosts(knowHosts);
        knowHosts = await this.removeConnectedNodes(knowHosts);
        await this.tryConnecteKnowNodes(knowHosts);

        if (this.connectedNodes.length > 0) {
            this.isConnected = true;
        } else {
            this.isConnected = false;
        }
        return this.connectedNodes.length;
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

    async sendAll(sendAction: SendAction, chain?: string): Promise<boolean> {
        if (!this.isConnected) throw new Error('First connect to blockchain - "web3.network.connect()"');
        let success = false;
        for (let i = 0; i < this.connectedNodes.length; i++) {
            const node = this.connectedNodes[i];
            if (chain === undefined || node.chains.includes(chain)) {
                let req = await sendAction(node);
                if (!req.error) {
                    success = true;
                }
            }
        }
        return success;
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