const Blockchain = require('./blockchain/blockchain')

async function createWallet() {
    const blockchainInstance = new Blockchain()
    const key = await blockchainInstance.createWallet('binanceSmartChain', 'testnet');
    console.log(key)
    const walletBalance = await blockchainInstance.getBalance('binanceSmartChain', 'testnet','0x74e03B42B3dbfa6B0c8B60a960984b92e7AAa2E1');
    console.log(walletBalance)
}

createWallet()