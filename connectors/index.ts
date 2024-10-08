import { UnsupportedChainIdError } from '@web3-react/core';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector';
import {
  WalletConnectConnector,
  UserRejectedRequestError as UserRejectedRequestErrorWalletConnect,
} from '@web3-react/walletconnect-connector';
import {
  InjectedConnector,
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector';
import { BscConnector } from '@binance-chain/bsc-connector';

import showMessage from 'components/Message';

import {
  BRIDGE_WALLET_CONNECT_URL,
  LIST_POLYGON_TESTNET,
  LIST_NETWORK_RPC_TESTNET,
  METAMASK_DEEPLINK,
  SupportedChainId,
  LIST_CVC_TESTNET,
} from './constants';
import TYPE_CONSTANTS from 'constants/type';

export const bscConnector = new BscConnector({}) as any;
export const injected = new InjectedConnector({});

const originalChainIdChangeHandler = bscConnector.handleChainChanged;

bscConnector.handleChainChanged = (chainId: string) => {
  const chainIdNum = Number(chainId);
  console.debug("Handling 'chainChanged' event with payload", chainId, isNaN(chainIdNum));
  if (isNaN(chainIdNum)) {
    bscConnector.emitError('NaN ChainId');
    return;
  }
  originalChainIdChangeHandler(chainId);
};

export const walletConnect = new WalletConnectConnector({
  rpc: LIST_NETWORK_RPC_TESTNET,
  bridge: BRIDGE_WALLET_CONNECT_URL,
  qrcode: true,
});

export function getErrorConnectMessage(error: Error, deactivate: any, metamaskNotFound?: any) {
  if (error instanceof NoEthereumProviderError) {
    return metamaskNotFound && metamaskNotFound();
  } else if (error instanceof UnsupportedChainIdError) {
    return;
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return;
  } else {
    console.error(error);
    return showMessage(TYPE_CONSTANTS.MESSAGE.ERROR, 'An unknown error occurred. Check the console for more details.');
  }
}

export interface WalletInfo {
  connector?: AbstractConnector;
  name: string;
  description: string;
  href: string | null;
  primary?: true;
  mobile?: true;
  mobileOnly?: true;
  disableIcon: string;
  icon: string;
  deepLink?: string;
}

export enum ConnectorNames {
  MetaMask = 'MetaMask',
  POLYGON = 'POLYGON Wallet',
  WalletConnect = 'WalletConnect',
}

export type connectorNames = Extract<
  ConnectorNames,
  ConnectorNames.MetaMask | ConnectorNames.POLYGON | ConnectorNames.WalletConnect
>;

export const SUPPORTED_WALLETS: { [key: string]: WalletInfo } = {
  METAMASK: {
    connector: injected,
    name: ConnectorNames.MetaMask,
    icon: '/images/metamask.svg',
    disableIcon: '/images/metamask-disabled.svg',
    description: 'Easy-to-use browser extension.',
    href: null,
    mobile: true,
    deepLink: METAMASK_DEEPLINK,
  },
  WALLET_CONNECT: {
    connector: walletConnect,
    name: ConnectorNames.WalletConnect,
    icon: '/images/WalletConnect.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    disableIcon: '/images/wallet-connect-disabled.svg',
    href: null,
    mobile: true,
  },
  BSC_WALLET: {
    connector: bscConnector,
    name: ConnectorNames.POLYGON,
    icon: '/images/injected-binance.svg',
    description: 'Connect to Trust Wallet, Rainbow Wallet and more...',
    disableIcon: '/images/injected-binance-disabled.svg',
    href: null,
  },
  HOLESKY_TESTNET: {
    connector: injected, // Or any other appropriate connector
    name: 'Holesky Testnet',
    icon: '/path/to/holesky-icon.svg', // Replace with the actual icon path
    disableIcon: '/path/to/holesky-disabled-icon.svg', // Replace with the actual disabled icon path
    description: 'Connect to the Holesky Testnet',
    href: null,
    mobile: true, // Adjust based on your requirements
  },
};

export const connectorsByName: any = {
  [ConnectorNames.POLYGON]: bscConnector,
  [ConnectorNames.WalletConnect]: walletConnect,
};

export const NETWORK_URLS = {
  [SupportedChainId.CVC_TESTNET]: LIST_CVC_TESTNET[0],
  [SupportedChainId.HOLESKY_TESTNET]: LIST_NETWORK_RPC_TESTNET[SupportedChainId.HOLESKY_TESTNET],
};
