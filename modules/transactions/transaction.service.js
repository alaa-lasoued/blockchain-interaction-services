const Web3 = require('web3');
const bitcoin = require('bitcoinjs-lib');
const blockchainInfo = require('blockchain.info');

const { networks } = require('../../config');
const { abi } = require('../../ABI');

// handle sending BTC 
module.exports.sendBTCTransaction = async (networkType, fromAddress, privateKey, toAddress, amount) => {
  const testnet = networkType === 'testnet';
  const keyPair = bitcoin.ECPair.fromPrivateKey(Buffer.from(privateKey, 'hex'), {
    networkType: testnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin,
  });
  const amountSat = Math.round(amount * 1e8);
  const unspentTxs = await blockchainInfo.blockexplorer.getUnspentOutputs(fromAddress, { testnet });
  const txb = new bitcoin.TransactionBuilder(testnet ? bitcoin.networks.testnet : bitcoin.networks.bitcoin);

  let totalValue = 0;
  for (const tx of unspentTxs) {
    txb.addInput(tx.txid, tx.vout);
    totalValue += tx.value;
    if (totalValue >= amountSat) {
      break;
    }
  }

  if (totalValue < amountSat)  throw new Error('Insufficient funds');
  
  txb.addOutput(toAddress, amountSat);
  const change = totalValue - amountSat;

  if (change > 0) txb.addOutput(fromAddress, change);

  for (let i = 0; i < unspentTxs.length; i++) {
    txb.sign({
      prevOutScriptType: bitcoin.scriptTypes.P2PKH,
      vin: i,
      keyPair,
    });
  }

  const txHex = txb.build().toHex();
  const txHash = await blockchainInfo.pushtx(txHex, { testnet });

  return txHash;
}

// handle sending ETH / BNB 
module.exports.sendBEP20ERC20Transaction = async (blockchain, networkType, privateKey, fromAddress, toAddress, amount, tokenAddress) => {
  if (!networks[blockchain]) {
    throw new Error(`Network ${blockchain} not supported`);
  }

  const providerUrl = networks[blockchain][networkType];
  const web3 = new Web3(providerUrl);
  web3.eth.accounts.privateKeyToAccount(privateKey);

  // Get gas price and limit
  const gasPrice = await web3.eth.getGasPrice();
  const gasLimit = 21000;

  let txObject;
  if (!tokenAddress) {
    // ETH transfer
    const nonce = await web3.eth.getTransactionCount(fromAddress, 'pending');

    txObject = {
      nonce: web3.utils.toHex(nonce),
      to: toAddress,
      value: web3.utils.toHex(web3.utils.toWei(amount, 'ether')),
      gasLimit: web3.utils.toHex(gasLimit),
      gasPrice: web3.utils.toHex(gasPrice),
    };
  } else {
    // ERC20 or BEP20 token transfer
    const tokenContract = new web3.eth.Contract(abi, tokenAddress);
    const decimals = await tokenContract.methods.decimals().call();

    const amountInWei = web3.utils.toBN(amount).mul(web3.utils.toBN(10).pow(web3.utils.toBN(decimals)));
    const data = tokenContract.methods.transfer(toAddress, amountInWei.toString()).encodeABI();

    const nonce = await web3.eth.getTransactionCount(fromAddress, 'pending');

    txObject = {
      nonce: web3.utils.toHex(nonce),
      to: tokenAddress,
      value: '0x00',
      gasLimit,
      gasPrice,
      data,
    };
  }

  // Sign the transaction
  const signedTx = await web3.eth.accounts.signTransaction(txObject, privateKey);

  // Broadcast the transaction to the network
  const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
  return txReceipt.transactionHash;
}

module.exports.sendTransaction = async (blockchain, networkType, privateKey, fromAddress, toAddress, amount, tokenAddress) => {
  if(blockchain === 'bitcoin') this.sendBTCTransaction(networkType, privateKey, fromAddress, toAddress, amount);
  else this.sendBEP20ERC20Transaction(blockchain, networkType, privateKey, fromAddress, toAddress, amount, tokenAddress);
}