const networks = {
  ethereum: {
    token:'ETH',
    mainnet: 'https://mainnet.infura.io/v3/fcdbc520aa5db90d36182609ab03816b3322881',
    rinkeby: 'https://rinkeby.infura.io/v3/fcdbc520aa5db90d36182609ab03816b3322881',
    ropsten: 'https://ropsten.infura.io/v3/fcdbc520aa5db90d36182609ab03816b3322881',
  },
  binanceSmartChain: {
    token:'BNB',
    mainnet: 'https://bsc-dataseed.binance.org/',
    testnet: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    ropsten: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  },
  bitcoin: {
    token:'BTC',
    mainnet: 'mainnet',
    testnet: 'testnet',
  },
};

module.exports = { networks };
