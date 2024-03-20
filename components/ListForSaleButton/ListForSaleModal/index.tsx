import React, { useMemo, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'next-i18next';
import { Form, Formik } from 'formik';
import { Col, Image, Row } from 'antd';
import classNames from 'classnames';

import Modal from '@components//Modal';
import AppButton from '@components//AppButton';
import EllipsisText from '@components//EllipsisText';
import AppNumber from '@components//AppNumber';
import ItemWithLabel from '@components//ItemWithLabel';
import FormItem, { TYPE_INPUT } from '@components//FormItem';
import showMessage from '@components//Message';

import selectedAddress from 'redux/address/selector';
import { useAppSelector } from 'hooks/useStore';
import { useGetConfig } from 'hooks/useGetConfig';

import MetamaskService from 'services/MetamaskService';
import { getListForSaleSchema } from 'utils/schema';
import { limitMaxlengNumber } from 'utils';

import {
  LIST_FOR_SALE_STEPS,
  MAX_LENGTH_TOTAL_SUPPLY,
  MIN_VALUE_TOTAL_COPIES,
  NFT_DECIMAL_SCALE_PRICE,
  LIST_FOR_SALE_FIELD,
  NFT_STANDARD,
  NFT_PERCENTAGE_SUFFIX,
} from 'constants/nft';
import TYPE_CONSTANTS from 'constants/type';
import { DOLLAR_TEXT, EMPTY_DEFAULT_TEXT, PERCENTAGE_NUMBER, ZERO_VALUE } from 'constants/common';

const { START, PROCESSING, CANCEL } = LIST_FOR_SALE_STEPS;
const { QUANTITY, UNIT_PRICE } = LIST_FOR_SALE_FIELD;

type ListForSaleModalProps = {
  visible: boolean;
  onClose?: () => void;
  onSubmit?: any;
  nft?: any;
  title?: string;
  isDisableProcessButton?: boolean;
  onSetVisible?: any;
  setIsApproveListForSale?: any;
  onSetStepListForSale?: any;
  loadingApprovedListForSale?: boolean;
};

const ListForSaleModal = ({
  visible,
  onClose,
  onSubmit,
  title,
  nft,
  isDisableProcessButton,
  onSetVisible,
  setIsApproveListForSale,
  onSetStepListForSale,
  loadingApprovedListForSale,
  ...props
}: ListForSaleModalProps) => {
  const { t } = useTranslation();
  const { library } = useWeb3React();

  const { currency } = useGetConfig();
  const { address } = useAppSelector(selectedAddress.getAddress);

  const [loading, setLoading] = useState(false);

  const wallet = new MetamaskService();

  const { image, name, token = {}, quantity, tokenId, royaltyFee } = nft;

  const renderTitle = title || t('nft_detail.txt_list_for_sale');
  const is721Standard = NFT_STANDARD[0].value === token?.standard;

  const handleApproveNFTSuccess = () => {
    showMessage(TYPE_CONSTANTS.MESSAGE.SUCCESS, 'message.S2');
    setIsApproveListForSale(true);
    onSetStepListForSale(START);
    onSetVisible(true);
  };

  const handleApproveNFTFailed = () => {
    onSetStepListForSale(CANCEL);
    setIsApproveListForSale(false);
  };

  const handleCancelApproveMetamask = () => {
    onSetStepListForSale(START);
    onSetVisible(true);
  };

  const handleApproveNFT = async () => {
    setLoading(true);
    onSetVisible(false);
    onSetStepListForSale(PROCESSING);

    try {
      await wallet.setListForSaleNftApproved({
        account: address,
        library,
        approved: true,
        standard: token?.standard,
        contractAddress: token?.address,
        onSuccess: handleApproveNFTSuccess,
        onError: handleApproveNFTFailed,
        onCancelMetamask: handleCancelApproveMetamask,
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  const renderErc721TotalCopies = useMemo(
    () => (
      <ItemWithLabel label={t('nft_detail.txt_lfs_quantity')} labelClassName='item__label'>
        <span className='item__text'>{MIN_VALUE_TOTAL_COPIES}</span>
      </ItemWithLabel>
    ),
    [is721Standard],
  );

  const handleSetMaxQuantity = (setFieldValue: any, field: string) => () => setFieldValue(field, quantity);

  return (
    <Modal visible={visible} width={911} onClose={onClose} {...props}>
      <div className='list-for-sale-modal'>
        <div className='title'>{renderTitle}</div>
        <Formik
          onSubmit={onSubmit}
          initialValues={{
            [QUANTITY]: '',
            [UNIT_PRICE]: '',
          }}
          validationSchema={getListForSaleSchema(t, quantity, {
            requiredQuantity: is721Standard,
          })}
        >
          {({ setFieldValue, values, errors }) => {
            const unitPrice = values?.[UNIT_PRICE] as any;
            const quantity = is721Standard ? MIN_VALUE_TOTAL_COPIES : (values?.[QUANTITY] as any);

            return (
              <Row>
                <Col md={12} xs={24} className='list-for-sale-modal-preview'>
                  <Image src={image?.url} alt={name} preview={false} />
                </Col>
                <Col md={12} xs={24} className='list-for-sale-modal-form'>
                  <Form>
                    <EllipsisText text={name} className='form__name' />
                    <p className='form__token'>
                      {t('nft_detail.txt_token_id')}: {tokenId}
                    </p>

                    {is721Standard ? (
                      renderErc721TotalCopies
                    ) : (
                      <FormItem
                        containerClassName='list-for-sale-modal-form__input'
                        typeInput={TYPE_INPUT.NUMBER}
                        placeholder={t('nft_detail.txt_lfs_input_quantity')}
                        decimalScale={ZERO_VALUE}
                        thousandSeparator
                        name={QUANTITY}
                        label={t('nft_detail.txt_lfs_quantity')}
                        appendInput={
                          <AppButton
                            text={t('nft_detail.txt_max')}
                            className='field__button'
                            onClick={handleSetMaxQuantity(setFieldValue, QUANTITY)}
                            variant='primary'
                          />
                        }
                        isAllowed={limitMaxlengNumber(MAX_LENGTH_TOTAL_SUPPLY)}
                      />
                    )}

                    <FormItem
                      thousandSeparator
                      name={UNIT_PRICE}
                      typeInput={TYPE_INPUT.NUMBER}
                      decimalScale={NFT_DECIMAL_SCALE_PRICE}
                      containerClassName='list-for-sale-modal-form__input'
                      placeholder={t('nft_detail.txt_lfs_input_unit_price')}
                      label={t('nft_detail.txt_lfs_price')}
                      appendInput={<div className='field__currency'>{currency?.symbol}</div>}
                      isAllowed={limitMaxlengNumber()}
                    />
                    <p className='price-usd'>
                      ~&nbsp;{DOLLAR_TEXT}&nbsp;
                      <EllipsisText
                        text={
                          unitPrice && quantity ? (
                            <AppNumber value={unitPrice * quantity * currency?.usd} />
                          ) : (
                            EMPTY_DEFAULT_TEXT
                          )
                        }
                      />
                      &nbsp;
                    </p>

                    <ItemWithLabel
                      label={t('nft_detail.txt_lfs_royalties')}
                      labelClassName='item__label'
                      helpText={t('nft_detail.txt_lfs_royalties_tooltip')}
                    >
                      <span className='item__text'>
                        {royaltyFee}
                        {NFT_PERCENTAGE_SUFFIX}
                      </span>
                    </ItemWithLabel>

                    <ItemWithLabel
                      label={t('nft_detail.txt_profit_per_edition')}
                      helpText={t('nft_detail.txt_profit_per_edition_tooltip')}
                    >
                      <div className='column'>
                        <p className='label'>
                          <EllipsisText
                            text={
                              unitPrice && quantity ? (
                                <AppNumber value={unitPrice * (1 - royaltyFee / PERCENTAGE_NUMBER)} />
                              ) : (
                                EMPTY_DEFAULT_TEXT
                              )
                            }
                          />
                          &nbsp;
                          <span className='text'>{currency?.symbol}</span>
                        </p>
                        <p className='content'>
                          ~&nbsp;{DOLLAR_TEXT}&nbsp;
                          <EllipsisText
                            text={
                              unitPrice && quantity ? (
                                <AppNumber
                                  value={unitPrice * quantity * (1 - royaltyFee / PERCENTAGE_NUMBER) * currency?.usd}
                                />
                              ) : (
                                EMPTY_DEFAULT_TEXT
                              )
                            }
                          />
                          &nbsp;
                        </p>
                      </div>
                    </ItemWithLabel>

                    <div className='group-button'>
                      {isDisableProcessButton && (
                        <AppButton
                          className='button--first'
                          text={t('nft_detail.txt_approve_nft')}
                          variant='primary'
                          onClick={handleApproveNFT}
                          disabled={loading}
                          loading={loadingApprovedListForSale}
                        />
                      )}
                      <AppButton
                        htmlType='submit'
                        className={classNames('button--second', {
                          'button--processed': !isDisableProcessButton,
                        })}
                        text={t('nft_detail.txt_process_listing')}
                        variant='primary'
                        disabled={isDisableProcessButton || loading || loadingApprovedListForSale}
                      />
                    </div>
                  </Form>
                </Col>
              </Row>
            );
          }}
        </Formik>
      </div>
    </Modal>
  );
};

export default ListForSaleModal;
