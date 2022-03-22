import { InfoAddress } from './Wallet';
export default class Helper {
    static readonly ZERO_ADDRESS = "BWS000000000000000000000000000000000000000000000";
    static makeHash(hexBytes: string): string;
    static encodeBWSAddress: (isMainnet: boolean, isContract: boolean, ethAddress: string, tag?: string | undefined) => string;
    static decodeBWSAddress: (address: string) => InfoAddress;
    static getAddressTag: (address: string) => string;
    static isZeroAddress: (address: string) => boolean;
    static isValidAddress: (address: string) => boolean;
    static isValidAmount: (amount: string) => boolean;
    static isValidAlfaNum: (value: string) => boolean;
    static isValidHash: (value: string) => boolean;
    static isValidDate: (date: string) => boolean;
    static isValidSign: (sign: string, signAddress: string, hash: string) => boolean;
    static jsonToString: (mainJson: any) => string;
    static numberToHex: (number: number) => string;
    static sleep: (ms: number) => Promise<void>;
}
