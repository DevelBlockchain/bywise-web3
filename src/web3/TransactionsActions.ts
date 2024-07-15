import { PublishedTx, SimulateTx, Tx, TxOutput, TxType } from "../types";
import { BywiseHelper, Wallet } from "../utils";
import { Web3 } from "./Web3";

type BlockchainConfig = {
    name: string;
    input: string[];
}

class ConfigTransactions {
    private readonly web3: Web3;

    constructor(web3: Web3) {
        this.web3 = web3;
    }

    private async toTransaction(wallet: Wallet, chain: string, cfg: BlockchainConfig, type: TxType) {
        const tx = await this.web3.transactions.buildSimpleTx(
            wallet,
            chain,
            BywiseHelper.ZERO_ADDRESS,
            '0',
            type,
            cfg
        );
        tx.isValid();
        return tx;
    }

    voteBlock(wallet: Wallet, chain: string, hash: string, height: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'vote-block',
            input: [hash, `${height}`]
        }, TxType.TX_BLOCKCHAIN_COMMAND)
    }

    startSlice(wallet: Wallet, chain: string, height: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'start-slice',
            input: [`${height}`]
        }, TxType.TX_BLOCKCHAIN_COMMAND)
    }

    stopSlice(wallet: Wallet, chain: string, height: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'stop-slice',
            input: [`${height}`]
        }, TxType.TX_BLOCKCHAIN_COMMAND)
    }

    setConfigBlockTime(wallet: Wallet, chain: string, delay: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['blockTime', `${delay}`]
        }, TxType.TX_COMMAND)
    }

    setConfigFeeBasic(wallet: Wallet, chain: string, coef: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['feeBasic', `${coef}`]
        }, TxType.TX_COMMAND)
    }

    setConfigFeeCoefSize(wallet: Wallet, chain: string, coef: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['feeCoefSize', `${coef}`]
        }, TxType.TX_COMMAND)
    }

    setConfigFeeCoefAmount(wallet: Wallet, chain: string, coef: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['feeCoefAmount', `${coef}`]
        }, TxType.TX_COMMAND)
    }

    setConfigFeeCoefCost(wallet: Wallet, chain: string, coef: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['feeCoefCost', `${coef}`]
        }, TxType.TX_COMMAND)
    }

    setConfigPOI(wallet: Wallet, chain: string, count: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['poi', `${count}`]
        }, TxType.TX_COMMAND)
    }

    setConfigExecuteLimit(wallet: Wallet, chain: string, limit: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['executeLimit', `${limit}`]
        }, TxType.TX_COMMAND)
    }

    setConfigSizeLimit(wallet: Wallet, chain: string, limit: number): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setConfig',
            input: ['sizeLimit', `${limit}`]
        }, TxType.TX_COMMAND)
    }

    setInfoName(wallet: Wallet, chain: string, name: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setInfo',
            input: ['name', name]
        }, TxType.TX_COMMAND_INFO)
    }

    setInfoBio(wallet: Wallet, chain: string, bio: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setInfo',
            input: ['bio', bio]
        }, TxType.TX_COMMAND_INFO)
    }

    setInfoUrl(wallet: Wallet, chain: string, url: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setInfo',
            input: ['url', url]
        }, TxType.TX_COMMAND_INFO)
    }

    setInfoPhoto(wallet: Wallet, chain: string, photo: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setInfo',
            input: ['photo', photo]
        }, TxType.TX_COMMAND_INFO)
    }

    setInfoPublicKey(wallet: Wallet, chain: string, publicKey: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setInfo',
            input: ['publicKey', publicKey]
        }, TxType.TX_COMMAND_INFO)
    }

    addAdmin(wallet: Wallet, chain: string, address: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'addAdmin',
            input: [address]
        }, TxType.TX_COMMAND)
    }

    removeAdmin(wallet: Wallet, chain: string, address: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'removeAdmin',
            input: [address]
        }, TxType.TX_COMMAND)
    }

    addValidator(wallet: Wallet, chain: string, address: string, type: 'block' | 'slice'): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'addValidator',
            input: [address, type]
        }, TxType.TX_COMMAND)
    }

    removeValidator(wallet: Wallet, chain: string, address: string, type: 'block' | 'slice'): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'removeValidator',
            input: [address, type]
        }, TxType.TX_COMMAND)
    }

    setBalance(wallet: Wallet, chain: string, address: string, balance: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'setBalance',
            input: [address, balance]
        }, TxType.TX_COMMAND)
    }

    addBalance(wallet: Wallet, chain: string, address: string, balance: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'addBalance',
            input: [address, balance]
        }, TxType.TX_COMMAND)
    }

    subBalance(wallet: Wallet, chain: string, address: string, balance: string): Promise<Tx> {
        return this.toTransaction(wallet, chain, {
            name: 'subBalance',
            input: [address, balance]
        }, TxType.TX_COMMAND)
    }
}

