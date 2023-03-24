import { Web3 } from "./web3/Web3";
import fs from 'fs';

const chain = 'testnet';

(async () => {
    /*const web3 = new Web3({
        initialNodes: ['http://localhost:3001'],
        debug: false
    });*/

    const web3 = new Web3({
        initialNodes: ['https://testnet-node1.bywise.org'],
        debug: false
    });
    const wallet = web3.wallets.importWallet('viable isolate cushion minor hold boss aunt weekend vehicle soda slow oil');
    const w1 = web3.wallets.importWallet('pink once aim obey arrive wheat inch search deal urban embody party');
    const w2 = web3.wallets.importWallet('boy accuse elephant trouble moment wear remove follow series uncle total unknown');
    const marketCode = fs.readFileSync('./assets/Market.js', 'utf8');
    const tokenCode = fs.readFileSync('./assets/BST20.js', 'utf8');

    console.log('w1', w1.seed)
    console.log('w2', w2.seed)

    await web3.network.tryConnection();

    const market = 'BWS1MC263f5bBadd3C4580A065d8F0a67aC7418D37140f9ee';
    const token = 'BWS1MCc62451D72F2a497D5a378129252824b7705355DCa54';
    /*
    const market = BywiseHelper.getBWSAddressContract();
    const token = BywiseHelper.getBWSAddressContract();
    let tx = await web3.transactions.buildSimpleTx(
        wallet,
        chain,
        market,
        '0',
        TxType.TX_CONTRACT,
        { contractAddress: market, code: marketCode }
    );
    let output = await web3.transactions.sendTransactionSync(tx);
    console.log('deploy market', output.output.contractAddress)
    tx = await web3.transactions.buildSimpleTx(
        wallet,
        chain,
        token,
        '0',
        TxType.TX_CONTRACT,
        { contractAddress: token, code: tokenCode }
    );
    output = await web3.transactions.sendTransactionSync(tx);
    console.log('deploy token', output.output.contractAddress)

    // register new token
    tx = await web3.transactions.buildSimpleTx(
        wallet,
        chain,
        market,
        '10',
        TxType.TX_CONTRACT_EXE,
        [{ method: 'registerNewToken', inputs: [token, '0.5'] }]
    );
    output = await web3.transactions.sendTransactionSync(tx);
    console.log('registerNewToken', output.error, output.output)

    tx = await web3.transactions.buildSimpleTx(
        wallet,
        chain,
        token,
        '0',
        TxType.TX_CONTRACT_EXE,
        [{ method: 'transfer', inputs: [w1.address, '10000000000000000000'] }] // 10 tokens
    );
    output = await web3.transactions.sendTransactionSync(tx);
    console.log('transfer to secondWallet', output.error, output.output)

    let txWithoutFee = new Tx();
    txWithoutFee.chain = chain;
    txWithoutFee.version = "2";
    txWithoutFee.from = [w1.address];
    txWithoutFee.to = [token, token, market];
    txWithoutFee.amount = ['0', '0', '0'];
    txWithoutFee.type = TxType.TX_CONTRACT_EXE;
    txWithoutFee.foreignKeys = [];
    txWithoutFee.data = [
        {
            method: 'transfer',
            inputs: [w2.address, '3000000000000000000'],
        },
        {
            method: 'approve',
            inputs: [market, '100000000000000000000000000000000'],
        },
        {
            method: 'payFee',
            inputs: [token],
        },
    ]
    txWithoutFee.created = Math.floor(Date.now() / 1000);
    txWithoutFee.fee = (await web3.transactions.estimateFee(txWithoutFee)).feeUsed;
    console.log('estimateFee', txWithoutFee.fee)
    txWithoutFee.fee = (await web3.transactions.estimateFee(txWithoutFee)).feeUsed;
    console.log('estimateFee', txWithoutFee.fee)
    txWithoutFee.hash = txWithoutFee.toHash();
    txWithoutFee.sign = [await w1.signHash(txWithoutFee.hash)];

    let outputF = await web3.transactions.sendTransactionSync(txWithoutFee);
    console.log('transfer without gas', outputF.error, outputF.output)
    /**/

    let output = await web3.contracts.readContract(
        chain,
        market,
        'simulateFee',
        [token, '0.1']
    );
    console.log('simulateFee', parseFloat(output.output) / (10 ** 18))

    let eventsFrom: any = await web3.contracts.getContractEventByAddress(
        chain,
        token,
        'Transfer',
        {
            key: 'from',
            value: 'BWS1MU32B25f77Af616041C173A4859EAF2c39420D386393d'
        }
    );
    let eventsTo: any = await web3.contracts.getContractEventByAddress(
        chain,
        token,
        'Transfer',
        {
            key: 'to',
            value: 'BWS1MU32B25f77Af616041C173A4859EAF2c39420D386393d'
        }
    );
    let events = [...eventsFrom, ...eventsTo].sort((e1, e2) => e2.create - e1.create);
    events = events.filter((event, index) => {
        let repeted = true;
        for (let i = index + 1; i < events.length; i++) {
            if (events[i].hash === event.hash) {
                repeted = false;
            }
        }
        return repeted;
    });
    events = events.map(event => ({ create: event.create, ...(JSON.parse(event.data))}))

    console.log('events', events)


    /*
        let output = await web3.transactions.readContract(
            chain,
            token,
            'balanceOf',
            [w1.address]
        );
        console.log('balanceOf w1', parseFloat(output.output) / (10 ** 18))
    
        output = await web3.transactions.readContract(
            chain,
            token,
            'balanceOf',
            [market]
        );
        console.log('balanceOf market', parseFloat(output.output) / (10 ** 18))
        
        output = await web3.transactions.readContract(
            chain,
            market,
            'getBalance',
            [token]
        );
        console.log('getBalance', parseFloat(output.output) / (10 ** 18))
    
        output = await web3.transactions.readContract(
            chain,
            market,
            'getBalanceBWS',
            [token]
        );
        console.log('getBalanceBWS', parseFloat(output.output))
    
        output = await web3.transactions.readContract(
            chain,
            token,
            'balanceOf',
            [w2.address]
        );
        console.log('balanceOf w2', parseFloat(output.output) / (10 ** 18))*/


    /*console.log('create web3 ');
    console.log('test connection', await web3.network.testConnections())
    await web3.network.tryConnection();
    console.log('connected web3');
    console.log('test connection', await web3.network.testConnections())

    const address = 'BWS1MU32B25f77Af616041C173A4859EAF2c39420D386393d';

    const tx = await web3.transactions.buildConfig.addBalance(wallet, chain, address, '100000');
    await web3.transactions.sendTransaction(tx);
    const confirmedTx = await web3.transactions.waitConfirmation(tx.hash, 10000);
    console.log(confirmedTx)*/
    //console.log(await web3.wallets.getWalletInfo(wallet.address, chain))
    //console.log(await web3.blocks.getSlicesFromBlock('6a8154f698d8c78aea7aea785218e0e07eec9f048c431985e09165341e0cdafd'))
    //console.log(await web3.slices.getTransactionsFromSlice('ee90b7a574bb20c0db7e2edad0b1ba976f7e49edfd93dca45ba7a50995259917'))

    console.log('disconnected web3');
})();