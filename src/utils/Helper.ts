import { sha256, base16Decode, base16Encode } from '@waves/ts-lib-crypto';
import { ethers } from "ethers";
import { InfoAddress } from './Wallet';
const ethereum_address = require('ethereum-address');

export default class Helper {
    static readonly ZERO_ADDRESS = 'BWS000000000000000000000000000000000000000000000';

    static makeHash(hexBytes: string) {
        return base16Encode(sha256(base16Decode(hexBytes))).toLowerCase();
    }

    static encodeBWSAddress = (isMainnet: boolean, isContract: boolean, ethAddress: string, tag?: string) => {
        let finalAddress = 'BWS1';
        finalAddress += isMainnet ? 'M' : 'T';
        finalAddress += isContract ? 'C' : 'U';
        finalAddress += ethAddress.substring(2);
        if (tag) {
            if (!Helper.isValidAlfaNum(tag)) throw new Error('invalid tag ' + tag);
            finalAddress += tag;
        }
        let checkSum = Helper.makeHash(finalAddress).substring(0, 3);
        finalAddress += checkSum;
        Helper.decodeBWSAddress(finalAddress);
        return finalAddress;
    }

    static decodeBWSAddress = (address: string): InfoAddress => {
        if (!Helper.isValidAddress(address)) throw new Error('invalid address');
        if (address === Helper.ZERO_ADDRESS) {
            return new InfoAddress({
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
        if (checkSum !== checkSumCalculed) throw new Error('corrupted address');
        if(!ethereum_address.isAddress(ethAddress)) throw new Error('invalid address parameters');
        return new InfoAddress({
            version: '1',
            isMainnet,
            isContract,
            ethAddress,
            tag,
        });
    }

    static getAddressTag = (address: string): string => {
        return Helper.decodeBWSAddress(address).tag;
    }

    static isZeroAddress = (address: string) => {
        return address === Helper.ZERO_ADDRESS;
    }

    static isValidAddress = (address: string) => {
        return address === Helper.ZERO_ADDRESS || /^BWS1[MT][CU][0-9a-fA-F]{40}[0-9a-zA-Z]{0,64}[0-9a-fA-F]{3}$/.test(address);
    }

    static isValidAmount = (amount: string) => {
        return /^((0|[1-9][0-9]{0,17})(\.0|\.[0-9]{0,17}[1-9])?)$/.test(amount);
    }

    static isValidAlfaNum = (value: string) => {
        return /^[a-zA-Z0-9_]{0,64}$/.test(value);
    }

    static isValidHash = (value: string) => {
        return /^[a-zA-Z0-9]{64}$/.test(value);
    }

    static isValidDate = (date: string) => {
        return /^[0-9]{4}\-[0-9]{2}\-[0-9]{2}T[0-9]{2}\:[0-9]{2}\:[0-9]{2}\.[0-9]{3}Z$/.test(date);
    }

    static isValidSign = (sign: string, signAddress: string, hash: string) => {
        if (!/^0x[a-f0-9]{130}$/.test(sign)) {
            return false;
        }
        let recoveredAddress = ethers.utils.verifyMessage(hash, sign);
        let decodedSignAddress = Helper.decodeBWSAddress(signAddress);
        if (recoveredAddress !== decodedSignAddress.ethAddress) {
            return false;
        }
        return true;
    }

    static jsonToString = (mainJson: any): string => {
        const toJSON: any = (json: any) => {
            let newJSON;
            if (Array.isArray(json)) {
                newJSON = json.map(value => toJSON(value))
            } else if (json === null || json === undefined) {
                newJSON = json;
            } else if (typeof json === 'object') {
                let obj: any = {};
                Object.entries(json).sort((a, b) => a[0].localeCompare(b[0], 'en')).forEach(([key, value]) => {
                    obj[key] = toJSON(value)
                })
                newJSON = obj;
            } else {
                newJSON = json;
            }
            return newJSON;
        }
        return JSON.stringify(toJSON(mainJson));
    }

    static numberToHex = (number: number) => {
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
    }

    static sleep = async function sleep(ms: number) {
        await new Promise((resolve) => {
            setTimeout(resolve, ms + 10);
        });
    }
}