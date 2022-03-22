"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const types_1 = require("../types");
const NetworkActions_1 = __importDefault(require("./NetworkActions"));
const TransactionsActions_1 = __importDefault(require("./TransactionsActions"));
const AccountsActions_1 = __importDefault(require("./AccountsActions"));
const defaultNetwork = {
    mainnet: new types_1.Network({
        isMainnet: true,
        nodes: [
            'https://node0.bywise.org',
            'https://node1.bywise.org',
        ],
        explorer: 'https://explorer.bywise.org'
    }),
    testnet: new types_1.Network({
        isMainnet: false,
        nodes: [
            'https://n0.bywise.org',
            'https://n1.bywise.org',
        ],
        explorer: 'https://testnet.bywise.org'
    }),
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
        this.network = new NetworkActions_1.default(networkConfigs);
        this.transactions = new TransactionsActions_1.default(this);
        this.accounts = new AccountsActions_1.default(this);
    }
}
exports.default = Web3;
