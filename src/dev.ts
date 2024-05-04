import { ethers } from "ethers";

(async () => {
  const wallet = ethers.Wallet.createRandom();
  const seed = wallet.mnemonic?.phrase;
  if (!seed) throw new Error('cant generate mnemonic phrase')
  console.log(wallet.address, seed, wallet.path);

  const masterNode = ethers.HDNodeWallet.fromPhrase(seed, undefined, "m/44'/60'/0'/0/0");
  const xpub = masterNode.neuter().extendedKey; 
  console.log('xpub', xpub)
  const publicNode = ethers.HDNodeWallet.fromExtendedKey(xpub);

  console.log(masterNode.address, masterNode.mnemonic?.phrase, masterNode.path);
  console.log(publicNode.address, publicNode.path)

  const node = masterNode.deriveChild(1);
  const pnode = publicNode.deriveChild(1);
  console.log(node.address, node.path);
  console.log(pnode.address, pnode.path);
})();