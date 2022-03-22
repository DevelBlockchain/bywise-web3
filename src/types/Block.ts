import BywiseTransaction from './BywiseTransaction';
import BywisePack from './BywisePack';
import BywiseHelper from '../utils/BywiseHelper';

export class Block implements BywiseTransaction, BywisePack {
    height: number = 0;
    numberOfSlices: number = 0;
    slices: string[] = [];
    version: string = '';
    from: string = '';
    created: string = '';
    merkleRoot: string = '';
    lastHash: string = '';
    hash: string = '';
    sign: string = '';
    externalTxID: string[] = [];

    getMerkleRoot() {
        let merkleRoot = '';
        if (this.slices.length > 0) {
            this.slices.forEach(sliceHash => {
                merkleRoot += sliceHash;
            })
            merkleRoot = BywiseHelper.makeHash(merkleRoot);
        } else {
            merkleRoot = '0000000000000000000000000000000000000000000000000000000000000000'
        }
        return merkleRoot
    }

    toHash(): string {
        let bytes = '';
        bytes += BywiseHelper.numberToHex(this.height);
        bytes += BywiseHelper.numberToHex(this.numberOfSlices);
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        bytes += Buffer.from(this.from, 'utf-8').toString('hex');
        bytes += Buffer.from(this.created, 'utf-8').toString('hex');
        bytes += this.merkleRoot;
        bytes += this.lastHash;
        bytes = BywiseHelper.makeHash(bytes);
        return bytes;
    }

    isValid(): void {
        if (this.height < 0) throw new Error('invalid block height ' + this.height);
        if (this.numberOfSlices < 0) throw new Error('invalid numberOfSlices ' + this.numberOfSlices);
        if (this.slices.length !== this.numberOfSlices) throw new Error('invalid slice length ' + this.slices.length + ' ' + this.numberOfSlices);
        for (let i = 0; i < this.slices.length; i++) {
            let sliceHash = this.slices[i];
            if (!BywiseHelper.isValidHash(sliceHash)) throw new Error(`invalid slice hash ${i} - ${sliceHash}`);
        }
        if (this.version !== '1') throw new Error('invalid block version ' + this.version);
        if (!BywiseHelper.isValidAddress(this.from)) throw new Error('invalid block from address ' + this.from);
        if (!BywiseHelper.isValidDate(this.created)) throw new Error('invalid block created date ' + this.created);
        if (this.merkleRoot !== this.getMerkleRoot()) throw new Error(`invalid block merkle root ${this.merkleRoot} !== ${this.getMerkleRoot()}`);
        if (!BywiseHelper.isValidHash(this.lastHash)) throw new Error('invalid lastHash ' + this.lastHash);
        if (this.hash !== this.toHash()) throw new Error(`invalid block hash ${this.hash} ${this.toHash()}`);
        if (!BywiseHelper.isValidSign(this.sign, this.from, this.hash)) throw new Error('invalid block signature');
    }
}