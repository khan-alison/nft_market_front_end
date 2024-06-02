import { FC, ReactNode, useEffect, useRef } from 'react';
import { useWeb3React } from '@web3-react/core';
import noop from 'lodash/noop';

import showMessage from '../Message';
import ModalWrongNetwork from '../Modal/ModalWrongNetwork';
import ModalLogin from '../Modal/ModalLogin';
import ModalKyc from '../Modal/ModalKyc';

import selectedAddress from 'redux/address/selector';
import selectedConnection from 'redux/connection/selector';
import selectAuthentication from 'redux/authentication/selector';
import selectedKyc from 'redux/kyc/selector';
import { handleSetAuthenticationToken } from 'redux/authentication/slice';
import { handleSetLoadingMetamask, handleSetWrongNetwork, handleSetConnected } from 'redux/connection/slice';
import { handleAddAddressNetWork, handleSetAddressNetwork, handleSetConnectedWalletType } from 'redux/address/slice';
import { handleSetCancelkyc, handleAddKyc } from 'redux/kyc/slice';

import loginServices from 'services/login';
import MetamaskService from 'services/MetamaskService';
import { checkSuccessRequest, getToken } from 'services/api';

import { walletConnect, injected } from 'connectors';
import { METAMASK, SUPPORTED_CHAIN_IDS, WALLET_CONNECT } from 'connectors/constants';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useConnectWallet } from 'hooks/useConnectWallet';

import { setupNetwork } from 'utils/wallet';
import TYPE_CONSTANTS from 'constants/type';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { KEY_STORAGE, TYPE_LOGIN } from 'constants/common';
import { useQueryClient } from 'react-query';
import { get } from 'lodash';
import { KYCStatus } from 'constants/my-account';
import { useSessionStorage } from 'hooks/useSessionStorage ';
import selectedPage from 'redux/page/selector';
import { shortenAddress } from 'utils';

declare let window: any;

