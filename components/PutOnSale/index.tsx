import FormItem, { TYPE_INPUT } from '@components//FormItem';
import Modal from '@components//Modal';
import { Avatar, Col, Row, Spin, Typography } from 'antd';
import { Form, Formik } from 'formik';

import AppLoading from '@components//AppLoading';
import { usePutOnSaleNFT } from '@components//pages/nft/hooks';
import { useWeb3React } from '@web3-react/core';
import { DEFAULT_RPC721, PAYMENT_TOKEN } from 'connectors/constants';
import { ZERO_VALUE } from 'constants/common';
import { LIST_FOR_SALE_FIELD } from 'constants/nft';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useTranslation } from 'next-i18next';
import LoadingNFTIcon from 'public/svg/loading_nft_icon.svg';
import { useEffect, useState } from 'react';
import selectedAddress from 'redux/address/selector';
import MetamaskService from 'services/MetamaskService';
import AppButton from '../AppButton';
import { getBuySchema, getPutOnSaleSchema } from 'utils/schema';
import { BigNumber } from 'ethers';

interface PropsPutOnSale {
  isModalPutOnSale: boolean;
  setIsModalLoading: any;
  handleClosePutOnSale: () => void;
  dataNftDetail: any;
}

const { Title } = Typography;
const { PRICE } = LIST_FOR_SALE_FIELD;

const PutOnSaleModal = ({isModalPutOnSale, handleClosePutOnSale, dataNftDetail, setIsModalLoading }: PropsPutOnSale) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [isApprovedListForSale, setIsApproveListForSale] = useState(false);
  const wallet = new MetamaskService().getInstance();

  const { address } = useAppSelector(selectedAddress.getAddress);
  const { library } = useWeb3React();
  const { onPutOnSaleNFT, loadingPutOnSale } = usePutOnSaleNFT()

  const handleCheckApprovedForAll = async () => {
    try {
      const response = await wallet.isApprovedForAll({
        account: address,
        library,
      });

      setIsApproveListForSale(response);
    } catch (error) {
      console.log(error);
    }
  };

  const handleApproveNFT = async () => {
    setIsModalLoading(true);

    try {
      const response = await wallet.setApprovalForAllNft({
        account: address,
        library,
        approved: true,
      });
      setIsApproveListForSale(response)
    setIsModalLoading(false);

    } catch (error) {
    }
  };

  const handleApprovePutOnSale = async (data?: any, realPrice?: any) => {
    await wallet.putOnSaleNFT({
      account: address,
      library,
      data,
      onCallback: (response: any) => onPutOnSaleNFT({
        id: dataNftDetail[0]?._id,
        price: Number(realPrice),
        hashPutOnSale: response?.hash
      }),
    });
  };
  const handleSumbit = async (values: any) => {
    setIsModalLoading(true);
    const originalPrice = Number(values?.price);
    const decimal = 10 ** 18;
    const realPrice = BigNumber.from((decimal * originalPrice).toString()).toString();

    const data = {
      collection: DEFAULT_RPC721,
      tokenId: `0x${dataNftDetail[0]?._id}`,
      amount: 1,
      paymentToken: PAYMENT_TOKEN,
      price: realPrice,
    }
    await handleApprovePutOnSale(data, data?.price)

    setIsModalLoading(false)
    handleClosePutOnSale()
  };
  console.log("isApprovedListForSale: ", isApprovedListForSale);

  useEffect(() => {
    if (library && address && !isApprovedListForSale) {
      handleCheckApprovedForAll();
    }
  }, [library, address]);

  return (
    <Modal
      visible={isModalPutOnSale}
      onClose={handleClosePutOnSale}>
      <AppLoading loading={loadingPutOnSale || false} src={LoadingNFTIcon}>
        <Title level={4} className='payment-title'>Put On Sale NFT</Title>
        <div className='modal-payment'>
          <Formik
            onSubmit={handleSumbit}
            initialValues={{ [PRICE]: 0 }}
            validationSchema={getPutOnSaleSchema(t)}
          >
            {({ setFieldValue, values, errors }) => {

              return (
                <Row>
                  <Form className='payment-content'>
                    <Col xs={24} className='payment-item'>
                      <span className='payment-item__title'>Item</span>
                      <div className='payment-item-content'>
                        <p>From the Other worlds series.﻿( Original + NFT ) #1</p>
                        <Avatar shape="square" size={64} icon={<img src={dataNftDetail[0]?.ipfsImage} alt='' />} />
                      </div>
                    </Col>
                    {isApprovedListForSale &&
                      <Col xs={24} className='list-for-sale-modal-form'>
                        <FormItem
                          containerClassName='payment-form__input'
                          typeInput={TYPE_INPUT.TEXT}
                          placeholder={t('nft_detail.txt_lfs_input_quantity')}
                          decimalScale={ZERO_VALUE}
                          thousandSeparator
                          name={PRICE}
                          label={t('nft_detail.txt_rfs_price')}
                        />
                      </Col>}
                    <Col xs={24} className='payment-item'>
                      <span className='payment-item__title'>Subtotal</span>
                      <div className='payment-item__price'>
                        <p>1</p>
                      </div>
                    </Col>
                    <Col xs={24} className='payment-item'>
                      <span className='payment-item__title'>Amount</span>
                      <div className='payment-item__price'>
                        <p>1</p>
                      </div>
                    </Col>
                    <div className='payment-btn'>
                      {isApprovedListForSale &&
                        <AppButton
                          htmlType='submit'
                          text={'Put On Sale'}
                          variant='primary'
                        />
                      }
                      {!isApprovedListForSale &&
                        <AppButton
                          text={'Approve'}
                          variant='secondary'
                          onClick={handleApproveNFT}
                        />
                      }
                    </div>
                  </Form>
                </Row>
              );
            }}
          </Formik>

        </div>
      </AppLoading>
    </Modal>
  )
}

export default PutOnSaleModal