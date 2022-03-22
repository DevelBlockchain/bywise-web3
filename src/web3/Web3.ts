import { Network, BywiseNode } from "../types";
import NetworkActions, { NetworkConfigs } from "./NetworkActions";
import TransactionsActions from "./TransactionsActions";
import AccountsActions from "./AccountsActions";


const defaultNetwork = {
    mainnet: new Network({
        isMainnet: true,
        nodes: [
            'https://node0.bywise.org',
            'https://node1.bywise.org',
        ],
        explorer: 'https://explorer.bywise.org'
    }),
    testnet: new Network({
        isMainnet: false,
        nodes: [
            'https://n0.bywise.org',
            'https://n1.bywise.org',
        ],
        explorer: 'https://testnet.bywise.org'
    }),
}

export default class Web3 {
    public readonly accounts: AccountsActions;
    public readonly network: NetworkActions;
    public readonly transactions: TransactionsActions;

    constructor(configs?: { isMainnet?: boolean, network?: Network, maxConnectedNodes?: number, createConnection?: () => Promise<BywiseNode> }) {
        let networkConfigs: NetworkConfigs = {
            isMainnet: true,
            network: defaultNetwork.mainnet,
            maxConnectedNodes: 10,
            createConnection: undefined,
        }
        if (configs) {
            if (configs.maxConnectedNodes) {
                networkConfigs.maxConnectedNodes = configs.maxConnectedNodes
            }
            if (configs.createConnection) {
                networkConfigs.createConnection = configs.createConnection
            }
            if (configs.network) {
                networkConfigs.network = configs.network;
            } else {
                if(configs.isMainnet === false) {
                    networkConfigs.network = defaultNetwork.testnet;
                }
            }
        }
        this.network = new NetworkActions(networkConfigs);
        this.transactions = new TransactionsActions(this);
        this.accounts = new AccountsActions(this);
    }
}