
const Web3 = require('web3');
const { networks } = require('../../config');
const bitcore = require('bitcore-lib');

function createBitcoinWallet(network) {
  let _network = network === 'livenet' ? 'mainnet' : network;
  const privateKey = new bitcore.PrivateKey(_network);
  const publicKey = privateKey.toPublicKey();
  const address = publicKey.toAddress(network);

  return {
    privateKey: privateKey.toString(),
    publicKey: address.toString(),
  };
}

// create a new wallet on a specified blockchain network, and return the private and public key
module.exports.createWallet = async (blockchain, network) => {
  try {
    // handle missing or invalid function arguments
    if (!blockchain || !networks[blockchain]) {
      let errorMessage = "Blockchain is invalid it should be ";
      const chains = Object.keys(networks);
      chains.forEach(key => { chains[chains.length - 1] === key ? errorMessage += key : errorMessage += key + " || " });
      throw new Error(errorMessage);
    }

    if (!network || !networks[blockchain][network]) throw new Error("Network is invalid");

    // Define the network URL and chain ID for the specified blockchain and network
    let networkUrl, chainId;
    switch (blockchain) {
      case 'ethereum':
        switch (network) {
          // refactoring : get networkUrl from config file
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
        const Keys = createBitcoinWallet(network);
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

