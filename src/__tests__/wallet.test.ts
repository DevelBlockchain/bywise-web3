import Helper from '../utils/Helper';
import Wallet from '../utils/Wallet';

test('Create and import wallet', async () => {
    let wallet = new Wallet({
        isMainnet: true
    });
    let walletImported = new Wallet({
        isMainnet: true,
        seed: wallet.seed
    });
    await expect(wallet.address).toBe(walletImported.address);
    await expect(Helper.isValidAddress(wallet.address)).toBe(true);
});

test('Test wallet tag', async () => {
    let wallet = new Wallet({
        isMainnet: true
    });
    let addr = wallet.getAddress();
    await expect(Helper.getAddressTag(addr)).toBe('');
    let addrWithTag = wallet.getAddress('banana');
    await expect(Helper.getAddressTag(addrWithTag)).toBe('banana');
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
    await expect(Helper.isValidAddress(invalidAddress)).toBe(false);
    let corruptedAddress = addr + '4';
    await expect(Helper.isValidAddress(corruptedAddress)).toBe(true);
    await expect(() => {
        Helper.decodeBWSAddress(corruptedAddress)
    }).toThrow();
});