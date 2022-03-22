import BywiseTransaction from './BywiseTransaction';
export declare enum TxType {
    TX_NONE = "none",
    TX_JSON = "json",
    TX_COMMAND = "command",
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
    validator: string;
    from: string[] | string;
    to: string[] | string;
    amount: string[] | string;
    tag: string;
    fee: string;
    type: TxType;
    foreignKeys?: string[];
    data: any;
    created: string;
    hash: string;
    validatorSign: string;
    sign: string[] | string;
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
