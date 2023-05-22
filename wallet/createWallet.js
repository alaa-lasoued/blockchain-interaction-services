
const Web3 = require('web3');
const bip39 = require('bip39');
const bitcoin = require('bitcoinjs-lib');

// create a new Bitcoin wallet and return the private key and public key
module.exports.createBitcoinWallet = (network) => {
  try {
    // Define the Bitcoin network and network URL based on the specified network
    let bitcoinNetwork, networkUrl;
    switch (network) {
    case 'mainnet':
      bitcoinNetwork = bitcoin.networks.bitcoin;
      networkUrl = 'https://blockstream.info/api';
      break;
    case 'testnet':
      bitcoinNetwork = bitcoin.networks.testnet;
      networkUrl = 'https://blockstream.info/testnet/api';
      break;
    default:
      throw new Error(`Unsupported Bitcoin network: ${network}`);
    }

    // Generate a new 12-word mnemonic phrase for the wallet
    const mnemonic = bip39.generateMnemonic();

    // Derive the seed from the mnemonic phrase
    const seed = bip39.mnemonicToSeedSync(mnemonic);

    // Derive the Bitcoin address and private key from the seed
    const node = bitcoin.bip32.fromSeed(seed, bitcoinNetwork);
    const { address, privateKey, publicKey } = bitcoin.payments.p2pkh({
      pubkey: node.publicKey,
      network: bitcoinNetwork,
    });

    return { privateKey: privateKey.toString('hex'), publicKey: publicKey.toString('hex') };
  } catch (err) {
    console.error(err);
  }
};

// create a new wallet on a specified blockchain network, and return the private and public key
module.exports.createEthBscWallet = async (blockchain, network) => {
  try {
    // Define the network URL and chain ID for the specified blockchain and network
    let networkUrl, chainId;
    switch (blockchain) {
    case 'ethereum':
      switch (network) {
      case 'mainnet':
        networkUrl = 'https://mainnet.infura.io/v3/your-project-id';
        chainId = 1;
        break;
      case 'ropsten':
        networkUrl = 'https://ropsten.infura.io/v3/your-project-id';
        chainId = 3;
        break;
      case 'rinkeby':
        networkUrl = 'https://rinkeby.infura.io/v3/your-project-id';
        chainId = 4;
        break;
      case 'goerli':
        networkUrl = 'https://goerli.infura.io/v3/your-project-id';
        chainId = 5;
        break;
      default:
        throw new Error(`Unsupported Ethereum network: ${network}`);
      }
      break;
    case 'binanceSmartChain':
      switch (network) {
      case 'mainnet':
        networkUrl = 'https://bsc-dataseed1.binance.org:443';
        chainId = 56;
        break;
      case 'testnet':
        networkUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545';
        chainId = 97;
        break;
      default:
        throw new Error(`Unsupported Binance Smart Chain network: ${network}`);
      }
      break;
    case 'bitcoin': {
      // Generate a new wallet on to the Bitcoin network
      const Keys = createBitcoinWallet();
      return Keys;
    }
    default:
      throw new Error(`Unsupported blockchain: ${blockchain}`);
    }

    // Connect to the specified blockchain network
    const web3 = new Web3(networkUrl);

    // Generate a new wallet
    const newWallet = web3.eth.accounts.create();
    const privateKey = newWallet.privateKey;
    const publicKey = newWallet.address;
    return { privateKey, publicKey };
  } catch (err) {
    console.error(err);
  }
};

