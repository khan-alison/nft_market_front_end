import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'next-i18next';
import { Col, Image, Row } from 'antd';
import { Form, Formik } from 'formik';
import BigNumber from 'bignumber.js';
import classNames from 'classnames';

import AppButton from 'components/AppButton';
import ModalComponent from 'components/Modal';
import showMessage from '@components//Message';
import AppNumber from '@components//AppNumber';
import AppLoading from '@components//AppLoading';
import EllipsisText from '@components//EllipsisText';
import FormItem, { TYPE_INPUT } from 'components/FormItem';

import LoadingNFTIcon from 'public/svg/loading_nft_icon.svg';

import selectedAddress from 'redux/address/selector';

import { useAppSelector } from 'hooks/useStore';
import { useGetConfig } from 'hooks/useGetConfig';

import MetamaskService from 'services/MetamaskService';

import { getBuySchema } from 'utils/schema';
import { convertPriceBigNumber, limitMaxlengNumber, multipleTwoBigNumber } from 'utils';

import TYPE_CONSTANTS from 'constants/type';
import { DOLLAR_TEXT, EMPTY_DEFAULT_TEXT, ZERO_VALUE } from 'constants/common';
import { BUY_STEPS, BUY_FIELD, MAX_LENGTH_TOTAL_SUPPLY, NFT_STANDARD } from 'constants/nft';

const { QUANTITY } = BUY_FIELD;
const { START, FAILED, PROCESSING } = BUY_STEPS;

const initFormValues = {
  [QUANTITY]: '',
};

type BuyModalProps = {
  visible: boolean;
  onClose?: () => void;
  title?: string;
  onSubmit: (values?: any) => void;
  nft?: any;
  onSetStepBuy?: any;
  onSetVisible?: any;
  isEnoughBalance?: boolean;
  usd?: number;
  checkBalanceLoading?: boolean;
  loadingDetailNFT?: boolean;
};

