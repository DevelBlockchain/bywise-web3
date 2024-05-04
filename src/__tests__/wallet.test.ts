import { Tx } from '../types';
import {Wallet, BywiseHelper} from '../utils';

test('Create and import wallet', async () => {
    let wallet = new Wallet({
        isMainnet: true
    });
    let walletImported = new Wallet({
        isMainnet: true,
        seed: wallet.seed
    });
    await expect(wallet.address).toBe(walletImported.address);
    await expect(BywiseHelper.isValidAddress(wallet.address)).toBe(true);
});

test('Test wallet tag', async () => {
    let wallet = new Wallet({
        isMainnet: true
    });
    let addr = wallet.getAddress();
    await expect(BywiseHelper.getAddressTag(addr)).toBe('');
    let addrWithTag = wallet.getAddress('banana');
    await expect(BywiseHelper.getAddressTag(addrWithTag)).toBe('banana');
    await expect(() => {
        let invalidTag = 'banana+';
        wallet.getAddress(invalidTag);
    }).toThrow();
});

test('Test Corrupted addresses', async () => {
    let wallet = new Wallet({
        isMainnet: true
    });
    let addr = wallet.getAddress();
    let invalidAddress = 'B' + addr;
    await expect(BywiseHelper.isValidAddress(invalidAddress)).toBe(false);
    let corruptedAddress = addr + '4';
    await expect(BywiseHelper.isValidAddress(corruptedAddress)).toBe(true);
    await expect(() => {
        BywiseHelper.decodeBWSAddress(corruptedAddress)
    }).toThrow();
});