const { createWallet } = require('./modules/wallet/wallet.service');
const { sendTransaction } = require('./modules/transactions/transaction.service');
const { getBalance } = require('./modules/wallet/walletBalance.service');
const { encryptData } = require('./tools/encryption');

class Blockchain {
    constructor() {

    }
    async createWallet(blockchain, network, userPassword, walletType = 'decentralized') {
        const keys = await createWallet(blockchain, network);

        const cryptedPrivateKey = await encryptData(keys.privateKey, userPassword);
        
        if (walletType === 'decentralized') {
            // return keys to user after encryption
            return { cryptedPrivateKey, publicKey: keys.publicKey };
        } else if (walletType === 'centralized') {
            // save keys in the database after encryption
        }
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