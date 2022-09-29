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
exports.BywiseHelper = void 0;
const ts_lib_crypto_1 = require("@waves/ts-lib-crypto");
const ethers_1 = require("ethers");
const InfoAddress_1 = require("../types/InfoAddress");
const ethereum_address = require('ethereum-address');
class BywiseHelper {
    static makeHashV1(hexBytes) {
        return (0, ts_lib_crypto_1.base16Encode)((0, ts_lib_crypto_1.sha256)((0, ts_lib_crypto_1.base16Decode)(hexBytes))).toLowerCase();
    }
    static makeHash(hexBytes) {
        return (0, ts_lib_crypto_1.base16Encode)((0, ts_lib_crypto_1.sha256)((0, ts_lib_crypto_1.sha256)((0, ts_lib_crypto_1.base16Decode)(hexBytes)))).toLowerCase();
    }
}
exports.BywiseHelper = BywiseHelper;
BywiseHelper.ZERO_ADDRESS = 'BWS000000000000000000000000000000000000000000000';
BywiseHelper.encodeBWSAddress = (isContract, ethAddress, tag) => {
    let finalAddress = 'BWS1';
    finalAddress += 'M';
    finalAddress += isContract ? 'C' : 'U';
    finalAddress += ethAddress.substring(2);
    if (tag) {
        if (!BywiseHelper.isValidAlfaNum(tag))
            throw new Error('invalid tag ' + tag);
        finalAddress += tag;
    }
    let checkSum = BywiseHelper.makeHash(finalAddress).substring(0, 3);
    finalAddress += checkSum;
    BywiseHelper.decodeBWSAddress(finalAddress);
    return finalAddress;
};
BywiseHelper.decodeBWSAddress = (address) => {
    if (!BywiseHelper.isValidAddress(address))
        throw new Error('invalid address');
    if (address === BywiseHelper.ZERO_ADDRESS) {
        return new InfoAddress_1.InfoAddress({
            version: '1',
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
    let checkSumCalculed = BywiseHelper.makeHash(address.substring(0, address.length - 3)).substring(0, 3);
    if (checkSum !== checkSumCalculed)
        throw new Error('corrupted address');
    if (!ethereum_address.isAddress(ethAddress))
        throw new Error('invalid address parameters');
    return new InfoAddress_1.InfoAddress({
        version: '1',
        isContract,
        ethAddress,
        tag,
    });
};
BywiseHelper.getAddressTag = (address) => {
    return BywiseHelper.decodeBWSAddress(address).tag;
};
BywiseHelper.isZeroAddress = (address) => {
    return address === BywiseHelper.ZERO_ADDRESS;
};
BywiseHelper.isValidAddress = (address) => {
    return address === BywiseHelper.ZERO_ADDRESS || /^BWS1[MT][CU][0-9a-fA-F]{40}[0-9a-zA-Z]{0,64}[0-9a-fA-F]{3}$/.test(address);
};
BywiseHelper.isValidAmount = (amount) => {
    return /^((0|[1-9][0-9]{0,24})(\.[0-9]{0,24})?)$/.test(amount);
};
BywiseHelper.isValidAlfaNum = (value) => {
    return /^[a-zA-Z0-9_]{0,64}$/.test(value);
};
BywiseHelper.isValidHash = (value) => {
    return /^[a-f0-9]{64}$/.test(value);
};
BywiseHelper.isValidDate = (date) => {
    return /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}\.[0-9]{3}Z$/.test(date);
};
BywiseHelper.isValidSign = (sign, signAddress, hash) => {
    if (!/^0x[a-f0-9]{130}$/.test(sign)) {
        return false;
    }
    let recoveredAddress = ethers_1.ethers.utils.verifyMessage(hash, sign);
    let decodedSignAddress = BywiseHelper.decodeBWSAddress(signAddress);
    if (recoveredAddress !== decodedSignAddress.ethAddress) {
        return false;
    }
    return true;
};
BywiseHelper.jsonToString = (mainJson) => {
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
BywiseHelper.numberToHex = (number) => {
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
BywiseHelper.sleep = function sleep(ms) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => {
            setTimeout(resolve, ms + 10);
        });
    });
};
