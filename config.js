const networks = {
  ethereum: {
    token:'ETH',
    mainnet: 'https://mainnet.infura.io/v3/your-infura-api-key',
    rinkeby: 'https://rinkeby.infura.io/v3/your-infura-api-key',
    ropsten: 'https://ropsten.infura.io/v3/your-infura-api-key',
  },
  binanceSmartChain: {
    token:'BNB',
    mainnet: 'https://bsc-dataseed.binance.org/',
    testnet: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    ropsten: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  },
  bitcoin: {
    token:'BTC',
    mainnet: 'https://blockchain.info/',
    testnet: 'https://testnet.blockchain.info/',
  },
};

module.exports = { networks };
