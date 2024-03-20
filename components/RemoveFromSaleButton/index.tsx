import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'next-i18next';

import AppButton from '../AppButton';
import ListForSaleModal from './RemoveFromSaleModal';

import selectedAction from 'redux/action/selector';
import selectedAddress from 'redux/address/selector';
import { handleSetConnectModal } from 'redux/connection/slice';
import { handleSetRemoveFromSaleStep, handleSetTransactionId } from 'redux/action/slice';

import MetamaskService from 'services/MetamaskService';
import { useCreateTransaction, useUpdateTransaction } from '../pages/nft/hooks';

import { useSocket } from 'hooks/useSocket';
import { useAppSelector, useAppDispatch } from 'hooks/useStore';

import { SOCKET_EVENT } from 'constants/common';
import { NFT_TRANSACTION_TYPE, REMOVE_FROM_SALE_STEPS } from 'constants/nft';

type RemoveFromSaleButtonProps = {
  nft?: any;
  visibleButton?: boolean;
  callback?: any;
  children?: ReactNode;
  onSetSelectedNFT?: any;
  selectedNFT?: any;
};

const { PROCESSING, SUCCESSFUL, FAILED, START, CANCEL } = REMOVE_FROM_SALE_STEPS;

const RemoveFromSaleButton = ({
  nft = {},
  visibleButton,
  callback,
  children,
  selectedNFT,
  onSetSelectedNFT,
  ...props
}: RemoveFromSaleButtonProps) => {
  const { t } = useTranslation();
  const { library } = useWeb3React();

  const dispatch = useAppDispatch();

  const { address } = useAppSelector(selectedAddress.getAddress);
  const { removeFromSaleStep, transactionId } = useAppSelector<any>(selectedAction.getAction);

  const { onCreateTransaction } = useCreateTransaction();
  const { onUpdateTransaction } = useUpdateTransaction();

  const [visible, setVisible] = useState(false);
  const [isCompletedRemoveFromSale, setIsCompletedRemoveFromSale] = useState(false);

  const handleUpdateRemoveFromSaleStep = (value: number) => dispatch(handleSetRemoveFromSaleStep(value));

  const handleRemoveFromSaleServerError = () => handleUpdateRemoveFromSaleStep(CANCEL);

  const handleRemoveFromSaleContractError = () => handleUpdateRemoveFromSaleStep(FAILED);

  const handleToogleListForSaleModal = () => setVisible(!visible);

  useEffect(() => {
    if (START === removeFromSaleStep) {
      setIsCompletedRemoveFromSale(false);
    }
  }, [removeFromSaleStep]);

  const handleCheckListForSale = (nft: any) => () => {
    if (!address) {
      dispatch(handleSetConnectModal(true));
    } else {
      handleToogleListForSaleModal();
      onSetSelectedNFT && onSetSelectedNFT(nft);
    }
  };

  const handleRemoveFromSaleSuccess = () => {
    if (!isCompletedRemoveFromSale) {
      setIsCompletedRemoveFromSale(true);
      handleUpdateRemoveFromSaleStep(SUCCESSFUL);
      callback && callback();
    }
  };

  const handleCompletedRemoveFromSale = (transactionId: string, data: { hash: string; status: string }) => {
    onUpdateTransaction(transactionId, data, {
      onError: handleRemoveFromSaleServerError,
      onSuccess: handleRemoveFromSaleSuccess,
    });
  };

  const handleRemoveFromSaleEvent = (data: any) => {
    if (!isCompletedRemoveFromSale && data?.transactionId === transactionId) {
      handleRemoveFromSaleSuccess();
    }
  };

  useSocket({
    event: SOCKET_EVENT.BUY_NFT,
    handleEvent: handleRemoveFromSaleEvent,
    dependences: [transactionId, isCompletedRemoveFromSale],
  });

  const handleFailedContractRemoveFromSale = (transactionId: string, data: any) => {
    onUpdateTransaction(transactionId, data, {
      onError: handleRemoveFromSaleContractError,
      onSuccess: handleRemoveFromSaleContractError,
    });
  };

  const handleCancelApproveMemask = () => {
    handleUpdateRemoveFromSaleStep(START);
    setVisible(true);
  };

  const handleTransactionSuccessfulCreation = async (transactionId: string, data?: any) => {
    dispatch(handleSetTransactionId(transactionId));
    const wallet = new MetamaskService().getInstance();

    await wallet.cancelSellOrder({
      account: address,
      library,
      data,
      onCallback: (data: any) => handleCompletedRemoveFromSale(transactionId, data),
      onCancelMetamask: handleCancelApproveMemask,
      onServerError: handleRemoveFromSaleServerError,
      onContractError: (data: any) => handleFailedContractRemoveFromSale(transactionId, data),
    });
  };

  const handleListForSaleNFT = async () => {
    handleUpdateRemoveFromSaleStep(PROCESSING);
    setVisible(false);
    onCreateTransaction(
      {
        type: NFT_TRANSACTION_TYPE.DELISTED,
        transactionId: selectedNFT?.transactionId,
      },
      {
        onSuccess: (id: string, data: any) => handleTransactionSuccessfulCreation(id, data),
        onError: handleRemoveFromSaleServerError,
      },
    );
  };

  return (
    <Fragment>
      {visibleButton && (
        <div onClick={handleCheckListForSale(nft)} className='cursor-pointer'>
          {children || (
            <AppButton className='table-column-list-for-sale-button' text={t('nft_detail.txt_remove_from_sale')} />
          )}
        </div>
      )}

      <ListForSaleModal
        visible={visible}
        onClose={handleToogleListForSaleModal}
        nft={selectedNFT}
        onSubmit={handleListForSaleNFT}
        {...props}
      />
    </Fragment>
  );
};

export default RemoveFromSaleButton;
