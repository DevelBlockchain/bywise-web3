"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
const ethers_1 = require("ethers");
const Wallet_1 = require("./Wallet");
const ethereum_address = require('ethereum-address');
class Helper {
    static makeHash(hexBytes) {
        return (0, ts_lib_crypto_1.base16Encode)((0, ts_lib_crypto_1.sha256)((0, ts_lib_crypto_1.base16Decode)(hexBytes))).toLowerCase();
    }
}
exports.default = Helper;
Helper.ZERO_ADDRESS = 'BWS000000000000000000000000000000000000000000000';
Helper.encodeBWSAddress = (isMainnet, isContract, ethAddress, tag) => {
    let finalAddress = 'BWS1';
    finalAddress += isMainnet ? 'M' : 'T';
    finalAddress += isContract ? 'C' : 'U';
    finalAddress += ethAddress.substring(2);
    if (tag) {
        if (!Helper.isValidAlfaNum(tag))
            throw new Error('invalid tag ' + tag);
        finalAddress += tag;
    }
    let checkSum = Helper.makeHash(finalAddress).substring(0, 3);
    finalAddress += checkSum;
    Helper.decodeBWSAddress(finalAddress);
    return finalAddress;
};
Helper.decodeBWSAddress = (address) => {
    if (!Helper.isValidAddress(address))
        throw new Error('invalid address');
    if (address === Helper.ZERO_ADDRESS) {
        return new Wallet_1.InfoAddress({
            version: '1',
            isMainnet: false,
            isContract: false,
            ethAddress: '0x0000000000000000000000000000000000000000',
            tag: '',
        });
    }
    let isMainnet = address.substring(4, 5) === 'M';
    let isContract = address.substring(5, 6) === 'C';
    let ethAddress = '0x' + address.substring(6, 46);
    let tag = address.substring(46, address.length - 3);
    let checkSum = address.substring(address.length - 3);
    let checkSumCalculed = Helper.makeHash(address.substring(0, address.length - 3)).substring(0, 3);
    if (checkSum !== checkSumCalculed)
        throw new Error('corrupted address');
    if (!ethereum_address.isAddress(ethAddress))
        throw new Error('invalid address parameters');
    return new Wallet_1.InfoAddress({
        version: '1',
        isMainnet,
        isContract,
        ethAddress,
        tag,
    });
};
Helper.getAddressTag = (address) => {
    return Helper.decodeBWSAddress(address).tag;
};
Helper.isZeroAddress = (address) => {
    return address === Helper.ZERO_ADDRESS;
};
Helper.isValidAddress = (address) => {
    return address === Helper.ZERO_ADDRESS || /^BWS1[MT][CU][0-9a-fA-F]{40}[0-9a-zA-Z]{0,64}[0-9a-fA-F]{3}$/.test(address);
};
Helper.isValidAmount = (amount) => {
    return /^((0|[1-9][0-9]{0,17})(\.0|\.[0-9]{0,17}[1-9])?)$/.test(amount);
};
Helper.isValidAlfaNum = (value) => {
    return /^[a-zA-Z0-9_]{0,64}$/.test(value);
};
Helper.isValidHash = (value) => {
    return /^[a-zA-Z0-9]{64}$/.test(value);
};
Helper.isValidDate = (date) => {
    return /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}\.[0-9]{3}Z$/.test(date);
};
Helper.isValidSign = (sign, signAddress, hash) => {
    if (!/^0x[a-f0-9]{130}$/.test(sign)) {
        return false;
    }
    let recoveredAddress = ethers_1.ethers.utils.verifyMessage(hash, sign);
    let decodedSignAddress = Helper.decodeBWSAddress(signAddress);
    if (recoveredAddress !== decodedSignAddress.ethAddress) {
        return false;
    }
    return true;
};
Helper.jsonToString = (mainJson) => {
    const toJSON = (json) => {
        let newJSON;
        if (Array.isArray(json)) {
            newJSON = json.map(value => toJSON(value));
        }
        else if (json === null || json === undefined) {
            newJSON = json;
        }
        else if (typeof json === 'object') {
            let obj = {};
            Object.entries(json).sort((a, b) => a[0].localeCompare(b[0], 'en')).forEach(([key, value]) => {
                obj[key] = toJSON(value);
            });
            newJSON = obj;
        }
        else {
            newJSON = json;
        }
        return newJSON;
    };
    return JSON.stringify(toJSON(mainJson));
};
Helper.numberToHex = (number) => {
    let hex = number.toString(16);
    if ((hex.length % 2) > 0) {
        hex = "0" + hex;
    }
    while (hex.length < 16) {
        hex = "00" + hex;
    }
    if (hex.length > 16 || number < 0) {
        throw new Error(`invalid pointer "${number}"`);
    }
    return hex;
};
Helper.sleep = function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            setTimeout(resolve, ms + 10);
        });
    });
};
