"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3 = void 0;
const AccountsActions_1 = require("./AccountsActions");
const NetworkActions_1 = require("./NetworkActions");
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
        let networkConfigs = {
            isMainnet: true,
            network: defaultNetwork.mainnet,
            maxConnectedNodes: 10,
            createConnection: undefined,
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
        this.accounts = new AccountsActions_1.AccountsActions(this);
    }
}
exports.Web3 = Web3;
