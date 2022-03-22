import BywiseTransaction from './BywiseTransaction';
import BywisePack from './BywisePack';
import BywiseHelper from '../utils/BywiseHelper';

export class Slice implements BywiseTransaction, BywisePack {
    height: number = 0;
    transactions: string[] = [];
    numberOfTransactions: number = 0;
    version: string = '';
    from: string = '';
    created: string = '';
    merkleRoot: string = '';
    lastBlockHash: string = '';
    hash: string = '';
    sign: string = '';

    getMerkleRoot() {
        let merkleRoot = '';
        if (this.transactions.length > 0) {
            this.transactions.forEach(txHash => {
                merkleRoot += txHash;
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
        bytes += BywiseHelper.numberToHex(this.numberOfTransactions);
        bytes += Buffer.from(this.version, 'utf-8').toString('hex');
        bytes += Buffer.from(this.from, 'utf-8').toString('hex');
        bytes += Buffer.from(this.created, 'utf-8').toString('hex');
        bytes += this.merkleRoot;
        bytes += this.lastBlockHash;
        bytes = BywiseHelper.makeHash(bytes);
        return bytes;
    }

    isValid(): void {
        if (this.height < 0) throw new Error('invalid slice height ' + this.height);
        if (this.numberOfTransactions <= 0) throw new Error('invalid numberOfTransactions ' + this.numberOfTransactions);
        if (this.transactions.length !== this.numberOfTransactions) throw new Error('invalid slice length ' + this.transactions.length + ' ' + this.numberOfTransactions);
        for (let i = 0; i < this.transactions.length; i++) {
            let txHash = this.transactions[i];
            if (!BywiseHelper.isValidHash(txHash)) throw new Error(`invalid tx hash ${i} - ${txHash}`);
        }
        if (this.version !== '1') throw new Error('invalid slice version ' + this.version);
        if (!BywiseHelper.isValidAddress(this.from)) throw new Error('invalid slice from address ' + this.from);
        if (!BywiseHelper.isValidDate(this.created)) throw new Error('invalid slice created date ' + this.created);
        if (this.merkleRoot !== this.getMerkleRoot()) throw new Error(`invalid slice merkle root ${this.merkleRoot} !== ${this.getMerkleRoot()}`);
        if (!BywiseHelper.isValidHash(this.lastBlockHash)) throw new Error('invalid lastBlockHash ' + this.lastBlockHash);
        if (this.hash !== this.toHash()) throw new Error(`invalid slice hash ${this.hash} ${this.toHash()}`);
        if (!BywiseHelper.isValidSign(this.sign, this.from, this.hash)) throw new Error('invalid slice signature');
    }
}