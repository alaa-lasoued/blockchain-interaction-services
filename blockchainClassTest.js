const Blockchain = require('./blockchain')

async function createWallet() {
    try {
        const blockchainInstance = new Blockchain()
        const key = await blockchainInstance.createWallet('bitcoin', 'testnet','123456');
        console.log(key)
        const txhash = await blockchainInstance.sendTransaction('bitcoin','testnet','236ac24d0c05b7fcbdd9f3e01b6f98b57fa7dc0c21376c6de884041134bff7d1','n44wLeYhNT8DFXiWMjph6hPRZWnxYUC4SJ','mhwEQ8dYopvdaBvkJFLs4ZjLC3rtTzt358',100)
        console.log(txhash)
        const walletBalance = await blockchainInstance.getBalance('binanceSmartChain', 'testnet','0x74e03B42B3dbfa6B0c8B60a960984b92e7AAa2E1');
        console.log(walletBalance)
    }catch(e) {
         throw e
    }

}

createWallet()