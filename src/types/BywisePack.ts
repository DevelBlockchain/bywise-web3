import { Block } from "./Block"
import { Slice } from "./Slice"
import { Tx } from "./Tx"

export interface BywisePack {
    getMerkleRoot(): string
}

export type BlockPack = {
    block: Block
    slice: Slice | null
    txs: Tx[]
}