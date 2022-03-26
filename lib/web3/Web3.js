"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3 = void 0;
const WalletsActions_1 = require("./WalletsActions");
const BlocksActions_1 = require("./BlocksActions");
const NetworkActions_1 = require("./NetworkActions");
const SlicesActions_1 = require("./SlicesActions");
const TransactionsActions_1 = require("./TransactionsActions");
const defaultNetwork = {
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
};
class Web3 {
    constructor(configs) {
        this.debug = false;
        if (configs) {
            this.debug = configs.debug ? configs.debug : false;
        }
        let networkConfigs = {
            isMainnet: true,
            network: defaultNetwork.mainnet,
            maxConnectedNodes: 10,
            createConnection: undefined,
            debug: this.debug,
        };
        if (configs) {
            if (configs.maxConnectedNodes) {
                networkConfigs.maxConnectedNodes = configs.maxConnectedNodes;
            }
            if (configs.createConnection) {
                networkConfigs.createConnection = configs.createConnection;
            }
            if (configs.network) {
                networkConfigs.network = configs.network;
            }
            else {
                if (configs.isMainnet === false) {
                    networkConfigs.network = defaultNetwork.testnet;
                }
            }
        }
        this.network = new NetworkActions_1.NetworkActions(networkConfigs);
        this.transactions = new TransactionsActions_1.TransactionsActions(this);
        this.wallets = new WalletsActions_1.WalletsActions(this);
        this.blocks = new BlocksActions_1.BlocksActions(this);
        this.slices = new SlicesActions_1.SlicesActions(this);
    }
}
exports.Web3 = Web3;
