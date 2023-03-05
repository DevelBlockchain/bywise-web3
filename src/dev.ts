import { Web3 } from "./web3/Web3";


const chain = 'local';

(async () => {
    let web3 = new Web3({
        initialNodes: ['http://localhost:3001'],
        debug: false
    });
    const wallet = web3.wallets.importWallet('viable isolate cushion minor hold boss aunt weekend vehicle soda slow oil');
    console.log('create web3 ');
    console.log('test connection', await web3.network.testConnections())
    await web3.network.tryConnection();
    console.log('connected web3');
    console.log('test connection', await web3.network.testConnections())

    const address = 'BWS1MUAE19a03c1cFCE94Ba00aB2fe96E0De197d1e9867006';

    const tx = await web3.transactions.buildConfig.addBalance(wallet, chain, address, '100');
    await web3.transactions.sendTransaction(tx);
    const confirmedTx = await web3.transactions.waitConfirmation(tx.hash, 10000);
    console.log(confirmedTx)
    //console.log(await web3.wallets.getWalletInfo(wallet.address, chain))
    //console.log(await web3.blocks.getSlicesFromBlock('6a8154f698d8c78aea7aea785218e0e07eec9f048c431985e09165341e0cdafd'))
    //console.log(await web3.slices.getTransactionsFromSlice('ee90b7a574bb20c0db7e2edad0b1ba976f7e49edfd93dca45ba7a50995259917'))

    console.log('disconnected web3');
})();