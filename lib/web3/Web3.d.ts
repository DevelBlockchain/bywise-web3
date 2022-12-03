import { BywiseNode } from "../types";
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
    static tryToken(node: BywiseNode): Promise<import("../types").BywiseResponse<import("../types").InfoNode>>;
    constructor(configs?: {
        initialNodes?: string[];
        maxConnectedNodes?: number;
        myHost?: string;
        createConnection?: () => Promise<BywiseNode>;
        getChains?: () => Promise<string[]>;
        debug?: boolean;
    });
}
