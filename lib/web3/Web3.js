"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Web3 = void 0;
const types_1 = require("../types");
const WalletsActions_1 = require("./WalletsActions");
const BlocksActions_1 = require("./BlocksActions");
const NetworkActions_1 = require("./NetworkActions");
const SlicesActions_1 = require("./SlicesActions");
const TransactionsActions_1 = require("./TransactionsActions");
const defaultNetwork = {
    mainnet: {
        chain: 'mainnet',
        nodes: [
            'https://node0.bywise.org',
            'https://node1.bywise.org',
        ],
        explorer: 'https://explorer.bywise.org'
    },
    testnet: {
        chain: 'testnet',
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
            networks: [defaultNetwork.mainnet, defaultNetwork.testnet],
            isClient: false,
            maxConnectedNodes: 10,
            myHost: '',
            createConnection: undefined,
            debug: this.debug,
        };
        if (configs) {
            if (configs.maxConnectedNodes) {
                networkConfigs.maxConnectedNodes = configs.maxConnectedNodes;
            }
            if (configs.createConnection) {
                networkConfigs.createConnection = configs.createConnection;
                networkConfigs.isClient = false;
            }
            if (configs.myHost) {
                networkConfigs.myHost = configs.myHost;
                networkConfigs.isClient = false;
            }
            if (configs.networks) {
                networkConfigs.networks = configs.networks;
            }
        }
        this.network = new NetworkActions_1.NetworkActions(networkConfigs);
        this.transactions = new TransactionsActions_1.TransactionsActions(this);
        this.wallets = new WalletsActions_1.WalletsActions(this);
        this.blocks = new BlocksActions_1.BlocksActions(this);
        this.slices = new SlicesActions_1.SlicesActions(this);
    }
    static tryToken(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const api = new types_1.BywiseApiV2();
            return yield api.tryToken(node);
        });
    }
}
exports.Web3 = Web3;
