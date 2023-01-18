import { Block } from "./Block"
import { Slice } from "./Slice"
import { Tx } from "./Tx"

export type BlockPack = {
    block: Block
    slices: Slice[]
    txs: Tx[]
}