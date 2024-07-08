import { BywiseHelper } from "../utils/BywiseHelper";
import { Block } from "./Block";
import { BywiseTransaction } from "./BywiseTransaction";
import { Slice } from "./Slice";

export enum TxType {
    TX_NONE = 'none',
    TX_JSON = 'json',
    TX_BLOCKCHAIN_COMMAND = 'blockchain-command',
    TX_COMMAND = 'command',
    TX_COMMAND_INFO = "command-info",
    TX_CONTRACT = 'contract',
    TX_CONTRACT_EXE = 'contract-exe',
    TX_FILE = 'file',
    TX_STRING = 'string',
    TX_EN_JSON = 'json-encrypt',
    TX_EN_COMMAND = 'command-encrypt',
    TX_EN_CONTRACT = 'contract-encrypt',
    TX_EN_CONTRACT_EXE = 'contract-exe-encrypt',
    TX_EN_FILE = 'file-encrypt',
    TX_EN_STRING = 'string-encrypt',
}

export class Tx implements BywiseTransaction {
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

    constructor(tx?: Partial<Tx>) {
        this.version = tx?.version ?? '';
        this.chain = tx?.chain ?? 'mainnet';
        this.validator = tx?.validator;
        this.from = tx?.from ?? [];
        this.to = tx?.to ?? [];
        this.amount = tx?.amount ?? [];
        this.fee = tx?.fee ?? '';
        this.type = tx?.type ?? TxType.TX_NONE;
        this.foreignKeys = tx?.foreignKeys;
        this.data = tx?.data ?? {};
        this.output = tx?.output;
        this.created = tx?.created ?? 0;
        this.hash = tx?.hash ?? '';
        this.validatorSign = tx?.validatorSign;
        this.sign = tx?.sign ?? [];
    }

    toHash(): string {
        let bytes = '';
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        if (this.version == '2') {
            bytes += Buffer.from(this.chain, 'utf-8').toString('hex');
        }
        if (this.validator) {
            if (this.validator) {
                this.validator.forEach(addr => {
                    bytes += Buffer.from(addr, 'utf-8').toString('hex');;
                })
            }
        }
        this.from.forEach(from => {
            bytes += Buffer.from(from, 'utf-8').toString('hex');
        })
        this.to.forEach(to => {
            bytes += Buffer.from(to, 'utf-8').toString('hex');
        })
        this.amount.forEach(amount => {
            bytes += Buffer.from(amount, 'utf-8').toString('hex');
        })
        bytes += Buffer.from(this.fee, 'utf-8').toString('hex');
        bytes += Buffer.from(this.type, 'utf-8').toString('hex');
        bytes += Buffer.from(BywiseHelper.jsonToString(this.data), 'utf-8').toString('hex');
        if (this.foreignKeys) {
            this.foreignKeys.forEach(key => {
                bytes += Buffer.from(key, 'utf-8').toString('hex');;
            })
        }
        if (this.output) {
            bytes += Buffer.from(BywiseHelper.jsonToString(this.output), 'utf-8').toString('hex');
        }
        bytes += BywiseHelper.numberToHex(this.created);
        if (this.version == '1') {
            bytes = BywiseHelper.makeHashV1(bytes);
        } else {
            bytes = BywiseHelper.makeHash(bytes);
        }
        return bytes;
    }

