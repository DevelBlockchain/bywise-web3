export class InfoAddress {
    public readonly version: string;
    public readonly isContract: boolean;
    public readonly isStealthAddress: boolean;
    public readonly ethAddress: string;
    public readonly tag: string;

    constructor(config: { version: string, isContract: boolean, isStealthAddress: boolean, ethAddress: string, tag: string }) {
        this.version = config.version;
        this.isContract = config.isContract;
        this.isStealthAddress = config.isStealthAddress;
        this.ethAddress = config.ethAddress;
        this.tag = config.tag;
    }
}