const AppConnectWalletWrapper: FC<{
  children?: ReactNode;
}> = ({ children }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { chainId, account, active, library, deactivate } = useWeb3React();
  const { addressReferrer } = router.query;
  const referrer = addressReferrer
    ? addressReferrer
    : typeof window !== 'undefined'
    ? sessionStorage.getItem('referrer')
    : '';
  const { connectInjected, connectWalletConnect } = useConnectWallet();
  const debounceRef: any = useRef(null);
  const { listAddress, connectedWalletType, address } = useAppSelector(selectedAddress.getAddress);
  const { authenticationToken } = useAppSelector(selectAuthentication.getAuthenticationToken);
  const { isConnectingWallet } = useAppSelector(selectedConnection.getConnection);
  const { cancelKyc, listKyc } = useAppSelector(selectedKyc.getKyc);
  const { profile } = useAppSelector(selectedPage.getPage);

  useEffect(() => {
    if (address && connectedWalletType && !active) {
      if (connectedWalletType === METAMASK) {
        connectInjected();
        // dispatch(handleSetLoadingMetamask(true));
        dispatch(handleSetConnectedWalletType(METAMASK));
      }

      if (connectedWalletType === WALLET_CONNECT) {
        connectWalletConnect();
        dispatch(handleSetConnectedWalletType(WALLET_CONNECT));
      }
    }
  }, [address, connectedWalletType, active, router.query]);

  useEffect(() => {
    const setUpAddress = async () => {
      if (account) {
        const wallet = new MetamaskService().getInstance();
        // check is admin
        const isAdmin = await handleCheckIsAdmin(wallet);

        if (!isAdmin) {
          setupNetwork(chainId, library);
          if (!listAddress?.[account]) {
            handleLoginForFirstTime(wallet);
          } else {
            handleLoginWithExistedAccount(account);
          }
        }
      }
    };

    if (account && isConnectingWallet) {
      setUpAddress();
      console.log('thu 2');
    }
  }, [account, isConnectingWallet]);

  useEffect(() => {
    walletConnect.on('Web3ReactDeactivate', () => {
      handleDisconnect();
    });

    injected.on('Web3ReactDeactivate', () => {
      handleDisconnect();
    });

    injected.on('Web3ReactUpdate', (data: any) => {
      if (data?.account) {
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          dispatch(handleSetLoadingMetamask(true));
        }, 300);
      }
    });

    return () => {
      walletConnect.removeListener('Web3ReactDeactivate', noop);
      injected.removeListener('Web3ReactDeactivate', noop);
    };
  }, [active, account]);

  useEffect(() => {
    const isWrongNetwork = authenticationToken && chainId && !SUPPORTED_CHAIN_IDS.includes(chainId);
    dispatch(handleSetWrongNetwork(isWrongNetwork));
  }, [chainId, authenticationToken]);

  useEffect(() => {
    if (address && account) {
      dispatch(handleSetConnected(true));
    } else {
      dispatch(handleSetConnected(false));
    }
  }, [address, account]);

  const handleLoginForFirstTime = async (wallet: MetamaskService) => {
    const signature = (await wallet.verifyLoginSignature({
      creator: account as string,
      library,
      cancelMetamask: () => {
        handleDisconnect();
        handleCancelLoadingMetamask();
      },
    })) as string;

    if (signature) {
      handleLogin({
        address: account as string,
        signature,
        referrer: referrer as string,
        success: () => {
          dispatch(
            handleAddAddressNetWork({
              address: account,
              signature,
            }),
          );
          dispatch(
            handleSetAddressNetwork({
              chainId,
              address: account,
            }),
          );
        },
        fail: (statusCode?: string, message?: string) =>
          handleLoginFailed(statusCode as string, { referrer: shortenAddress(message as string) }),
      });
    }
  };

  const handleLoginWithExistedAccount = async (account: string) => {
    handleLogin({
      address: account as string,
      signature: listAddress?.[account]?.signature as string,
      referrer: referrer as string,
      success: () => {
        dispatch(
          handleSetAddressNetwork({
            chainId,
            address: account,
          }),
        );
      },
      fail: (statusCode?: string, message?: string) =>
        handleLoginFailed(statusCode as string, { referrer: shortenAddress(message as string) }),
    });
  };

  const handleLogin = async ({
    address,
    signature,
    referrer,
    success,
    fail,
  }: {
    address: string;
    signature: string;
    referrer?: string;
    success: () => void;
    fail: (statusCode?: string, message?: string) => void;
  }) => {
    const data = {
      address,
      signature,
      referrer,
      type: TYPE_LOGIN.USER,
    };
    try {
      const response = await loginServices.handleLogin(data);

      if (checkSuccessRequest(response)) {
        const token = response?.data?.token;
        getToken(token);
        Cookies.set(KEY_STORAGE.TOKEN, token, { sameSite: 'strict' });
        dispatch(handleSetAuthenticationToken(token));
        success();
      } else {
        fail(response?.data?.code, response?.data?.message);
      }
    } catch (error) {
    } finally {
      handleCancelLoadingMetamask();
    }
  };

  const handleCancelLoadingMetamask = () => {
    setTimeout(() => {
      dispatch(handleSetLoadingMetamask(false));
    }, 500);
  };

  const handleDisconnect = () => {
    getToken('');
    deactivate();
    Cookies.remove(KEY_STORAGE.TOKEN);
    dispatch(handleSetAddressNetwork({}));
    dispatch(handleSetAuthenticationToken(''));
    localStorage.removeItem(WALLET_CONNECT);
    localStorage.removeItem(METAMASK);
  };

  const handleLoginFailed = (statusCode: string, param: object) => {
    handleDisconnect();
    showMessage(TYPE_CONSTANTS.MESSAGE.ERROR, `message.${statusCode}`, param);
  };

  const handleCheckIsAdmin = async (wallet: MetamaskService) => {
    const isAdmin = await wallet.isAdmin(library, account as string);
    if (isAdmin) {
      handleCancelLoadingMetamask();
      handleLoginFailed('E4', { name: 'common.txt_system_admin' });
    }
    return isAdmin;
  };

  const statusKYC = get(profile, 'kycInfo.kycStatus');
  const chekStatusKYC = KYCStatus.UNVERIFIED === statusKYC || KYCStatus.REJECTED === statusKYC;

  return (
    <>
      {children}
      {/* <ModalWrongNetwork /> */}
      <ModalLogin />
      {/* {chekStatusKYC && authenticationToken && cancelKyc === false && !listKyc?.[address]?.showPopupKycAgain && (
        <ModalKyc />
      )} */}
    </>
  );
};

export default AppConnectWalletWrapper;