export class TransactionsActions {
    private readonly web3: Web3;
    public buildConfig;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.buildConfig = new ConfigTransactions(web3);
    }

    buildSimpleTx = async (wallet: Wallet, chain: string, to: string | string[], amount: string | string[], type?: TxType, data?: any, foreignKeys?: string[]): Promise<Tx> => {
        const node = await this.web3.network.getRandomNode();
        const info = await this.web3.network.getAPI(node).getInfo(node.host);
        let tx = new Tx();
        tx.chain = chain;
        tx.version = "2";
        tx.from = [wallet.address];
        tx.to = Array.isArray(to) ? to : [to];
        tx.amount = Array.isArray(amount) ? amount : [amount];
        tx.type = type ? type : TxType.TX_NONE;
        if (type) {
            tx.data = data ? data : {};
        } else {
            tx.data = {};
        }
        tx.foreignKeys = foreignKeys ? foreignKeys : [];
        tx.created = info.data.timestamp;
        tx.fee = (await this.estimateFee(tx)).feeUsed;
        tx.hash = tx.toHash();
        tx.sign = [await wallet.signHash(tx.hash)];
        return tx;
    }

    signTx = async (wallets: Wallet[], tx: Tx): Promise<Tx> => {
        if (tx.sign.length !== tx.from.length) throw new Error('from field must be the same length as sign');
        tx.hash = tx.toHash();
        for (let i = 0; i < tx.from.length; i++) {
            const from = tx.from[i];
            for (let j = 0; j < wallets.length; j++) {
                const wallet = wallets[j];
                if (wallet.address === from) {
                    tx.sign[i] = await wallet.signHash(tx.hash);
                }
            }
        }
        return tx;
    }

    estimateFee = async (tx: Tx): Promise<TxOutput> => {
        let simulateTx: SimulateTx = {
            chain: tx.chain,
            from: tx.from,
            to: tx.to,
            amount: tx.amount,
            type: tx.type,
            data: tx.data,
            foreignKeys: tx.foreignKeys,
        };
        const node = this.web3.network.getRandomNode();
        let simulate = await this.web3.network.getAPI(node).getFeeTransaction(node, simulateTx);
        if (simulate.error) {
            throw new Error(`Internal error - details: ${simulate.error}`)
        };
        if (simulate.data.error) {
            throw new Error(`Can't simulate transaction - details: ${simulate.data.error}`)
        };
        return simulate.data;
    }

    sendTransactionSync = async (tx: Tx): Promise<TxOutput> => {
        const error = await this.sendTransaction(tx);
        if (error) throw new Error(`Failed send transaction - ${error}`);
        const minedTx = await this.waitConfirmation(tx.hash, 120000);
        if (!minedTx) throw new Error(`Timeout`);
        if (minedTx.status === 'confirmed' || minedTx.status === 'mined') {
            return minedTx.output;
        } else {
            throw new Error(`Invalidated transaction${minedTx.output ? (' - ' + minedTx.output.error) : ''}`);
        }
    }

    sendTransaction = async (tx: Tx): Promise<string | undefined> => {
        return await this.web3.network.sendAll(async (node) => {
            return await this.web3.network.getAPI(node).publishNewTransaction(node, tx);
        });
    }

    getTransactionByHash = async (txHash: string): Promise<PublishedTx | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.getAPI(node).getTransactionByHash(node, txHash);
            if (!req.error) {
                return req.data;
            }
        });
    }

    getTxs = async (chain: string, parameters: { offset?: number, limit?: number, asc?: boolean, find?: { searchBy: 'address' | 'from' | 'to' | 'key' | 'status', value: string } } = {}): Promise<PublishedTx[] | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.getAPI(node).getTxs(node, chain, parameters);
            if (!req.error) {
                return req.data;
            }
        });
    }

    countTxs = async (parameters: { chain?: string, find?: { searchBy: 'address' | 'from' | 'to' | 'key' | 'status', value: string } } = {}): Promise<number | undefined> => {
        return await this.web3.network.findAll(async (node) => {
            let req = await this.web3.network.getAPI(node).countTxs(node, parameters);
            if (!req.error) {
                return req.data.count;
            }
        });
    }

    waitConfirmation = async (txHash: string, timeout: number = 30000): Promise<PublishedTx | undefined> => {
        let uptime = Date.now();
        let response: PublishedTx | undefined;
        while (Date.now() < uptime + timeout) {
            response = await this.getTransactionByHash(txHash);
            await BywiseHelper.sleep(500);
            if (response && response.status !== 'mempool') {
                return response;
            }
        }
        return response;
    }
}