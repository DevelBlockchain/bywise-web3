import { Web3 } from './web3/Web3'

(async () => {
  const chain = 'testnet';

  const web3 = new Web3({
    initialNodes: ['https://testnet-node1.bywise.org'],
  });

  const wallet = web3.wallets.createWallet();

  await web3.network.tryConnection();
  console.log('connected web3');

  if (!(await web3.network.testConnections())) {
    throw new Error('connection failed');
  }

  const receiveAddress = 'BWS1MUf9c74C61328A289B74EC5eD6F8dC994e90449e9c0ca';

  const tx = await web3.transactions.buildSimpleTx(wallet, chain, receiveAddress, '100');

  await web3.transactions.sendTransactionSync(tx);
})();