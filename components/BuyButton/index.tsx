import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import debounce from 'lodash/debounce';

import BuyModal from './BuyModal';
import showMessage from '../Message';
import { useCreateTransaction, useUpdateTransaction } from '../pages/nft/hooks';

import selectedAction from 'redux/action/selector';
import selectedAddress from 'redux/address/selector';
import { handleSetConnectModal } from 'redux/connection/slice';
import { handleSetBuyStep, handleSetTransactionHash, handleSetTransactionId } from 'redux/action/slice';

import { useSocket } from 'hooks/useSocket';
import { useGetConfig } from 'hooks/useGetConfig';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';

import MetamaskService from 'services/MetamaskService';
import transactionServices from 'services/transaction';

import TYPE_CONSTANTS from 'constants/type';
import { SOCKET_EVENT } from 'constants/common';
import { BUY_STEPS, BUY_FIELD, NFT_TRANSACTION_TYPE, MIN_VALUE_TOTAL_COPIES, NFT_SALE_ORDER_TYPE } from 'constants/nft';
import selectedConnection from 'redux/connection/selector';

const { MINTED, TRANSFER } = NFT_TRANSACTION_TYPE;
const { PROCESSING, SUCCESSFUL, FAILED, START, CANCEL } = BUY_STEPS;
const { QUANTITY, SALE_ORDER_ID, TYPE: TYPE_BUY_FIELD } = BUY_FIELD;

type BuyButtonProps = {
  children?: ReactNode;
  nft?: any;
  callback?: any;
  onSetSelectedNFT?: any;
  selectedNFT?: any;
  onGetNftDetail?: any;
  isRefreshNFT?: boolean;
  loadingDetailNFT?: boolean;
  visibleButton?: boolean;
};

