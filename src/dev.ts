import { Web3 } from "./web3/Web3";

(async () => {
    let web3 = new Web3({
        //isMainnet: false,
        //network: { isMainnet: false, nodes: ['http://localhost'], explorer: '' },
        network: { isMainnet: false, nodes: [], explorer: '' },
        debug: true
    });
    let wallet = web3.wallets.importWallet('theme enter range boat shine brain coffee exact reflect ability mask hair');
    console.log('create web3');
    await web3.network.connect();
    console.log('connected web3');

    let blocks = await web3.blocks.findLastBlocks(3);
    console.log(blocks)

    await web3.network.disconnect();
    console.log('disconnected web3');
})();