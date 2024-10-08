import BSCLogo from 'public/svg/binance_logo.svg';
import PolygonLogo from 'public/svg/polygon_logo.svg';
import EthereumLogo from 'public/svg/ethereum_logo.svg';

import connector from 'utils/connector';

export const DEFAULT_RPC721 = "0xdFe59eFc8543fb79f5699600c6687bd4bca7468C" ;
export const PAYMENT_TOKEN = "0x6d8AC4b62F8DF7e7E51dd4A09b413c6ED8bD75dc" ;

export const STATUS_NFT = {
  MINTED: 'MINTED',
  OFF_SALE: 'OFF-SALE',
  ON_SALE:"ON-SALE",
  SOLD_OUT: 'SOLD-OUT',
  UNMINT: 'UNMINT'
}
export enum SupportedChainId {
  BSC = 97,
  BSC_MAINNET = 56,
  ETH = 4,
  ETH_MAINNET = 1,
  POLYGON = 80001,
  POLYGON_MAINNET = 137,
  CVC_TESTNET =5555,
  HOLESKY_TESTNET=17000
}
export const SUPPORTED_CHAIN_IDS: SupportedChainId[] = [SupportedChainId.CVC_TESTNET, SupportedChainId.HOLESKY_TESTNET];

export const LIST_POLYGON_TESTNET = [
  // 'https://rpc-mumbai.maticvigil.com',
  // 'https://polygontestapi.terminet.io/rpc',
  // 'https://polygon-testnet.public.blastapi.io',
  // 'https://rpc.ankr.com/polygon_mumbai',
  // 'https://matic-mumbai.chainstacklabs.com',
];

export const LIST_CVC_TESTNET = [
  'https://rpc-kura.cross.technology/'
]

export const LIST_NETWORK_RPC_MAINNET: any = {
  [SupportedChainId.BSC_MAINNET]: 'https://bsc-dataseed.binance.org/',
  [SupportedChainId.POLYGON_MAINNET]: 'https://rpc-mainnet.maticvigil.com/',
  [SupportedChainId.ETH_MAINNET]: 'https://mainnet.infura.io/v3/50f6131e95134c0fba1a009b561a31d9',
};

export const LIST_NETWORK_RPC_TESTNET: any = {
  [SupportedChainId.BSC]: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
  [SupportedChainId.CVC_TESTNET]: connector.randomRPCTestnet(LIST_CVC_TESTNET),
  [SupportedChainId.ETH]: 'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  [SupportedChainId.HOLESKY_TESTNET]: 'https://ethereum-holesky.publicnode.com',
};

export const BRIDGE_WALLET_CONNECT_URL = 'https://pancakeswap.bridge.walletconnect.org';
export const METAMASK_DEEPLINK = 'https://metamask.io/download';
export const NETWORK_URL_POLYGON = 'https://rpc-mainnet.maticvigil.com/';

export const METAMASK = 'metamask';
export const WALLET_CONNECT = 'walletconnect';

export const CONTRACT_ERC20_ADDRESS = '0x9b7ba0Ff2A0998d3E9c49359EF7BF7648CF78283';

export const MAX_ALLOWANCE = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

export const WALLET_TYPES = {
  METAMASK: 'metamask',
  WALLET_CONNECT: 'wallet connect',
};

export const BSCMainnetChainId = '0x38';
export const BSCMainnetChainIdDec = 56;
export const BSCTestnetChainId = '0x61';
export const BSCTestnetChainIdDec = 97;

export const EtherMainnetChainIdDec = 1;
export const EtherTestnetChainId = '0x4';
export const EtherTestnetChainIdDec = 4;

export const PolygonMainnetChainIdDec = 137;
export const PolygonTestnetChainId = '0x13881';
export const PolygonTestnetChainIdDec = 80001;

export const CHAIN_INFO = {
  BSC: {
    name: 'Binance Smart Chain',
    value: BSCMainnetChainIdDec,
    valueString: BSCMainnetChainIdDec.toString(),
    icon: BSCLogo,
    textWarning: 'Binance Smart Chain - Mainnet',
    url: 'https://bscscan.com',
    suffixToken: 'BEP-20',
    explorerName: 'BSCscan',
    suffixKey: '',
  },
  BSC_TESTNET: {
    name: 'Binance Smart Chain Testnet',
    value: BSCTestnetChainIdDec,
    valueString: BSCTestnetChainIdDec.toString(),
    icon: BSCLogo,
    textWarning: 'Binance Smart Chain - Testnet',
    url: 'https://testnet.bscscan.com',
    suffixToken: 'BEP-20',
    explorerName: 'BSCscan',
    suffixKey: '',
  },
  ETHER: {
    name: 'Ethereum',
    value: EtherMainnetChainIdDec,
    valueString: EtherMainnetChainIdDec.toString(),
    icon: EthereumLogo,
    textWarning: 'Ethereum - Mainnet',
    url: 'https://etherscan.io',
    suffixToken: 'ERC-20',
    explorerName: 'Etherscan',
    suffixKey: '_ETH',
  },
  ETHER_TESTNET: {
    name: 'Ethereum Testnet (Rinkeby)',
    value: EtherTestnetChainIdDec,
    valueString: EtherTestnetChainIdDec.toString(),
    icon: EthereumLogo,
    textWarning: 'Ethereum (Rinkeby) - Testnet',
    url: 'https://rinkeby.etherscan.io',
    suffixToken: 'ERC-20',
    explorerName: 'Etherscan',
    suffixKey: '_ETH',
  },
  POLYGON: {
    name: 'Polygon',
    value: PolygonMainnetChainIdDec,
    valueString: PolygonMainnetChainIdDec.toString(),
    icon: PolygonLogo,
    textWarning: 'Polygon - Mainnet',
    url: 'https://polygonscan.com',
    suffixToken: 'ERC-20',
    explorerName: 'Polygonscan',
    suffixKey: '_POL',
  },
  POLYGON_TESTNET: {
    name: 'Polygon Mumbai Testnet',
    value: PolygonTestnetChainIdDec,
    valueString: PolygonTestnetChainIdDec.toString(),
    icon: PolygonLogo,
    textWarning: 'Polygon Mumbai - Testnet',
    url: 'https://mumbai.polygonscan.com',
    suffixToken: 'ERC-20',
    explorerName: 'Polygonscan',
    suffixKey: '_POL',
  },
  HOLESKY_TESTNET: {
    name: 'Holesky Testnet',
    value: SupportedChainId.HOLESKY_TESTNET,
    valueString: SupportedChainId.HOLESKY_TESTNET.toString(),
    icon: EthereumLogo, // You can import a specific logo for Holesky if available
    textWarning: 'Holesky - Testnet',
    url: 'https://holesky.beaconcha.in',
    suffixToken: 'ERC-20', // Assuming it uses the same token suffix as Ethereum
    explorerName: 'HoleskyExplorer',
    suffixKey: '_HOLESKY',
  },
};

