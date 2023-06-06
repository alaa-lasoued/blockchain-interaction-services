const { sendBEP20ERC20Transaction } = require('./transaction');
const { getBalance } = require('../wallet/getBalance');

describe('sendTransaction', () => {
  let privateKey;
  let publicKey;
  let toAddress;
  let amount;
  let tokenAddress = null;

  beforeAll(async () => {
    // Create a wallet for testing
    // use an existing wallet as sender with a balance > 0 
    privateKey = '0x7e923022b44118dfb987cdfe35eb14b1709db84decab469d4d8b24df1b7f5116';
    publicKey = '0xB9b6269eE1E98A03a8887ed00B03C6B36E23Cd74';
    toAddress = '0x74e03B42B3dbfa6B0c8B60a960984b92e7AAa2E1';
    amount = '0.00001';
  });

  it('should send a transaction and return a hash', async () => {
    // Send a transaction
    const network = 'binanceSmartChain';
    const networkType = 'testnet';
    const txHash = await sendBEP20ERC20Transaction(network, networkType, privateKey, publicKey, toAddress, amount,tokenAddress);
    // Verify that the transaction was successful
    const balance = await getBalance(network, networkType, toAddress);

    expect(Number(balance)).toBeGreaterThan(0);
    expect(txHash).toMatch(/^0x([A-Fa-f0-9]{64})$/);
  });
});
 