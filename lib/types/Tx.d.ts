import { Block } from "./Block";
import { BywiseTransaction } from "./BywiseTransaction";
import { Slice } from "./Slice";
export declare enum TxType {
    TX_NONE = "none",
    TX_JSON = "json",
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
    validator?: string;
    from: string[];
    to: string[];
    amount: string[];
    tag: string;
    fee: string;
    type: TxType;
    foreignKeys?: string[];
    data: any;
    created: string;
    hash: string;
    validatorSign?: string;
    sign: string[];
    constructor(tx?: Partial<Tx>);
    toHash(): string;
    isValid(): void;
}
export declare type SimulateTx = {
    from: string[] | string;
    to: string[] | string;
    amount: string[] | string;
    tag: string;
    foreignKeys?: string[];
    type: TxType;
    data: any;
};
export declare type TxOutput = {
    cost?: number;
    size?: number;
    feeUsed: string;
    fee: string;
    logs?: string[];
    error?: string;
    output?: any;
};
export declare type TxBlockchainInfo = {
    tx?: Tx;
    slice?: Slice;
    block?: Block;
};
