import { InfoAddress } from '../types/InfoAddress';
export declare class BywiseHelper {
    static readonly ZERO_ADDRESS = "BWS000000000000000000000000000000000000000000000";
    static makeHashV1(hexBytes: string): string;
    static makeHash(hexBytes: string): string;
    static getBWSAddressContract: () => string;
    static encodeBWSAddress: (isContract: boolean, ethAddress: string, tag?: string) => string;
    static decodeBWSAddress: (address: string) => InfoAddress;
    static getAddressTag: (address: string) => string;
    static getStealthAddressFromExtendedPublicKey: (xpub: string, index: number) => string;
    static isZeroAddress: (address: string) => address is "BWS000000000000000000000000000000000000000000000";
    static isValidAddress: (address: string) => boolean;
    static isContractAddress: (address: string) => boolean;
    static isStringArray: (arr: any) => boolean;
    static isValidAmount: (amount: string) => boolean;
    static isValidAlfaNum: (value: string) => boolean;
    static isValidHash: (value: string) => boolean;
    static isValidInteger: (height: number) => boolean;
    static isValidDate: (date: number) => boolean;
    static isValidSign: (sign: string, signAddress: string, hash: string) => boolean;
    static jsonToString: (mainJson: any) => string;
    static numberToHex: (number: number) => string;
    static sleep: (ms: number) => Promise<void>;
}
