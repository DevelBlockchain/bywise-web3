import { TxType } from "./types";
import { BywiseHelper, Wallet } from "./utils";
import { Web3 } from "./web3/Web3";


const chain = 'local';

(async () => {
    let web3 = new Web3({
        initialNodes: ['http://localhost:3001'],
        debug: true
    });
    const wallet = web3.wallets.importWallet('theme enter range boat shine brain coffee exact reflect ability mask hair');
    console.log('create web3 ');
    console.log('test connection', await web3.network.testConnections())
    await web3.network.tryConnection();
    console.log('connected web3');
    console.log('test connection', await web3.network.testConnections())

    let tx;
    let confirmedTx;
    let contractAddress = 'BWS1MCC5822E2DE241b417384A6D646d44a101D3308eddab4';

    tx = await web3.transactions.buildConfig.setBalance(wallet, chain, wallet.address, '30000');
    //console.log(await web3.wallets.getWalletInfo(wallet.address, chain))
    //tx = await web3.transactions.buildSimpleTx(
    //    wallet,
    //    chain,
    //    BywiseHelper.ZERO_ADDRESS,
    //    '0',
    //    TxType.TX_JSON,
    //    {
    //        code: 'globalThis.contract = () => {return Math.random();};'
    //    }
    //);
    await web3.transactions.sendTransaction(tx);
    //confirmedTx = await web3.transactions.waitConfirmation(tx.hash, 10000);
    //console.log(await web3.wallets.getWalletInfo(wallet.address, chain))
    //console.log(await web3.blocks.getSlicesFromBlock('6a8154f698d8c78aea7aea785218e0e07eec9f048c431985e09165341e0cdafd'))
    //console.log(await web3.slices.getTransactionsFromSlice('ee90b7a574bb20c0db7e2edad0b1ba976f7e49edfd93dca45ba7a50995259917'))
    
    /*tx = await web3.transactions.buildSimpleTx(
        wallet,
        chain,
        BywiseHelper.ZERO_ADDRESS,
        '0',
        TxType.TX_CONTRACT,
        {
            code: 'globalThis.contract = () => {return Math.random();};'
        }
    );
    await web3.transactions.sendTransaction(tx);
    confirmedTx = await web3.transactions.waitConfirmation(tx.hash, 100000);
    console.log('confirmedTx', confirmedTx)
    contractAddress = confirmedTx?.output.output.contractAddress;
    console.log('contractAddress', contractAddress)
    tx = await web3.transactions.buildSimpleTx(
        wallet,
        chain,
        contractAddress,
        '0',
        TxType.TX_CONTRACT_EXE,
        {
            code: 'globalThis.contract()'
        }
    );
    await web3.transactions.sendTransaction(tx);
    confirmedTx = await web3.transactions.waitConfirmation(tx.hash, 10000);
    console.log(confirmedTx)*/

    console.log('disconnected web3');
})();