import { Block, Tx, TxType } from "./types";
import { BywiseHelper } from "./utils/BywiseHelper";
import { Web3 } from "./web3/Web3";

(async () => {
    /*let web3 = new Web3({
        //isMainnet: false,
        network: { isMainnet: false, nodes: ['http://localhost:443'], explorer: '' },
    });
    let wallet = web3.accounts.importWallet('theme enter range boat shine brain coffee exact reflect ability mask hair');
    console.log('create web3');
    await web3.network.connect();
    console.log('connect web3');
    let tx = await web3.transactions.buildTx(wallet, BywiseHelper.ZERO_ADDRESS, '0');
    console.log('tx', JSON.stringify(tx));
    tx.isValid();
    let response = await web3.transactions.sendTransaction(tx);
    await web3.network.disconnect();
    console.log('response', response);*/

    console.log(new Block({ lastHash: '02' }).toHash());
    console.log(new Block({ lastHash: '01' }).toHash());

})();