const Web3 = require('web3');
const blockchainInfo = require('blockchain.info');

const { networks } = require('../../config');
const { abi } = require('../../ABI');

module.exports.getBalance = async (blockchain, networkType, publicKey, tokenAddress) => {
  if (!networks[blockchain]) {
    throw new Error(`Blockchain ${blockchain} not supported`);
  }

  if (blockchain === 'ethereum' || blockchain === 'binanceSmartChain') {
    const providerUrl = networks[blockchain][networkType];
    const web3 = new Web3(providerUrl);

    if (!tokenAddress) {
      const balance = await web3.eth.getBalance(publicKey);
      return Number(web3.utils.fromWei(balance, 'ether'));
    } else {
      const contract = new web3.eth.Contract(abi, tokenAddress);
      const balance = await contract.methods.balanceOf(publicKey).call();
      return Number(web3.utils.fromWei(balance, 'ether'));
    }
  }

  if (blockchain === 'bitcoin') {
    const client = new blockchainInfo.MyWallet(networkType === 'testnet');
    const balance = await client.getBalance(publicKey);
    return Number(balance / 1e8);
  }
}
