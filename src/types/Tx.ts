import Helper from '../utils/Helper';
import Wallet from '../utils/Wallet';
import Web3 from '../web3/Web3';
import BywiseTransaction from './BywiseTransaction';

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
    version: string = '';
    validator: string = '';
    from: string[] | string = [];
    to: string[] | string = [];
    amount: string[] | string = [];
    tag: string = '';
    fee: string = '';
    type: TxType = TxType.TX_NONE;
    foreignKeys?: string[];
    data: any;
    created: string = '';
    hash: string = '';
    validatorSign: string = '';
    sign: string[] | string = [];

    toHash(): string {
        let bytes = '';
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        if (this.validator) {
            bytes += Buffer.from(this.validator, 'utf-8').toString('hex');
        }
        if (typeof this.from === 'string') {
            bytes += Buffer.from(this.from, 'utf-8').toString('hex');
        } else {
            this.from.forEach(from => {
                bytes += Buffer.from(from, 'utf-8').toString('hex');
            })
        }
        if (typeof this.to === 'string') {
            bytes += Buffer.from(this.to, 'utf-8').toString('hex');
        } else {
            this.to.forEach(to => {
                bytes += Buffer.from(to, 'utf-8').toString('hex');
            })
        }
        if (typeof this.amount === 'string') {
            bytes += Buffer.from(this.amount, 'utf-8').toString('hex');
        } else {
            this.amount.forEach(amount => {
                bytes += Buffer.from(amount, 'utf-8').toString('hex');
            })
        }
        bytes += Buffer.from(this.tag, 'utf-8').toString('hex');
        bytes += Buffer.from(this.fee, 'utf-8').toString('hex');
        bytes += Buffer.from(this.type, 'utf-8').toString('hex');
        bytes += Buffer.from(Helper.jsonToString(this.data), 'utf-8').toString('hex');
        if (this.foreignKeys) {
            this.foreignKeys.forEach(key => {
                bytes += key;
            })
        }
        bytes += Buffer.from(this.created, 'utf-8').toString('hex');
        bytes = Helper.makeHash(bytes);
        return bytes;
    }

    isValid(): void {
        if (this.version !== '1') throw new Error('invalid version ' + this.version);
        if (this.validator && !Helper.isValidAddress(this.validator)) throw new Error('invalid transaction validator address ' + this.validator);
        if (typeof this.from === 'string') {
            if (!Helper.isValidAddress(this.from)) throw new Error('invalid transaction sender address ' + this.from);
        } else {
            if (this.from.length === 0) throw new Error('invalid transaction sender cant be empty');
            if (this.from.length > 100) throw new Error('maximum number of senders is 100 signatures');
            this.from.forEach(from => {
                if (!Helper.isValidAddress(from)) throw new Error('invalid transaction sender address ' + from);
            })
        }
        let tag = '';
        if (typeof this.to === 'string') {
            if (!Helper.isValidAddress(this.to)) throw new Error('invalid transaction recipient address ' + this.to);
            tag = Helper.getAddressTag(this.to);
        } else {
            if (this.to.length === 0) throw new Error('invalid transaction recipient cant be empty');
            if (this.to.length > 100) throw new Error('maximum number of recipient is 100');
            this.to.forEach((to, i) => {
                if (!Helper.isValidAddress(to)) throw new Error('invalid transaction recipient address ' + to);
                if(i === 0) {
                    tag = Helper.getAddressTag(to);
                }
            })
        }
        if (typeof this.amount === 'string') {
            if (!Helper.isValidAmount(this.amount)) throw new Error('invalid transaction amount ' + this.amount);
        } else {
            if (this.amount.length === 0) throw new Error('invalid transaction amount cant be empty');
            if (typeof this.to === 'string') throw new Error('to field must also be an array like amount');
            if (this.amount.length !== this.to.length) throw new Error('to field must be the same length as amount');
            this.amount.forEach(amount => {
                if (!Helper.isValidAmount(amount)) throw new Error('invalid transaction amount ' + amount);
            })
        }
        if (this.tag !== tag) throw new Error('invalid tag ' + this.tag);
        if (!Helper.isValidAmount(this.fee)) throw new Error('invalid transaction fee ' + this.fee);
        if (!Object.values(TxType).includes(this.type)) throw new Error('invalid type ' + this.type);
        if (this.foreignKeys) {
            if (this.to.length > 100) throw new Error('maximum number of foreignKeys is 100');
            this.foreignKeys.forEach(key => {
                if (!Helper.isValidAlfaNum(key)) throw new Error('invalid foreignKey ' + key);
            })
        }
        if (Helper.jsonToString(this.data).length > 1048576) throw new Error('data too large ' + Helper.jsonToString(this.data).length);
        if (!Helper.isValidDate(this.created)) throw new Error('invalid created date ' + this.created);
        if (!Helper.isValidHash(this.hash)) throw new Error('invalid transaction hash ' + this.hash);
        if (this.hash !== this.toHash()) throw new Error('calculated hash is different from the informed hash');
        if (this.validator) {
            if (!this.validatorSign) throw new Error('validator sign cant be empty');
            if (!Helper.isValidSign(this.validatorSign, this.validator, this.hash)) throw new Error('invalid validator signature');
        } else {
            if (this.validatorSign) throw new Error('validator address cant be empty');
        }

        if (typeof this.sign === 'string') {
            if (typeof this.from !== 'string') throw new Error('from field must also be an array like sign');
            if (!Helper.isValidSign(this.sign, this.from, this.hash)) throw new Error('invalid signature');
        } else {
            if (this.sign.length === 0) throw new Error('invalid transaction sign cant be empty');
            if (this.sign.length !== this.from.length) throw new Error('from field must be the same length as sign');
            for (let i = 0; i < this.sign.length; i++) {
                const sign = this.sign[i];
                const fromAddress = this.from[i];
                if (!Helper.isValidSign(sign, fromAddress, this.hash)) throw new Error('invalid signature from address ' + fromAddress);
            }
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