export const ETH_CHAIN_ID = CHAIN_INFO.ETHER.value;
export const BSC_CHAIN_ID = CHAIN_INFO.BSC.value;
export const POLYGON_CHAIN_ID = CHAIN_INFO.POLYGON.value;
export const ETH_CHAIN_ID_TESTNET = CHAIN_INFO.ETHER_TESTNET.value;
export const BSC_CHAIN_ID_TESTNET = CHAIN_INFO.BSC_TESTNET.value;
export const POLYGON_CHAIN_ID_TESTNET = CHAIN_INFO.POLYGON_TESTNET.value;
export const HOLESKY_CHAIN_ID_TESTNET = CHAIN_INFO.HOLESKY_TESTNET.value

export const APP_NETWORKS_SUPPORT = {
  [ETH_CHAIN_ID]: {
    details: {
      chainId: `0x${(+ETH_CHAIN_ID).toString(16)}`,
      chainName: CHAIN_INFO.ETHER.name,
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [LIST_NETWORK_RPC_MAINNET[ETH_CHAIN_ID]],
      blockExplorerUrls: [CHAIN_INFO.ETHER.url],
    },
  },
  [BSC_CHAIN_ID]: {
    details: {
      chainId: `0x${(+BSC_CHAIN_ID).toString(16)}`,
      chainName: CHAIN_INFO.BSC.name,
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: [LIST_NETWORK_RPC_MAINNET[BSC_CHAIN_ID]],
      blockExplorerUrls: [CHAIN_INFO.BSC.url],
    },
  },
  [POLYGON_CHAIN_ID]: {
    details: {
      chainId: `0x${(+POLYGON_CHAIN_ID).toString(16)}`,
      chainName: CHAIN_INFO.POLYGON.name,
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: [LIST_NETWORK_RPC_MAINNET[POLYGON_CHAIN_ID]],
      blockExplorerUrls: [CHAIN_INFO.POLYGON.url],
    },
  },

  [ETH_CHAIN_ID_TESTNET]: {
    details: {
      chainId: `0x${(+ETH_CHAIN_ID_TESTNET).toString(16)}`,
      chainName: CHAIN_INFO.ETHER_TESTNET.name,
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [LIST_NETWORK_RPC_TESTNET[ETH_CHAIN_ID_TESTNET]],
      blockExplorerUrls: [CHAIN_INFO.ETHER_TESTNET.url],
    },
  },
  [BSC_CHAIN_ID_TESTNET]: {
    details: {
      chainId: `0x${(+BSC_CHAIN_ID_TESTNET).toString(16)}`,
      chainName: CHAIN_INFO.BSC_TESTNET.name,
      nativeCurrency: {
        name: 'BNB',
        symbol: 'BNB',
        decimals: 18,
      },
      rpcUrls: [LIST_NETWORK_RPC_TESTNET[BSC_CHAIN_ID_TESTNET]],
      blockExplorerUrls: [CHAIN_INFO.BSC_TESTNET.url],
    },
  },
  [POLYGON_CHAIN_ID_TESTNET]: {
    details: {
      chainId: `0x${(+POLYGON_CHAIN_ID_TESTNET).toString(16)}`,
      chainName: CHAIN_INFO.POLYGON_TESTNET.name,
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18,
      },
      rpcUrls: [LIST_NETWORK_RPC_TESTNET[POLYGON_CHAIN_ID_TESTNET]],
      blockExplorerUrls: [CHAIN_INFO.POLYGON_TESTNET.url],
    },
  },
  [HOLESKY_CHAIN_ID_TESTNET]: {
    details: {
      chainId: `0x${(+SupportedChainId.HOLESKY_TESTNET).toString(16)}`,
      chainName: CHAIN_INFO.HOLESKY_TESTNET.name,
      nativeCurrency: {
        name: 'ETH',
        symbol: 'ETH',
        decimals: 18,
      },
      rpcUrls: [LIST_NETWORK_RPC_TESTNET[SupportedChainId.HOLESKY_TESTNET]],
      blockExplorerUrls: [CHAIN_INFO.HOLESKY_TESTNET.url],
    },
  },
};
