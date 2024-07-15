"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tx = exports.TxType = void 0;
const BywiseHelper_1 = require("../utils/BywiseHelper");
var TxType;
(function (TxType) {
    TxType["TX_NONE"] = "none";
    TxType["TX_JSON"] = "json";
    TxType["TX_BLOCKCHAIN_COMMAND"] = "blockchain-command";
    TxType["TX_COMMAND"] = "command";
    TxType["TX_COMMAND_INFO"] = "command-info";
    TxType["TX_CONTRACT"] = "contract";
    TxType["TX_CONTRACT_EXE"] = "contract-exe";
    TxType["TX_FILE"] = "file";
    TxType["TX_STRING"] = "string";
    TxType["TX_EN_JSON"] = "json-encrypt";
    TxType["TX_EN_COMMAND"] = "command-encrypt";
    TxType["TX_EN_CONTRACT"] = "contract-encrypt";
    TxType["TX_EN_CONTRACT_EXE"] = "contract-exe-encrypt";
    TxType["TX_EN_FILE"] = "file-encrypt";
    TxType["TX_EN_STRING"] = "string-encrypt";
})(TxType || (exports.TxType = TxType = {}));
class Tx {
    constructor(tx) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        this.version = (_a = tx === null || tx === void 0 ? void 0 : tx.version) !== null && _a !== void 0 ? _a : '';
        this.chain = (_b = tx === null || tx === void 0 ? void 0 : tx.chain) !== null && _b !== void 0 ? _b : 'mainnet';
        this.validator = tx === null || tx === void 0 ? void 0 : tx.validator;
        this.from = (_c = tx === null || tx === void 0 ? void 0 : tx.from) !== null && _c !== void 0 ? _c : [];
        this.to = (_d = tx === null || tx === void 0 ? void 0 : tx.to) !== null && _d !== void 0 ? _d : [];
        this.amount = (_e = tx === null || tx === void 0 ? void 0 : tx.amount) !== null && _e !== void 0 ? _e : [];
        this.fee = (_f = tx === null || tx === void 0 ? void 0 : tx.fee) !== null && _f !== void 0 ? _f : '';
        this.type = (_g = tx === null || tx === void 0 ? void 0 : tx.type) !== null && _g !== void 0 ? _g : TxType.TX_NONE;
        this.foreignKeys = tx === null || tx === void 0 ? void 0 : tx.foreignKeys;
        this.data = (_h = tx === null || tx === void 0 ? void 0 : tx.data) !== null && _h !== void 0 ? _h : {};
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
        if (tx === null || tx === void 0 ? void 0 : tx.output) {
            this.output.feeUsed = tx.output.feeUsed;
            this.output.cost = tx.output.cost;
            this.output.size = tx.output.size;
            this.output.ctx = tx.output.ctx;
            this.output.debit = tx.output.debit;
            this.output.logs = tx.output.logs;
            for (let i = 0; i < tx.output.events.length; i++) {
                const event = tx.output.events[i];
                const eventDTO = {
                    contractAddress: event.contractAddress,
                    eventName: event.contractAddress,
                    entries: [],
                    hash: event.hash,
                };
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
        this.created = (_j = tx === null || tx === void 0 ? void 0 : tx.created) !== null && _j !== void 0 ? _j : 0;
        this.hash = (_k = tx === null || tx === void 0 ? void 0 : tx.hash) !== null && _k !== void 0 ? _k : '';
        this.validatorSign = tx === null || tx === void 0 ? void 0 : tx.validatorSign;
        this.sign = (_l = tx === null || tx === void 0 ? void 0 : tx.sign) !== null && _l !== void 0 ? _l : [];
    }
    toHash() {
        let bytes = '';
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        bytes += Buffer.from(this.chain, 'utf-8').toString('hex');
        if (this.validator) {
            if (this.validator) {
                this.validator.forEach(addr => {
                    bytes += Buffer.from(addr, 'utf-8').toString('hex');
                    ;
                });
            }
        }
        this.from.forEach(from => {
            bytes += Buffer.from(from, 'utf-8').toString('hex');
        });
        this.to.forEach(to => {
            bytes += Buffer.from(to, 'utf-8').toString('hex');
        });
        this.amount.forEach(amount => {
            bytes += Buffer.from(amount, 'utf-8').toString('hex');
        });
        bytes += Buffer.from(this.fee, 'utf-8').toString('hex');
        bytes += Buffer.from(this.type, 'utf-8').toString('hex');
        bytes += Buffer.from(BywiseHelper_1.BywiseHelper.jsonToString(this.data), 'utf-8').toString('hex');
        if (this.foreignKeys) {
            this.foreignKeys.forEach(key => {
                bytes += Buffer.from(key, 'utf-8').toString('hex');
                ;
            });
        }
        bytes += Buffer.from(BywiseHelper_1.BywiseHelper.jsonToString(this.output), 'utf-8').toString('hex');
        bytes += BywiseHelper_1.BywiseHelper.numberToHex(this.created);
        bytes = BywiseHelper_1.BywiseHelper.makeHash(bytes);
        return bytes;
    }
    isValid() {
        if (this.version !== '3')
            throw new Error('invalid version ' + this.version);
        if (this.chain.length === 0)
            throw new Error('invalid transaction chain cant be empty');
        if (!BywiseHelper_1.BywiseHelper.isValidAlfaNum(this.chain))
            throw new Error('invalid chain');
        if (this.validator) {
            this.validator.forEach(addr => {
                if (!BywiseHelper_1.BywiseHelper.isValidAddress(addr))
                    throw new Error('invalid transaction validator address ' + addr);
            });
        }
        if (!BywiseHelper_1.BywiseHelper.isStringArray(this.from))
            throw new Error('invalid array');
        if (this.from.length === 0)
            throw new Error('invalid transaction sender cant be empty');
        if (this.from.length > 100)
            throw new Error('maximum number of senders is 100 signatures');
        this.from.forEach(from => {
            if (!BywiseHelper_1.BywiseHelper.isValidAddress(from))
                throw new Error('invalid transaction sender address ' + from);
        });
        if (!BywiseHelper_1.BywiseHelper.isStringArray(this.to))
            throw new Error('invalid array');
        if (this.to.length === 0)
            throw new Error('invalid transaction recipient cant be empty');
        if (this.to.length > 100)
            throw new Error('maximum number of recipient is 100');
        this.to.forEach((to, i) => {
            if (!BywiseHelper_1.BywiseHelper.isValidAddress(to))
                throw new Error('invalid transaction recipient address ' + to);
        });
        if (!BywiseHelper_1.BywiseHelper.isStringArray(this.amount))
            throw new Error('invalid array');
        if (this.amount.length === 0)
            throw new Error('invalid transaction amount cant be empty');
        if (this.amount.length !== this.to.length)
            throw new Error('to field must be the same length as amount');
        this.amount.forEach(amount => {
            if (!BywiseHelper_1.BywiseHelper.isValidAmount(amount))
                throw new Error('invalid transaction amount ' + amount);
        });
        if (!BywiseHelper_1.BywiseHelper.isValidAmount(this.fee))
            throw new Error('invalid transaction fee ' + this.fee);
        if (!Object.values(TxType).map(t => t.toString()).includes(this.type))
            throw new Error('invalid type ' + this.type);
        if (this.foreignKeys) {
            if (!BywiseHelper_1.BywiseHelper.isStringArray(this.foreignKeys))
                throw new Error('invalid array');
            if (this.foreignKeys.length > 100)
                throw new Error('maximum number of foreignKeys is 100');
            this.foreignKeys.forEach(key => {
                if (!BywiseHelper_1.BywiseHelper.isValidAlfaNum(key))
                    throw new Error('invalid foreignKey ' + key);
            });
        }
        if (BywiseHelper_1.BywiseHelper.jsonToString(this.data).length > 1048576)
            throw new Error('data too large');
        if (!BywiseHelper_1.BywiseHelper.isValidDate(this.created))
            throw new Error('invalid created date');
        if (!BywiseHelper_1.BywiseHelper.isValidHash(this.hash))
            throw new Error('invalid transaction hash ' + this.hash);
        if (this.hash !== this.toHash())
            throw new Error('corrupt transaction');
        if (!this.output)
            throw new Error('invalid validator output');
        if (this.output.error !== undefined)
            throw new Error('transaction output has error');
        if (this.output.stack !== undefined)
            throw new Error('transaction output has stack');
        if (!BywiseHelper_1.BywiseHelper.isValidInteger(this.output.cost))
            throw new Error('invalid created cost');
        if (!BywiseHelper_1.BywiseHelper.isValidHash(this.output.ctx))
            throw new Error('invalid created ctx');
        if (!BywiseHelper_1.BywiseHelper.isValidAmount(this.output.debit))
            throw new Error('invalid created debit');
        this.output.envs.keys.forEach(key => {
            if (!BywiseHelper_1.BywiseHelper.isValidAlfaNumSlash(key))
                throw new Error('invalid envs keys ' + key);
        });
        this.output.envs.values.forEach(value => {
            if (typeof value !== 'string' && value !== null)
                throw new Error('invalid envs values ' + value);
        });
        if (this.output.envs.keys.length !== this.output.envs.values.length)
            throw new Error('invalid output envs.keys length');
        this.output.events.forEach(event => {
            if (!BywiseHelper_1.BywiseHelper.isValidAddress(event.contractAddress))
                throw new Error('invalid event.contractAddress');
            if (!BywiseHelper_1.BywiseHelper.isValidAlfaNum(event.eventName))
                throw new Error('invalid event.eventName');
            if (!BywiseHelper_1.BywiseHelper.isValidHash(event.hash))
                throw new Error('invalid event.hash');
            event.entries.forEach(entry => {
                if (!BywiseHelper_1.BywiseHelper.isValidAlfaNum(entry.key))
                    throw new Error('invalid event.entries.key');
                if (typeof entry.value === 'string')
                    throw new Error('invalid event.entries.value');
                if (`${entry.value}`.length <= 10000)
                    throw new Error('invalid event.entries.value');
            });
        });
        if (!BywiseHelper_1.BywiseHelper.isValidAmount(this.output.feeUsed))
            throw new Error('invalid created feeUsed');
        this.output.get.forEach(key => {
            if (!BywiseHelper_1.BywiseHelper.isValidAlfaNumSlash(key))
                throw new Error('invalid get ' + key);
        });
        this.output.logs.forEach(log => {
            if (typeof log === 'string')
                throw new Error('logs');
        });
        if (BywiseHelper_1.BywiseHelper.jsonToString(this.output).length > 1048576)
            throw new Error('output too large');
        if (!BywiseHelper_1.BywiseHelper.isValidInteger(this.output.size))
            throw new Error('invalid created size');
        this.output.walletAddress.forEach(address => {
            if (!BywiseHelper_1.BywiseHelper.isValidAddress(address))
                throw new Error('invalid walletAddress ' + address);
        });
        this.output.walletAmount.forEach(amount => {
            if (!BywiseHelper_1.BywiseHelper.isValidSignedAmount(amount))
                throw new Error('invalid walletAmount ' + amount);
        });
        if (this.output.walletAddress.length !== this.output.walletAmount.length)
            throw new Error('invalid output walletAddress length');
        if (BywiseHelper_1.BywiseHelper.jsonToString(this.output).length > 1048576)
            throw new Error('invalid validator output');
        if (this.validator) {
            if (!this.validatorSign)
                throw new Error('validator sign cant be empty');
            if (this.validator.length !== this.validatorSign.length)
                throw new Error('invalid validator signature');
            for (let i = 0; i < this.sign.length; i++) {
                const sign = this.validatorSign[i];
                const addr = this.validator[i];
                if (!BywiseHelper_1.BywiseHelper.isValidSign(sign, addr, this.hash))
                    throw new Error('invalid validator signature');
            }
        }
        else {
            if (this.validatorSign)
                throw new Error('validator address cant be empty');
        }
        if (!BywiseHelper_1.BywiseHelper.isStringArray(this.sign))
            throw new Error('invalid array');
        if (this.sign.length === 0)
            throw new Error('transaction was not signed');
        if (this.sign.length !== this.from.length)
            throw new Error('invalid signature');
        for (let i = 0; i < this.sign.length; i++) {
            const sign = this.sign[i];
            const fromAddress = this.from[i];
            if (!BywiseHelper_1.BywiseHelper.isValidSign(sign, fromAddress, this.hash))
                throw new Error('invalid signature');
        }
    }
}
exports.Tx = Tx;
