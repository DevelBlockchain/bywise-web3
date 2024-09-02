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
    validator: string[];
    from: string[];
    to: string[];
    amount: string[];
    fee: string;
    type: string;
    foreignKeys?: string[];
    data: any;
    created: number;
    hash: string;
    validatorSign: string[];
    output: TxOutput;
    sign: string[];

    constructor(tx?: Partial<Tx>) {
        this.version = tx?.version ?? '';
        this.chain = tx?.chain ?? 'mainnet';
        this.validator = tx?.validator ?? [];
        this.from = tx?.from ?? [];
        this.to = tx?.to ?? [];
        this.amount = tx?.amount ?? [];
        this.fee = tx?.fee ?? '';
        this.type = tx?.type ?? TxType.TX_NONE;
        this.foreignKeys = tx?.foreignKeys ?? [];
        this.data = tx?.data ?? {};
        this.output = {
            feeUsed: '0',
            cost: 0,
            size: 0,
            ctx: '0000000000000000000000000000000000000000000000000000000000000000',
            debit: '0',
            logs: [],
            events: [],
            get: [],
            walletAddress: [],
            walletAmount: [],
            envs: {
                keys: [],
                values: []
            },
            output: ''
        };
        if (tx?.output) {
            this.output.feeUsed = tx.output.feeUsed;
            this.output.cost = tx.output.cost;
            this.output.size = tx.output.size;
            this.output.ctx = tx.output.ctx;
            this.output.debit = tx.output.debit;
            this.output.logs = tx.output.logs;
            for (let i = 0; i < tx.output.events.length; i++) {
                const event = tx.output.events[i];
                const eventDTO: TransactionEvent = {
                    contractAddress: event.contractAddress,
                    eventName: event.eventName,
                    entries: [],
                    hash: event.hash,
                }
                for (let j = 0; j < event.entries.length; j++) {
                    const entry = event.entries[j];
                    eventDTO.entries.push({
                        key: entry.key,
                        value: entry.value,
                    });
                }
                this.output.events.push(eventDTO);
            }
            this.output.get = tx.output.get;
            this.output.walletAddress = tx.output.walletAddress;
            this.output.walletAmount = tx.output.walletAmount;
            this.output.envs.keys = tx.output.envs.keys;
            this.output.envs.values = tx.output.envs.values;
            this.output.output = tx.output.output;
        }
        this.created = tx?.created ?? 0;
        this.hash = tx?.hash ?? '';
        this.validatorSign = tx?.validatorSign ?? [];
        this.sign = tx?.sign ?? [];
    }

    toHash(): string {
        let bytes = '';
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        bytes += Buffer.from(this.chain, 'utf-8').toString('hex');
        this.validator.forEach(addr => {
            bytes += Buffer.from(addr, 'utf-8').toString('hex');;
        })
        this.from.forEach(from => {
            bytes += Buffer.from(from, 'utf-8').toString('hex');
        })
        this.to.forEach(to => {
            bytes += Buffer.from(to, 'utf-8').toString('hex');
        })
        this.amount.forEach(amount => {
            bytes += Buffer.from(amount, 'utf-8').toString('hex');
        })
        if (this.fee) {
            bytes += Buffer.from(this.fee, 'utf-8').toString('hex');
        }
        bytes += Buffer.from(this.type, 'utf-8').toString('hex');
        bytes += Buffer.from(BywiseHelper.jsonToString(this.data), 'utf-8').toString('hex');
        if (this.foreignKeys) {
            this.foreignKeys.forEach(key => {
                bytes += Buffer.from(key, 'utf-8').toString('hex');;
            })
        }
        bytes += Buffer.from(BywiseHelper.jsonToString(this.output), 'utf-8').toString('hex');
        bytes += BywiseHelper.numberToHex(this.created);
        bytes = BywiseHelper.makeHash(bytes);
        return bytes;
    }

    isValid(): void {
        if (this.version !== '3') throw new Error('invalid version ' + this.version);
        if (this.chain.length === 0) throw new Error('invalid transaction chain cant be empty');
        if (!BywiseHelper.isValidAlfaNum(this.chain)) throw new Error('invalid chain');
        if (this.validator) {
            this.validator.forEach(addr => {
                if (!BywiseHelper.isValidAddress(addr)) throw new Error('invalid transaction validator address ' + addr);
            });
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
        if (!BywiseHelper.isStringArray(this.foreignKeys)) throw new Error('invalid array');
        if (this.foreignKeys) {
            if (this.foreignKeys.length > 100) throw new Error('maximum number of foreignKeys is 100');
            this.foreignKeys.forEach(key => {
                if (!BywiseHelper.isValidAlfaNum(key)) throw new Error('invalid foreignKey ' + key);
            })
        }
        if (BywiseHelper.jsonToString(this.data).length > 1048576) throw new Error('data too large');
        if (!BywiseHelper.isValidDate(this.created)) throw new Error('invalid created date');

        if (!this.output) throw new Error('invalid validator output');
        if (this.output.error !== undefined) throw new Error('transaction output has error');
        if (this.output.stack !== undefined) throw new Error('transaction output has stack');
        if (!BywiseHelper.isValidInteger(this.output.cost)) throw new Error('invalid cost');
        if (!BywiseHelper.isValidHash(this.output.ctx)) throw new Error('invalid ctx');
        if (!BywiseHelper.isValidAmount(this.output.debit)) throw new Error('invalid debit');
        this.output.envs.keys.forEach(key => {
            if (!BywiseHelper.isValidAlfaNumSlash(key)) throw new Error('invalid envs keys ' + key);
        })
        this.output.envs.values.forEach(value => {
            if (typeof value !== 'string' && value !== null) throw new Error('invalid envs values ' + value);
        })
        if (this.output.envs.keys.length !== this.output.envs.values.length) throw new Error('invalid output envs.keys length');
        this.output.events.forEach(event => {
            if (!BywiseHelper.isValidAddress(event.contractAddress)) throw new Error('invalid event.contractAddress');
            if (!BywiseHelper.isValidAlfaNum(event.eventName)) throw new Error('invalid event.eventName');
            if (!BywiseHelper.isValidHash(event.hash)) throw new Error('invalid event.hash');
            event.entries.forEach(entry => {
                if (!BywiseHelper.isValidAlfaNum(entry.key)) throw new Error('invalid event.entries.key');
                if (typeof entry.value !== 'string') throw new Error('invalid event.entries.value');
                if (`${entry.value}`.length > 10000) throw new Error('invalid event.entries.value');
            })
        })
        if (!BywiseHelper.isValidAmount(this.output.feeUsed)) throw new Error('invalid feeUsed');
        this.output.get.forEach(key => {
            if (!BywiseHelper.isValidAlfaNumSlash(key)) throw new Error('invalid get ' + key);
        })
        this.output.logs.forEach(log => {
            if (typeof log !== 'string') throw new Error('logs');
        })
        if (BywiseHelper.jsonToString(this.output).length > 1048576) throw new Error('output too large');
        if (!BywiseHelper.isValidInteger(this.output.size)) throw new Error('invalid size');
        this.output.walletAddress.forEach(address => {
            if (!BywiseHelper.isValidAddress(address)) throw new Error('invalid walletAddress ' + address);
        })
        this.output.walletAmount.forEach(amount => {
            if (!BywiseHelper.isValidSignedAmount(amount)) throw new Error('invalid walletAmount ' + amount);
        })
        if (this.output.walletAddress.length !== this.output.walletAmount.length) throw new Error('invalid output walletAddress length');
        if (BywiseHelper.jsonToString(this.output).length > 1048576) throw new Error('invalid validator output');

        if (!BywiseHelper.isStringArray(this.validator)) throw new Error('invalid array validator');
        if (!BywiseHelper.isStringArray(this.validatorSign)) throw new Error('invalid array validatorSign');
        if (!BywiseHelper.isStringArray(this.sign)) throw new Error('invalid array');
        if (!BywiseHelper.isValidHash(this.hash)) throw new Error('invalid transaction hash ' + this.hash);
        if (this.hash !== this.toHash()) throw new Error('corrupt transaction');

        if (this.validator.length !== this.validatorSign.length) throw new Error('invalid validator signature');
        for (let i = 0; i < this.validatorSign.length; i++) {
            const sign = this.validatorSign[i];
            const addr = this.validator[i];
            if (!BywiseHelper.isValidSign(sign, addr, this.hash)) throw new Error('invalid validator signature');
        }
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
    envs: EnvironmentChanges
}

export type TxOutput = {
    error?: string;
    stack?: string;
    output: any;
    cost: number;
    size: number;
    feeUsed: string;
    ctx: string;
    logs: string[];
    debit: string;
    events: TransactionEvent[];
    get: string[];
    walletAddress: string[];
    walletAmount: string[];
    envs: EnvironmentChanges;
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