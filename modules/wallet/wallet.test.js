const { getBalance } = require('./walletBalance.service');
const { createERC20OrBEP20Wallet, createBitcoinWallet } = require('./wallet.service');

const { networks } = require('../../config');

describe('createWallet', () => {
  test('should create a wallet on Binance Smart Chain Testnet', async () => {
    const { publicKey, privateKey } = await createERC20OrBEP20Wallet('binanceSmartChain', 'testnet');
    expect(typeof publicKey).toBe('string');
    expect(typeof privateKey).toBe('string');
  });
});

describe('getBalance', () => {
  test('should get the balance of a wallet on Binance Smart Chain Testnet', async () => {
    const { publicKey, privateKey } = await createERC20OrBEP20Wallet('binanceSmartChain', 'testnet');
    const balance = await getBalance('binanceSmartChain', 'testnet', publicKey);
    expect(typeof balance).toBe('number');
    expect(balance).toEqual(0);
  });
});