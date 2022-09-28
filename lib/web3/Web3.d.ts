import { Network, BywiseNode } from "../types";
import { WalletsActions } from "./WalletsActions";
import { BlocksActions } from "./BlocksActions";
import { NetworkActions } from "./NetworkActions";
import { SlicesActions } from "./SlicesActions";
import { TransactionsActions } from "./TransactionsActions";
export declare class Web3 {
    readonly wallets: WalletsActions;
    readonly network: NetworkActions;
    readonly transactions: TransactionsActions;
    readonly blocks: BlocksActions;
    readonly slices: SlicesActions;
    private readonly debug;
    constructor(configs?: {
        networks?: Network[];
        maxConnectedNodes?: number;
        myHost?: string;
        createConnection?: () => Promise<BywiseNode>;
        debug?: boolean;
    });
}
