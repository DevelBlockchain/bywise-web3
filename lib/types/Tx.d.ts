import { Block } from "./Block";
import { BywiseTransaction } from "./BywiseTransaction";
import { Slice } from "./Slice";
export declare enum TxType {
    TX_NONE = "none",
    TX_JSON = "json",
    TX_BLOCKCHAIN_COMMAND = "blockchain-command",
    TX_COMMAND = "command",
    TX_COMMAND_INFO = "command-info",
    TX_CONTRACT = "contract",
    TX_CONTRACT_EXE = "contract-exe",
    TX_FILE = "file",
    TX_STRING = "string",
    TX_EN_JSON = "json-encrypt",
    TX_EN_COMMAND = "command-encrypt",
    TX_EN_CONTRACT = "contract-encrypt",
    TX_EN_CONTRACT_EXE = "contract-exe-encrypt",
    TX_EN_FILE = "file-encrypt",
    TX_EN_STRING = "string-encrypt"
}
export declare class Tx implements BywiseTransaction {
    version: string;
    chain: string;
    validator?: string[];
    from: string[];
    to: string[];
    amount: string[];
    fee: string;
    type: string;
    foreignKeys?: string[];
    data: any;
    created: number;
    hash: string;
    validatorSign?: string[];
    output?: TxOutput;
    sign: string[];
    constructor(tx?: Partial<Tx>);
    toHash(): string;
    isValid(): void;
}
export type TransactionEventEntry = {
    key: string;
    value: string;
};
export type TransactionEvent = {
    contractAddress: string;
    eventName: string;
    entries: TransactionEventEntry[];
    hash: string;
};
export type EnvironmentChanges = {
    keys: string[];
    values: (string | null)[];
};
export type TransactionChanges = {
    get: string[];
    walletAddress: string[];
    walletAmount: string[];
    envOut: EnvironmentChanges;
};
export type TxOutput = {
    cost?: number;
    size?: number;
    feeUsed: string;
    fee: string;
    fromSlice: string;
    logs?: string[];
    error?: string;
    debit: string;
    output?: any;
    events: TransactionEvent[];
    changes: TransactionChanges;
};
export type SimulateTx = {
    chain: string;
    from: string[] | string;
    to: string[] | string;
    amount: string[] | string;
    foreignKeys?: string[];
    type: string;
    data: any;
};
export type SimulateContract = {
    code?: string;
    method?: string;
    inputs?: string[];
    from: string;
    contractAddress?: string;
    amount: number;
    env: any;
};
export type OutputSimulateContract = {
    error?: string;
    stack?: string;
    output: any;
    env: any;
};
export type PublishedTx = {
    version: string;
    validator?: string[];
    from: string[];
    to: string[];
    amount: string[];
    fee: string;
    type: string;
    foreignKeys?: string[];
    data: any;
    created: number;
    hash: string;
    validatorSign?: string[];
    sign: string[];
    status: string;
    output: TxOutput;
};
export type TxBlockchainInfo = {
    tx: PublishedTx;
    slice?: Slice;
    block?: Block;
};
