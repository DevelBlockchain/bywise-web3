import { Network, BywiseNode } from "../types";
import NetworkActions from "./NetworkActions";
import TransactionsActions from "./TransactionsActions";
import AccountsActions from "./AccountsActions";
export default class Web3 {
    readonly accounts: AccountsActions;
    readonly network: NetworkActions;
    readonly transactions: TransactionsActions;
    constructor(configs?: {
        isMainnet?: boolean;
        network?: Network;
        maxConnectedNodes?: number;
        createConnection?: () => Promise<BywiseNode>;
    });
}
