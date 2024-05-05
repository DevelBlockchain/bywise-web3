<p align="center">
  <img src="assets/bywise.png" width="300" alt="Bywise Web3" />
</p>

# Bywise Web3

## Contributors Welcome!
Hello, this is a relatively simple library that connects websites with the Bywise blockchain. If you have some basic working JS/TS knowledge, please head over to the open bugs/enhancements and help clear the backlog. Thanks in advance! 🤠

Please don't forget to join our [discord community](https://discord.com/invite/x4TKNBQ9Gz).

---

## Installation
```sh
npm install @bywise/web3
```

## Usage

Require in `javascript` as
```javascript
const Web3 = require('@bywise/web3');
```
For `typescript`, use
```javascript
import Web3 from '@bywise/web3';
```

## Operations

### New instance

```javascript
const chain = 'testnet';
  
const web3 = new Web3({
    initialNodes: ['https://testnet-node1.bywise.org'],
});
```

### Create simple transaction

```javascript
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
```
