import { Network, BywiseNode } from "../types";
import { AccountsActions } from "./AccountsActions";
import { NetworkActions } from "./NetworkActions";
import { TransactionsActions } from "./TransactionsActions";
export declare class Web3 {
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
