// const backendURL = 'http://localhost:5097'
const backendURL = 'https://api.rediflow.co'

export const config = {
  supportedNetworks: {
    1: 'Ethereum Mainnet',
    5: 'Goerli Testnet',
    137: 'Polygon Mainnet',
    80001: 'Polygon Mumbai',
  },
  backendURL: backendURL,
  backendLogInURL: `${backendURL}/metamask-signin`,
  backendAPIURL: `${backendURL}/api`,
  // backendSRAHttpURLRoot: `${backendURL}/sra/`,
  backendLogInExtendURL: `${backendURL}/api/metamask-refresh`,
  backendLogInMessage: 'I agree with the terms and conditions. Please sign me in.',
  localStorageKey: {
    login: 'userJWT',
  },
  cacheTime: {
    network: 1 * 60 * 1000, // miliseconds
    account: 1 * 60 * 1000,
  },
  defaultRedirect: {
    logout: 'Logout',
    login: 'Login',
    publicHome: 'PublicHome',
    appHome: 'AppHome',
    WalletNotConnected: 'Logout',
    chainChange: 'Logout',
    accountChange: 'Logout',
  },
  api: {
    livepeer: {
      url: 'https://api.thegraph.com/subgraphs/name/livepeer/livepeer-canary',
    },
  },
  superfluid: {
    tokenAccepted: {
      1: [ 'USDCx', 'DAIx' ],
      5: [ 'fDAIx', 'fUSDCx', 'fTUSD' ],
      137: [ 'USDCx', 'DAIx' ],
      80001: [ 'fUSDCx', 'fTUSDx', 'fDAIx' ],
    }
  },
  network: {
    1: {
      id: 1,
      name: 'Main Ethereum Network',
      txURL: 'https://etherscan.io/tx/',
      accountURL: 'https://etherscan.io/address/',
      tokenURL: 'https://etherscan.io/token/',
      etherscanApiURL: 'https://api.etherscan.io/',
      superfluidSubgrahApiURL: 'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-mainnet',
    },
    5: {
      id: 5,
      name: 'Goerli Testnet',
      txURL: 'https://goerli.etherscan.io/tx/',
      accountURL: 'https://goerli.etherscan.io/address/',
      tokenURL: 'https://goerli.etherscan.io/token/',
      etherscanApiURL: 'https://api-goerli.etherscan.io/',
      superfluidSubgrahApiURL: 'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-goerli',
    },
    137: {
      id: 137,
      name: 'Polygon Mainnet',
      txURL: 'https://polygonscan.com/tx/',
      accountURL: 'https://polygonscan.com/address/',
      tokenURL: 'https://polygonscan.com/token/',
      superfluidSubgrahApiURL: 'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-matic',
      // etherscanApiURL: 'https://api-kovan.etherscan.io/',
    },
    80001: {
      id: 80001,
      name: 'Polygon Mumbai',
      txURL: 'https://mumbai.polygonscan.com/tx/',
      accountURL: 'https://mumbai.polygonscan.com/address/',
      tokenURL: 'https://mumbai.polygonscan.com/token/',
      // etherscanApiURL: 'https://api-kovan.etherscan.io/',
      superfluidSubgrahApiURL: 'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-mumbai',
    },    
  },
}
