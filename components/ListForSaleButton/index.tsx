import React, { Fragment, ReactNode, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'next-i18next';
import isEmpty from 'lodash/isEmpty';

import AppButton from '../AppButton';
import ListForSaleModal from './ListForSaleModal';
import { useListForSaleNFT } from '../pages/nft/hooks';

import selectedAddress from 'redux/address/selector';
import { handleSetListForSaleStep } from 'redux/action/slice';
import { handleSetConnectModal } from 'redux/connection/slice';

import { useGetConfig } from 'hooks/useGetConfig';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';

import MetamaskService from 'services/MetamaskService';

import { convertToNumber } from 'utils';

import { LIST_FOR_SALE_STEPS, MIN_VALUE_TOTAL_COPIES, LIST_FOR_SALE_FIELD } from 'constants/nft';

type ListForSaleButtonProps = {
  nft?: any;
  visibleButton?: boolean;
  callback?: any;
  children?: ReactNode;
  onSetSelectedNFT?: any;
  selectedNFT?: any;
};

const { PROCESSING, SUCCESSFUL, FAILED } = LIST_FOR_SALE_STEPS;
const { QUANTITY, UNIT_PRICE, TOKEN_ID, CURRENCY } = LIST_FOR_SALE_FIELD;

const ListForSaleButton = ({
  nft = {},
  visibleButton,
  callback,
  children,
  selectedNFT,
  onSetSelectedNFT,
  ...props
}: ListForSaleButtonProps) => {
  const { t } = useTranslation();
  const { library } = useWeb3React();

  const dispatch = useAppDispatch();
  const { currency } = useGetConfig();
  const { address } = useAppSelector(selectedAddress.getAddress);

  const { onListForSaleNFT } = useListForSaleNFT();

  const [visible, setVisible] = useState(false);
  const [isApprovedListForSale, setIsApproveListForSale] = useState(false);
  const [loadingApprovedListForSale, setLoadingApprovedListForSale] = useState(false);

  const wallet = new MetamaskService().getInstance();

  const handleUpdateListForSaleStep = (value: number) => dispatch(handleSetListForSaleStep(value));

  const handleListForSaleError = () => handleUpdateListForSaleStep(FAILED);

  const handleToggleListForSaleModal = () => setVisible(!visible);

  const handleIsCheckListForSaleApproved = async () => {
    setLoadingApprovedListForSale(true);
    try {
      const { token } = selectedNFT;
      const response = await wallet.checkListForSaleNftApproved({
        account: address,
        library,
        contractAddress: token?.address,
        standard: token?.standard,
      });
      setIsApproveListForSale(response);
    } catch (error) {
    } finally {
      setLoadingApprovedListForSale(false);
    }
  };

  useEffect(() => {
    if (visibleButton && library && !isEmpty(selectedNFT) && address) {
      handleIsCheckListForSaleApproved();
    }
  }, [selectedNFT, visibleButton, library, address]);

  const handleCheckListForSale = (nft: any) => () => {
    if (!address) {
      dispatch(handleSetConnectModal(true));
    } else {
      handleToggleListForSaleModal();
      onSetSelectedNFT && onSetSelectedNFT(nft);
    }
  };

  const handleListForSaleSuccess = () => {
    handleUpdateListForSaleStep(SUCCESSFUL);
    callback && callback();
  };

  const handleGetFieldParam = (value: number) => value || MIN_VALUE_TOTAL_COPIES;

  const handleListForSaleNFT = (values: any) => {
    handleUpdateListForSaleStep(PROCESSING);
    setVisible(false);

    if (selectedNFT?.tokenId) {
      onListForSaleNFT(
        selectedNFT?._id,
        {
          [QUANTITY]: handleGetFieldParam(convertToNumber(values?.[QUANTITY])),
          [UNIT_PRICE]: handleGetFieldParam(values?.[UNIT_PRICE]),
          [TOKEN_ID]: selectedNFT?.tokenId,
          [CURRENCY]: currency?.name,
        },
        {
          onSuccess: handleListForSaleSuccess,
          onError: handleListForSaleError,
        },
      );
    }
  };

  return (
    <Fragment>
      {visibleButton && (
        <div onClick={handleCheckListForSale(nft)} className='cursor-pointer'>
          {children || (
            <AppButton
              className='table-column-list-for-sale-button'
              text={t('nft_detail.txt_list_for_sale')}
              variant='secondary'
            />
          )}
        </div>
      )}

      <ListForSaleModal
        visible={visible}
        nft={selectedNFT}
        isDisableProcessButton={!isApprovedListForSale}
        onSetVisible={setVisible}
        onSubmit={handleListForSaleNFT}
        onClose={handleToggleListForSaleModal}
        onSetStepListForSale={handleUpdateListForSaleStep}
        setIsApproveListForSale={setIsApproveListForSale}
        loadingApprovedListForSale={loadingApprovedListForSale}
        {...props}
      />
    </Fragment>
  );
};

export default ListForSaleButton;
