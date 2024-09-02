import { InfoAddress } from '../types/InfoAddress';
export declare enum BywiseAddressType {
    ADDRESS_TYPE_ZERO = "ADDRESS_TYPE_ZERO",
    ADDRESS_TYPE_CONTRACT = "ADDRESS_TYPE_CONTRACT",
    ADDRESS_TYPE_STEALTH = "ADDRESS_TYPE_STEALTH",
    ADDRESS_TYPE_USER = "ADDRESS_TYPE_USER"
}
export declare class BywiseHelper {
    static readonly ZERO_ADDRESS = "BWS000000000000000000000000000000000000000000000";
    static makeHashV1(hexBytes: string): string;
    static makeHash(hexBytes: string): string;
    static getBWSAddressContract: () => string;
    static encodeBWSAddress: (typeAddress: BywiseAddressType, ethAddress: string, tag?: string) => string;
    static decodeBWSAddress: (address: string) => InfoAddress;
    static getAddressTag: (address: string) => string;
    static getStealthAddressFromExtendedPublicKey: (xpub: string, index: number) => string;
    static isZeroAddress: (address: string) => address is "BWS000000000000000000000000000000000000000000000";
    static isValidAddress: (address: string) => boolean;
    static isContractAddress: (address: string) => boolean;
    static isStealthAddress: (address: string) => boolean;
    static isStringArray: (arr: any) => boolean;
    static isValidAmount: (amount: string) => boolean;
    static isValidSignedAmount: (amount: string) => boolean;
    static isValidAlfaNum: (value: string) => boolean;
    static isValidAlfaNumSlash: (value: string) => boolean;
    static isValidHash: (value: string) => boolean;
    static isValidInteger: (height: number) => boolean;
    static isValidDate: (date: number) => boolean;
    static isValidSign: (sign: string, signAddress: string, hash: string) => boolean;
    static jsonToString: (mainJson: any) => string;
    static numberToHex: (number: number) => string;
    static sleep: (ms: number) => Promise<void>;
}