const BuyButton = ({
  children,
  nft = {},
  callback,
  selectedNFT,
  onSetSelectedNFT,
  onGetNftDetail,
  isRefreshNFT,
  loadingDetailNFT,
  visibleButton,
}: BuyButtonProps) => {
  const { library } = useWeb3React();

  const dispatch = useAppDispatch();
  const wallet = new MetamaskService().getInstance();

  const { currencies } = useGetConfig();
  const { address } = useAppSelector(selectedAddress.getAddress);
  const { buyStep, transactionId } = useAppSelector(selectedAction.getAction);
  const { isConnected } = useAppSelector(selectedConnection.getConnection);

  const { onCreateTransaction } = useCreateTransaction();
  const { onUpdateTransaction } = useUpdateTransaction();

  const [visible, setVisible] = useState(false);
  const [isCompletedBuy, setIsCompleteBuy] = useState(false);
  const [isEnoughBalance, setIsEnoughBalance] = useState(true);
  const [checkBalanceLoading, setCheckBalanceLoading] = useState(false);
  const [isClickBuyButton, setIsClickBuyButton] = useState(false);

  const { saleOrder = {}, token = {} } = nft;
  const { unitPrice, type, currency = {} } = saleOrder;
  const { address: tokenAddress } = token;

  const selectedCurrency = currencies?.find((item: any) => item?.name === currency?.name);

  useEffect(() => {
    if (!visible) {
      setIsEnoughBalance(true);
    }
  }, [visible]);

  useEffect(() => {
    if (START === buyStep) {
      setIsCompleteBuy(false);
    }
  }, [buyStep]);

  useEffect(() => {
    if (isRefreshNFT && nft?._id) {
      if (!nft?.saleOrder && isClickBuyButton) {
        setVisible(false);
        showMessage(TYPE_CONSTANTS.MESSAGE.ERROR, 'message.E19');
        setIsClickBuyButton(false);
      } else {
        onSetSelectedNFT({ ...nft, maxQuantity: nft?.saleOrder?.remain || nft?.remain });
      }
    }
  }, [nft, isRefreshNFT]);

  const handleCheckBuyButton = (nft: any) => () => {
    if (!isConnected) {
      dispatch(handleSetConnectModal(true));
    } else {
      handleToogleBuyModal();
      setIsClickBuyButton(true);
      if (onGetNftDetail && isRefreshNFT && saleOrder?.type === NFT_SALE_ORDER_TYPE.RESELL) {
        onGetNftDetail(nft?._id);
      } else {
        onSetSelectedNFT && onSetSelectedNFT({ ...nft, maxQuantity: nft?.saleOrder?.remain || nft?.remain });
      }
    }
  };

  const handleUpdateBuyStep = (value: number) => dispatch(handleSetBuyStep(value));

  const handleCloseBuyModal = () => handleUpdateBuyStep(START);

  const handleBuyServerError = () => handleUpdateBuyStep(CANCEL);

  const handleBuyContractError = () => handleUpdateBuyStep(FAILED);

  const handleToogleBuyModal = () => setVisible(!visible);

  const handleBuySuccess = () => {
    if (!isCompletedBuy) {
      setIsCompleteBuy(true);
      handleUpdateBuyStep(SUCCESSFUL);
      setIsClickBuyButton(false);
      callback && callback();
    }
  };

  const handleBuyEvent = (data: any) => {
    if (!isCompletedBuy && data?.transactionId === transactionId) {
      dispatch(handleSetTransactionHash(data?.hash));
      handleBuySuccess();
    }
  };

  useSocket({
    event: SOCKET_EVENT.BUY_NFT,
    handleEvent: handleBuyEvent,
    dependences: [transactionId, isCompletedBuy],
  });

  const handleCompleteContractBuyed = (transactionId: string, data: any) => {
    dispatch(handleSetTransactionHash(data?.hash));
    onUpdateTransaction(transactionId, data, {
      onError: handleBuyServerError,
      onSuccess: handleBuySuccess,
    });
  };

  const handleFailedContractBuyed = (transactionId: string, data: any) => {
    onUpdateTransaction(transactionId, data, {
      onError: handleBuyContractError,
      onSuccess: handleBuyContractError,
    });
  };

  const handleUpdateTransactionHash = (transactionId: string, hash: string) => {
    transactionServices.handleUpdateTransactionHash(transactionId, { hash });
  };

  const handleTransactionSuccessfulCreation = async (transactionId: string, data: any) => {
    dispatch(handleSetTransactionId(transactionId));
    await wallet.buyNFT({
      account: address,
      library,
      data,
      isSecondary: type !== NFT_SALE_ORDER_TYPE.SELL,
      onUpdateTransactionHash: (hash: string) => handleUpdateTransactionHash(transactionId, hash),
      onCallback: (data: any) => handleCompleteContractBuyed(transactionId, data),
      onCancelMetamask: handleCloseBuyModal,
      onServerError: handleBuyServerError,
      onContractError: (data: any) => handleFailedContractBuyed(transactionId, data),
    });
  };

  const handleProceedBuy = debounce(async (values: any) => {
    setCheckBalanceLoading(true);

    const isEnoughBalance = await wallet.checkBuyerBalance({
      library,
      address,
      tokenAddress,
      price: unitPrice,
      quantity: values?.quantity ? parseInt(values?.quantity) : MIN_VALUE_TOTAL_COPIES,
    });

    setCheckBalanceLoading(false);

    setIsEnoughBalance(isEnoughBalance);
    if (isEnoughBalance) {
      handleUpdateBuyStep(PROCESSING);
      handleToogleBuyModal();

      onCreateTransaction(
        {
          [TYPE_BUY_FIELD]: type === NFT_SALE_ORDER_TYPE.SELL ? MINTED : TRANSFER,
          [SALE_ORDER_ID]: saleOrder?._id,
          [QUANTITY]: values?.quantity ? parseInt(values?.quantity) : MIN_VALUE_TOTAL_COPIES,
        },
        {
          onSuccess: (id: string, data: any) => handleTransactionSuccessfulCreation(id, data),
          onError: handleBuyServerError,
        },
      );
    }
  }, 500);

  return (
    <Fragment>
      {visibleButton && (
        <div onClick={handleCheckBuyButton(nft)} className='buy-button'>
          {children}
        </div>
      )}

      <BuyModal
        nft={selectedNFT}
        visible={visible}
        usd={selectedCurrency?.usd}
        isEnoughBalance={isEnoughBalance}
        onSetVisible={setVisible}
        onSubmit={handleProceedBuy}
        onClose={handleToogleBuyModal}
        onSetStepBuy={handleUpdateBuyStep}
        checkBalanceLoading={checkBalanceLoading}
        loadingDetailNFT={loadingDetailNFT}
      />
    </Fragment>
  );
};

export default BuyButton;