const BuyModal = ({
  visible,
  onClose,
  title,
  onSubmit,
  nft = {},
  onSetStepBuy,
  onSetVisible,
  isEnoughBalance,
  usd = 0,
  checkBalanceLoading,
  loadingDetailNFT,
  ...props
}: BuyModalProps) => {
  const { t } = useTranslation();
  const formikRef = useRef(null) as any;
  const { library } = useWeb3React();

  const { address } = useAppSelector(selectedAddress.getAddress);
  const { currency, userMintingQuantityMax } = useGetConfig();

  const [loading, setLoading] = useState(false);
  const [allowanceERC20, setAllowanceERC20] = useState(new BigNumber(0));
  const [isShowApproveCurrency, setIsShowApproveCurrency] = useState(true);
  const [approveCurrencyLoading, setApproveCurrencyLoading] = useState(false);

  const wallet = new MetamaskService();
  const { image, name, saleOrder = {}, maxQuantity = 0 } = nft;
  const { unitPrice, tokenId, quantity } = saleOrder;
  const is721Standard = NFT_STANDARD[0].value === nft?.token?.standard;

  const limitMinted = useMemo(() => {
    switch (true) {
      case is721Standard && maxQuantity > userMintingQuantityMax:
        return userMintingQuantityMax;
      default:
        return maxQuantity;
    }
  }, [is721Standard, maxQuantity, userMintingQuantityMax]);

  const getAllowanceERC20 = async (account: any) => {
    setApproveCurrencyLoading(true);
    try {
      const response = await wallet.getAllowanceERC20({
        account,
        library,
      });
      setAllowanceERC20(response as any);
    } catch (error) {
    } finally {
      setApproveCurrencyLoading(false);
    }
  };

  useEffect(() => {
    setIsShowApproveCurrency(true);
  }, [address]);

  useEffect(() => {
    if (address && library) {
      getAllowanceERC20(address);
    }
  }, [address, library]);

  const handleSetMaxQuantity = (setFieldValue: any, field: string) => () => setFieldValue(field, limitMinted);

  const handleApproveCurrencySuccess = () => {
    setIsShowApproveCurrency(false);
    showMessage(TYPE_CONSTANTS.MESSAGE.SUCCESS, t('message.S4'));
    onSetStepBuy(START);
    onSetVisible(true);
  };

  const handleApproveCurrencyFailed = () => {
    onSetStepBuy(FAILED);
    setIsShowApproveCurrency(true);
  };

  const handleCancleApproveMemask = () => {
    onSetStepBuy(START);
    onSetVisible(true);
  };

  const handleApproveCurrency = async () => {
    setLoading(true);
    onSetStepBuy(PROCESSING);
    onSetVisible(false);

    try {
      await wallet.setAllowanceERC20({
        account: address,
        library,
        onSuccess: handleApproveCurrencySuccess,
        onError: handleApproveCurrencyFailed,
        onCancelMetamask: handleCancleApproveMemask,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const isNeedApproveCurrency = useMemo(() => {
    const value = convertPriceBigNumber(unitPrice * quantity);
    return value.gt(allowanceERC20);
  }, [allowanceERC20, unitPrice, quantity]);

  const isDisableProcessButton = isShowApproveCurrency && isNeedApproveCurrency;

  return (
    <ModalComponent visible={visible} width={911} onClose={onClose} {...props}>
      <AppLoading loading={loadingDetailNFT || false} src={LoadingNFTIcon}>
        <div className='buy-modal'>
          <div className='title'>{title || t('nft_detail.txt_checkout')}</div>
          <Formik
            onSubmit={onSubmit}
            initialValues={initFormValues}
            validationSchema={getBuySchema(t, limitMinted)}
            innerRef={formikRef}
          >
            {({ setFieldValue, values }: any) => {
              const subTotalPrice = values?.[QUANTITY] && multipleTwoBigNumber(unitPrice, values?.[QUANTITY]);
              const subTotalUsd = values?.[QUANTITY] && multipleTwoBigNumber(unitPrice * usd, values?.[QUANTITY]);

              return (
                <Row>
                  <Col md={12} xs={24} className='buy-modal-preview'>
                    <Image src={image?.url} alt={name} preview={false} />
                  </Col>
                  <Col md={12} xs={24} className='buy-modal-form'>
                    <Form>
                      <EllipsisText text={name} className='form__name' />
                      {tokenId && (
                        <p className='form__token'>
                          {t('nft_detail.txt_token_id')}: {tokenId}
                        </p>
                      )}

                      <FormItem
                        containerClassName='buy-modal-form__input'
                        typeInput={TYPE_INPUT.NUMBER}
                        placeholder={t('nft_detail.txt_input_quantity')}
                        decimalScale={ZERO_VALUE}
                        thousandSeparator
                        name={QUANTITY}
                        label={t('nft_detail.txt_quantity')}
                        appendInput={
                          <AppButton
                            variant='primary'
                            className='field__button'
                            text={t('nft_detail.txt_max')}
                            onClick={handleSetMaxQuantity(setFieldValue, QUANTITY)}
                          />
                        }
                        isAllowed={limitMaxlengNumber(MAX_LENGTH_TOTAL_SUPPLY)}
                      />

                      <div className='item'>
                        <span className='item__label'>{t('nft_detail.txt_price')}</span>
                        <div className='currency'>
                          <div className='currency__top'>
                            <img src={currency?.icon} />
                            {unitPrice ? <AppNumber value={unitPrice} /> : EMPTY_DEFAULT_TEXT}
                            <span className='currency__symbol'>{currency?.symbol}</span>
                          </div>
                          <div className='currency__price'>
                            ~&nbsp;
                            {DOLLAR_TEXT}&nbsp;
                            {unitPrice ? <AppNumber value={unitPrice * usd} /> : EMPTY_DEFAULT_TEXT}
                          </div>
                        </div>
                      </div>

                      <div className='item'>
                        <span className='item__label'>{t('nft_detail.txt_subtotal')}</span>
                        <div className='currency'>
                          <div className='currency__top'>
                            <img src={currency.icon} />
                            {subTotalPrice ? <AppNumber value={subTotalPrice} /> : EMPTY_DEFAULT_TEXT}

                            <span className='currency__symbol'>{currency.symbol}</span>
                          </div>
                          <div className='currency__price'>
                            ~&nbsp;{DOLLAR_TEXT}&nbsp;
                            {subTotalUsd ? <AppNumber value={subTotalUsd} /> : EMPTY_DEFAULT_TEXT}
                          </div>
                        </div>
                      </div>

                      <div className='group-button'>
                        {isShowApproveCurrency && isNeedApproveCurrency && (
                          <AppButton
                            className='button--first'
                            text={t('nft_detail.txt_approve_currency')}
                            variant='primary'
                            onClick={handleApproveCurrency}
                            disabled={loading}
                            loading={approveCurrencyLoading}
                          />
                        )}
                        <AppButton
                          htmlType='submit'
                          className={classNames('button--second', {
                            'button--processed': !isDisableProcessButton,
                          })}
                          text={t('nft_detail.txt_proceed_payment')}
                          variant='primary'
                          loading={checkBalanceLoading}
                          disabled={isDisableProcessButton || loading || checkBalanceLoading || approveCurrencyLoading}
                        />
                        {!isEnoughBalance && (
                          <div className='error-text group-button__error-text'>{t('message.E12')}</div>
                        )}
                      </div>
                    </Form>
                  </Col>
                </Row>
              );
            }}
          </Formik>
        </div>
      </AppLoading>
    </ModalComponent>
  );
};

export default BuyModal;
