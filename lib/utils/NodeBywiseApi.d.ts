import { Tx, BywiseNode, BywiseAPI, BywiseResponse } from '../types';
export declare class NodeBywiseAPI implements BywiseAPI {
    private static makeRequest;
    private static get;
    private static post;
    getFeeTransaction(node: BywiseNode, tx: Tx): Promise<BywiseResponse>;
    publishNewTransaction(node: BywiseNode, tx: Tx): Promise<BywiseResponse>;
    getBlocks(node: BywiseNode, filter: any): Promise<BywiseResponse>;
    getSlice(node: BywiseNode, sliceHash: string): Promise<BywiseResponse>;
    getTransactionFromSlice(node: BywiseNode, sliceHash: string): Promise<BywiseResponse>;
    tryToken(node: BywiseNode): Promise<BywiseResponse>;
    getInfo(host: string): Promise<BywiseResponse>;
    getNodes(host: string): Promise<BywiseResponse>;
    tryHandshake(host: string, myNode: BywiseNode): Promise<BywiseResponse>;
}
