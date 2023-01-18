import { Block } from "./Block";
import { Slice } from "./Slice";
import { Tx } from "./Tx";
export declare type BlockPack = {
    block: Block;
    slices: Slice[];
    txs: Tx[];
};
