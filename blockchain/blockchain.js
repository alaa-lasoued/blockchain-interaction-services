const { createWallet } = require('../wallet/createWallet');
const { sendTransaction } = require('../transactions/transaction');
const { getBalance } = require('../wallet/getBalance');

class Blockchain {

    async createWallet(blockchain, network, userPassword) {
        const keys = await createWallet(blockchain, network);
        // save keys in the database after crypting them with user password
        // or return them to user 
        return keys;
    };

    async sendTransaction(blockchain, networkType, privateKey, fromAddress, toAddress, amount, tokenAddress) {
        // tokenAddress not needed for sending BTC transaction
        const transactionHash = await sendTransaction(blockchain, networkType, privateKey, fromAddress, toAddress, amount, tokenAddress);
        return transactionHash;
    };

    async getBalance(network, networkType, publicKey, tokenAddress) {
        // tokenAddress not needed for fetching BTC balance and native tokens like BNB and ETH
      const balance = await getBalance(network, networkType, publicKey, tokenAddress);
      return balance;
    }
}

module.exports = Blockchain;