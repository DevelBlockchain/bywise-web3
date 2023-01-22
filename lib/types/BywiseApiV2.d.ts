import { Tx, BywiseNode, SimulateTx, Slice, TxOutput, InfoNode, PublishedTx, BywiseResponse, BlockPack, OutputSimulateContract, SimulateContract } from '.';
import { WalletInfo } from '../utils';
import { Block, PublishedBlock } from './Block';
import { CountType } from './BywiseNode';
import { PublishedSlice } from './Slice';
export declare class BywiseApiV2 {
    private debug;
    constructor(debug?: boolean);
    private get;
    private post;
    publishNewBlock(node: BywiseNode, block: Block): Promise<BywiseResponse<void>>;
    getBlocks(node: BywiseNode, chain: string, parameters?: {
        status?: string;
        offset?: number;
        limit?: number;
        asc?: boolean;
    }): Promise<BywiseResponse<PublishedBlock[]>>;
    countBlocks(node: BywiseNode, chain: string, parameters?: {
        status?: string;
    }): Promise<BywiseResponse<CountType>>;
    getBlockByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedBlock>>;
    getBlockByHeight(node: BywiseNode, chain: string, height: number): Promise<BywiseResponse<Block>>;
    getBlockPackByHeight(node: BywiseNode, chain: string, height: number): Promise<BywiseResponse<BlockPack>>;
    getSlicesFromBlock(node: BywiseNode, blockHash: string): Promise<BywiseResponse<PublishedSlice[]>>;
    publishNewSlice(node: BywiseNode, slice: Slice): Promise<BywiseResponse<void>>;
    getSlices(node: BywiseNode, chain: string, parameters: {
        status?: string;
        offset?: number;
        limit?: number;
        asc?: boolean;
    }): Promise<BywiseResponse<PublishedSlice[]>>;
    countSlices(node: BywiseNode, chain: string, parameters?: {
        status?: string;
    }): Promise<BywiseResponse<CountType>>;
    getSliceByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedSlice>>;
    getTransactionsFromSlice(node: BywiseNode, sliceHash: string): Promise<BywiseResponse<PublishedTx[]>>;
    publishNewTransaction(node: BywiseNode, tx: Tx): Promise<BywiseResponse<void>>;
    getTxs(node: BywiseNode, chain: string, parameters: {
        status?: string;
        offset?: number;
        limit?: number;
        asc?: boolean;
        find?: {
            searchBy: 'address' | 'from' | 'to' | 'key';
            value: string;
        };
    }): Promise<BywiseResponse<PublishedTx[]>>;
    countTxs(node: BywiseNode, parameters: {
        chain?: string;
        status?: string;
        find?: {
            searchBy: 'address' | 'from' | 'to' | 'key';
            value: string;
        };
    }): Promise<BywiseResponse<CountType>>;
    getTransactionByHash(node: BywiseNode, hash: string): Promise<BywiseResponse<PublishedTx>>;
    getContractByAddress(node: BywiseNode, chain: string, address: string): Promise<BywiseResponse<TxOutput>>;
    trySimulate(node: BywiseNode, simulateTx: SimulateContract): Promise<BywiseResponse<OutputSimulateContract>>;
    getFeeTransaction(node: BywiseNode, simulateTx: SimulateTx): Promise<BywiseResponse<TxOutput>>;
    getWalletInfo(node: BywiseNode, address: string, chain: string): Promise<BywiseResponse<WalletInfo>>;
    tryToken(node: BywiseNode): Promise<BywiseResponse<InfoNode>>;
    getInfo(host: string): Promise<BywiseResponse<InfoNode>>;
    tryHandshake(host: string, myNode?: BywiseNode): Promise<BywiseResponse<BywiseNode>>;
}
