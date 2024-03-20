import { useTranslation } from 'next-i18next';
import { Form, Formik } from 'formik';
import { Col, Image, Row } from 'antd';
import classNames from 'classnames';

import Modal from '@components//Modal';
import AppButton from '@components//AppButton';
import EllipsisText from '@components//EllipsisText';
import AppNumber from '@components//AppNumber';
import NumberFormat from '@components//NumberFormat';
import ItemWithLabel from '@components//ItemWithLabel';

import { useGetConfig } from 'hooks/useGetConfig';

import { LIST_FOR_SALE_FIELD, NFT_DECIMAL_SCALE, NFT_PERCENTAGE_SUFFIX } from 'constants/nft';
import { DOLLAR_TEXT, PERCENTAGE_NUMBER, TOKEN_SUPPORT } from 'constants/common';

const { QUANTITY, UNIT_PRICE } = LIST_FOR_SALE_FIELD;

type RemoveFromSaleModalProps = {
  visible: boolean;
  onClose?: () => void;
  onSubmit?: any;
  nft?: any;
  title?: string;
};

const RemoveFromSaleModal = ({ visible, onClose, onSubmit, title, nft = {}, ...props }: RemoveFromSaleModalProps) => {
  const { t } = useTranslation();
  const { currencies } = useGetConfig();

  const { image, name, quantity, tokenId, royaltyFee, unitPrice, usd, currency, quantityForSale } = nft;
  const selectedCurrency = currencies?.find((item: any) => item?.name === currency?.name) || {};
  const { symbol, usd: usdSelectedCurrency } = selectedCurrency;

  const renderTitle = title || t('nft_detail.txt_remove_from_sale');

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
        >
          {() => {
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

                    <ItemWithLabel label={t('nft_detail.txt_lfs_quantity')} labelClassName='item__label'>
                      <AppNumber value={quantityForSale} />
                    </ItemWithLabel>

                    <ItemWithLabel label={t('nft_detail.txt_lfs_price')} labelClassName='item__label'>
                      <div className='column'>
                        <p className='label'>
                          <img src={TOKEN_SUPPORT.icon} />
                          &nbsp;
                          <EllipsisText text={<AppNumber value={unitPrice} />} />
                          &nbsp;
                          <span className='text'>{symbol}</span>
                        </p>
                        <p className='content'>
                          ~&nbsp;{DOLLAR_TEXT}&nbsp;
                          <EllipsisText text={<AppNumber value={usd} />} />
                          &nbsp;
                        </p>
                      </div>
                    </ItemWithLabel>

                    <ItemWithLabel
                      label={t('nft_detail.txt_lfs_royalties')}
                      helpText={t('nft_detail.txt_lfs_royalties_tooltip')}
                      labelClassName='item__label'
                    >
                      <span className='item__text'>
                        {royaltyFee}
                        {NFT_PERCENTAGE_SUFFIX}
                      </span>
                    </ItemWithLabel>

                    <ItemWithLabel
                      label={t('nft_detail.txt_rfs_profit_per_edition')}
                      helpText={t('nft_detail.txt_profit_per_edition_tooltip')}
                      labelClassName='item__label'
                    >
                      <div className='column'>
                        <p className='label'>
                          <img src={TOKEN_SUPPORT.icon} />
                          &nbsp;
                          <EllipsisText text={<AppNumber value={unitPrice * (1 - royaltyFee / PERCENTAGE_NUMBER)} />} />
                          &nbsp;
                          <span className='text'>{symbol}</span>
                        </p>
                        <p className='content'>
                          ~&nbsp;{DOLLAR_TEXT}&nbsp;
                          <EllipsisText
                            text={
                              <AppNumber
                                value={
                                  unitPrice * quantity * (1 - royaltyFee / PERCENTAGE_NUMBER) * usdSelectedCurrency
                                }
                              />
                            }
                          />
                          &nbsp;
                        </p>
                      </div>
                    </ItemWithLabel>

                    <div className='group-button'>
                      <AppButton
                        htmlType='submit'
                        className={classNames('button--first')}
                        text={t('nft_detail.txt_proceed_removal')}
                        variant='primary'
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

export default RemoveFromSaleModal;
