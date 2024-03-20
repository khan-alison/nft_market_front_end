import { useMemo } from 'react';
import { UnsupportedChainIdError, useWeb3React } from '@web3-react/core';
import { injected, walletConnect } from 'connectors';

export const useConnectWallet = () => {
  const { activate } = useWeb3React();

  const connect = useMemo(() => {
    return {
      connectInjected(metamaskNotFound?: any, callbackSuccess?: any, callbackError?: any): void {
        injected.isAuthorized().then(async (isAuthorized: boolean) => {
          callbackSuccess && callbackSuccess();
          await activate(injected, undefined, true).catch((error) => {
            callbackError && callbackError();
          });
        });
      },

      connectWalletConnect(callback?: { failed: (err: any) => void }): void {
        walletConnect.walletConnectProvider = undefined;

        walletConnect &&
          activate(walletConnect, undefined, true).catch(async (error) => {
            console.log('error connect wallet', error);
            if (error instanceof UnsupportedChainIdError) {
              await activate(walletConnect, undefined, true).catch((error) => console.log(error, 'error'));
              callback && callback.failed(error);
            }
          });
      },
    };
  }, []);

  return connect;
};
