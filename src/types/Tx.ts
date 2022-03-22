import { BywiseHelper } from "../utils/BywiseHelper";
import { BywiseTransaction } from "./BywiseTransaction";

export enum TxType {
    TX_NONE = 'none',
    TX_JSON = 'json',
    TX_COMMAND = 'command',
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

    constructor(tx?: Partial<Tx>) {
        this.version = tx?.version ?? '';
        this.validator = tx?.validator;
        this.from = tx?.from ?? [];
        this.to = tx?.to ?? [];
        this.amount = tx?.amount ?? [];
        this.tag = tx?.tag ?? '';
        this.fee = tx?.fee ?? '';
        this.type = tx?.type ?? TxType.TX_NONE;
        this.foreignKeys = tx?.foreignKeys;
        this.data = tx?.data ?? {};
        this.created = tx?.created ?? '';
        this.hash = tx?.hash ?? '';
        this.validatorSign = tx?.validatorSign;
        this.sign = tx?.sign ?? [];
    }

    toHash(): string {
        let bytes = '';
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        if (this.validator) {
            bytes += Buffer.from(this.validator, 'utf-8').toString('hex');
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
        bytes += Buffer.from(this.tag, 'utf-8').toString('hex');
        bytes += Buffer.from(this.fee, 'utf-8').toString('hex');
        bytes += Buffer.from(this.type, 'utf-8').toString('hex');
        bytes += Buffer.from(BywiseHelper.jsonToString(this.data), 'utf-8').toString('hex');
        if (this.foreignKeys) {
            this.foreignKeys.forEach(key => {
                bytes += Buffer.from(key, 'utf-8').toString('hex');;
            })
        }
        bytes += Buffer.from(this.created, 'utf-8').toString('hex');
        bytes = BywiseHelper.makeHash(bytes);
        return bytes;
    }

    isValid(): void {
        if (this.version !== '1') throw new Error('invalid version ' + this.version);
        if (this.validator && !BywiseHelper.isValidAddress(this.validator)) throw new Error('invalid transaction validator address ' + this.validator);
        if (this.from.length === 0) throw new Error('invalid transaction sender cant be empty');
        if (this.from.length > 100) throw new Error('maximum number of senders is 100 signatures');
        this.from.forEach(from => {
            if (!BywiseHelper.isValidAddress(from)) throw new Error('invalid transaction sender address ' + from);
        })
        let tag = '';
        if (this.to.length === 0) throw new Error('invalid transaction recipient cant be empty');
        if (this.to.length > 100) throw new Error('maximum number of recipient is 100');
        this.to.forEach((to, i) => {
            if (!BywiseHelper.isValidAddress(to)) throw new Error('invalid transaction recipient address ' + to);
            if (i === 0) {
                tag = BywiseHelper.getAddressTag(to);
            }
        })
        if (this.tag !== tag) throw new Error('invalid tag ' + this.tag);
        if (this.amount.length === 0) throw new Error('invalid transaction amount cant be empty');
        if (this.amount.length !== this.to.length) throw new Error('to field must be the same length as amount');
        this.amount.forEach(amount => {
            if (!BywiseHelper.isValidAmount(amount)) throw new Error('invalid transaction amount ' + amount);
        })
        if (!BywiseHelper.isValidAmount(this.fee)) throw new Error('invalid transaction fee ' + this.fee);
        if (!Object.values(TxType).includes(this.type)) throw new Error('invalid type ' + this.type);
        if (this.foreignKeys) {
            if (this.to.length > 100) throw new Error('maximum number of foreignKeys is 100');
            this.foreignKeys.forEach(key => {
                if (!BywiseHelper.isValidAlfaNum(key)) throw new Error('invalid foreignKey ' + key);
            })
        }
        if (BywiseHelper.jsonToString(this.data).length > 1048576) throw new Error('data too large ' + BywiseHelper.jsonToString(this.data).length);
        if (!BywiseHelper.isValidDate(this.created)) throw new Error('invalid created date ' + this.created);
        if (!BywiseHelper.isValidHash(this.hash)) throw new Error('invalid transaction hash ' + this.hash);
        if (this.hash !== this.toHash()) throw new Error('calculated hash is different from the informed hash');
        if (this.validator) {
            if (!this.validatorSign) throw new Error('validator sign cant be empty');
            if (!BywiseHelper.isValidSign(this.validatorSign, this.validator, this.hash)) throw new Error('invalid validator signature');
        } else {
            if (this.validatorSign) throw new Error('validator address cant be empty');
        }
        if (this.sign.length === 0) throw new Error('invalid transaction sign cant be empty');
        if (this.sign.length !== this.from.length) throw new Error('from field must be the same length as sign');
        for (let i = 0; i < this.sign.length; i++) {
            const sign = this.sign[i];
            const fromAddress = this.from[i];
            if (!BywiseHelper.isValidSign(sign, fromAddress, this.hash)) throw new Error('invalid signature from address ' + fromAddress);
        }
    }
}

export type SimulateTx = {
    from: string[] | string;
    to: string[] | string;
    amount: string[] | string;
    tag: string;
    foreignKeys?: string[];
    type: TxType;
    data: any;
}