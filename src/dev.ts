import { Tx, TxType } from "./types";

const chain = 'testnet';

(async () => {
    const input = "BWS1MUf3fE542466114436c184ad1936CD72D3baeEA06c";
    const expected = "366f167d787e3b73a17246e60ba6c353adf3ec41ee876bceaba8550e819568ca";

    //console.log(base16Decode(input));
    //console.log(CryptoJS.enc.Utf16LE.parse(input).clamp());

    //let output2 = CryptoJS.SHA256(CryptoJS.enc.Utf16BE.parse(input)).toString();
    //let output3 = CryptoJS.SHA256(CryptoJS.enc.Utf16LE.parse(input)).toString();
    //let output1 = CryptoJS.SHA256(CryptoJS.SHA256(CryptoJS.enc.Hex.parse(input))).toString();

    //console.log(output1)
    //console.log(expected)

    const jsonTX = {"version":"2","chain":"testnet","from":["BWS1MUf3fE542466114436c184ad1936CD72D3baeEA06c366"],"to":["BWS1MUf3fE542466114436c184ad1936CD72D3baeEA06c366"],"amount":["0"],"fee":"0.102","type":"contract-exe","foreignKeys":[],"data":{},"created":1714822329,"hash":"acd4373262475f224117f1a9113d0471e3ddcb5aad7b72072ed728432cbf4f65","sign":["0x0bb201b93a6f53e073e7392f368f86496be99ce9031d8697086fe6d70cf365971906fcce8a20071e0d5e6968ef5a672225a7c552a562100f43aa175ec9ae61581c"]}
    const tx = new Tx(jsonTX);
    tx.isValid();
    console.log('done')
    
    /*console.log('run')
    const web3 = new Web3({
        initialNodes: ['https://testnet-node1.bywise.org'],
        debug: false
    });
    const wallet = web3.wallets.importWallet('viable isolate cushion minor hold boss aunt weekend vehicle soda slow oil');
    
    await web3.network.tryConnection();
    
    let tx = await web3.transactions.buildSimpleTx(
        wallet,
        chain,
        wallet.address,
        '0',
        TxType.TX_CONTRACT_EXE,
    );

    tx.isValid();

    let txJson = JSON.stringify(tx);
    console.log(txJson);

    let recTX = new Tx(JSON.parse(txJson));
    recTX.isValid();
    console.log(tx);
    console.log(recTX);

    console.log('disconnected web3');*/
})();

/*
"devDependencies": {
    "@types/crypto-js": "^4.2.2",
    "@types/jest": "^27.5.2",
    "jest": "^27.5.1",
    "nodemon": "^3.1.0",
    "prettier": "^2.6.0",
    "ts-jest": "^27.1.5",
    "ts-node": "^10.9.2",
    "tslint": "^5.20.1",
    "tslint-config-prettier": "^1.18.0",
    "typescript": "^4.9.5"
  },
  "dependencies": {
    "axios": "^0.26.1",
    "crypto-js": "^4.2.0",
    "ethereum-address": "^0.0.4",
    "ethers": "^5.7.2",
    "randomstring": "^1.3.0"
  }
*/