    isValid(): void {
        if (this.version !== '1' && this.version !== '2') throw new Error('invalid version ' + this.version);
        if (this.version == '2') {
            if (this.chain.length === 0) throw new Error('invalid transaction chain cant be empty');
            if (!BywiseHelper.isValidAlfaNum(this.chain)) throw new Error('invalid chain');
        }
        if (this.validator) {
            this.validator.forEach(addr => {
                if (!BywiseHelper.isValidAddress(addr)) throw new Error('invalid transaction validator address ' + addr);
            })
        }
        if (!BywiseHelper.isStringArray(this.from)) throw new Error('invalid array');
        if (this.from.length === 0) throw new Error('invalid transaction sender cant be empty');
        if (this.from.length > 100) throw new Error('maximum number of senders is 100 signatures');
        this.from.forEach(from => {
            if (!BywiseHelper.isValidAddress(from)) throw new Error('invalid transaction sender address ' + from);
        })
        if (!BywiseHelper.isStringArray(this.to)) throw new Error('invalid array');
        if (this.to.length === 0) throw new Error('invalid transaction recipient cant be empty');
        if (this.to.length > 100) throw new Error('maximum number of recipient is 100');
        this.to.forEach((to, i) => {
            if (!BywiseHelper.isValidAddress(to)) throw new Error('invalid transaction recipient address ' + to);
        })
        if (!BywiseHelper.isStringArray(this.amount)) throw new Error('invalid array');
        if (this.amount.length === 0) throw new Error('invalid transaction amount cant be empty');
        if (this.amount.length !== this.to.length) throw new Error('to field must be the same length as amount');
        this.amount.forEach(amount => {
            if (!BywiseHelper.isValidAmount(amount)) throw new Error('invalid transaction amount ' + amount);
        })
        if (!BywiseHelper.isValidAmount(this.fee)) throw new Error('invalid transaction fee ' + this.fee);
        if (!Object.values(TxType).map(t => t.toString()).includes(this.type)) throw new Error('invalid type ' + this.type);
        if (this.foreignKeys) {
            if (!BywiseHelper.isStringArray(this.foreignKeys)) throw new Error('invalid array');
            if (this.foreignKeys.length > 100) throw new Error('maximum number of foreignKeys is 100');
            this.foreignKeys.forEach(key => {
                if (!BywiseHelper.isValidAlfaNum(key)) throw new Error('invalid foreignKey ' + key);
            })
        }
        if (BywiseHelper.jsonToString(this.data).length > 1048576) throw new Error('data too large');
        if (!BywiseHelper.isValidDate(this.created)) throw new Error('invalid created date');
        if (!BywiseHelper.isValidHash(this.hash)) throw new Error('invalid transaction hash ' + this.hash);
        if (this.hash !== this.toHash()) throw new Error('corrupt transaction');
        if (this.validator) {
            if (!this.validatorSign) throw new Error('validator sign cant be empty');
            if (this.validator.length !== this.validatorSign.length) throw new Error('invalid validator signature');
            for (let i = 0; i < this.sign.length; i++) {
                const sign = this.validatorSign[i];
                const addr = this.validator[i];
                if (!BywiseHelper.isValidSign(sign, addr, this.hash)) throw new Error('invalid validator signature');
            }
            if(!this.output) throw new Error('invalid validator output');
            if (BywiseHelper.jsonToString(this.output).length > 1048576) throw new Error('invalid validator output');
        } else {
            if (this.validatorSign) throw new Error('validator address cant be empty');
        }
        if (!BywiseHelper.isStringArray(this.sign)) throw new Error('invalid array');
        if (this.sign.length === 0) throw new Error('transaction was not signed');
        if (this.sign.length !== this.from.length) throw new Error('invalid signature');
        for (let i = 0; i < this.sign.length; i++) {
            const sign = this.sign[i];
            const fromAddress = this.from[i];

            if (!BywiseHelper.isValidSign(sign, fromAddress, this.hash)) throw new Error('invalid signature');
        }
    }
}

export type TransactionEventEntry = {
    key: string;
    value: string;
}

export type TransactionEvent = {
    contractAddress: string;
    eventName: string;
    entries: TransactionEventEntry[];
    hash: string;
}

export type EnvironmentChanges = {
    keys: string[];
    values: (string | null)[];
}

export type TransactionChanges = {
    get: string[];
    walletAddress: string[];
    walletAmount: string[];
    envOut: EnvironmentChanges
}

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
}

export type SimulateTx = {
    chain: string;
    from: string[] | string;
    to: string[] | string;
    amount: string[] | string;
    foreignKeys?: string[];
    type: string;
    data: any;
}

export type SimulateContract = {
    code?: string;
    method?: string;
    inputs?: string[];
    from: string;
    contractAddress?: string;
    amount: number;
    env: any;
}

export type OutputSimulateContract = {
    error?: string;
    stack?: string;
    output: any;
    env: any;
}

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
}

export type TxBlockchainInfo = {
    tx: PublishedTx;
    slice?: Slice;
    block?: Block;
}