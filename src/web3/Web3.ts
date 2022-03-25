import { Network, BywiseNode } from "../types";
import { WalletsActions } from "./WalletsActions";
import { BlocksActions } from "./BlocksActions";
import { NetworkActions, NetworkConfigs } from "./NetworkActions";
import { SlicesActions } from "./SlicesActions";
import { TransactionsActions } from "./TransactionsActions";


const defaultNetwork: { mainnet: Network, testnet: Network } = {
    mainnet: {
        isMainnet: true,
        nodes: [
            'https://node0.bywise.org',
            'https://node1.bywise.org',
        ],
        explorer: 'https://explorer.bywise.org'
    },
    testnet: {
        isMainnet: false,
        nodes: [
            'https://n0.bywise.org',
            'https://n1.bywise.org',
        ],
        explorer: 'https://testnet.bywise.org'
    },
}

export class Web3 {
    public readonly wallets: WalletsActions;
    public readonly network: NetworkActions;
    public readonly transactions: TransactionsActions;
    public readonly blocks: BlocksActions;
    public readonly slices: SlicesActions;
    private readonly debug: boolean = false;

    constructor(configs?: { isMainnet?: boolean, network?: Network, maxConnectedNodes?: number, createConnection?: () => Promise<BywiseNode>, debug?: boolean }) {
        if(configs) {
            this.debug = configs.debug ? configs.debug : false;
        }
        let networkConfigs: NetworkConfigs = {
            isMainnet: true,
            network: defaultNetwork.mainnet,
            maxConnectedNodes: 10,
            createConnection: undefined,
            debug: this.debug,
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
                if (configs.isMainnet === false) {
                    networkConfigs.network = defaultNetwork.testnet;
                }
            }
        }
        this.network = new NetworkActions(networkConfigs);
        this.transactions = new TransactionsActions(this);
        this.wallets = new WalletsActions(this);
        this.blocks = new BlocksActions(this);
        this.slices = new SlicesActions(this);
    }
}