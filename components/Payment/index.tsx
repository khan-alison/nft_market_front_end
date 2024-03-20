import Modal from '@components//Modal';
import { Avatar, Col, Row, Typography } from 'antd';
import { Form, Formik } from 'formik';

import AppLoading from '@components//AppLoading';
import { useMintNFT } from '@components//pages/nft/hooks';
import { useWeb3React } from '@web3-react/core';
import { DEFAULT_RPC721 } from 'connectors/constants';
import { LIST_FOR_SALE_FIELD } from 'constants/nft';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import { useTranslation } from 'next-i18next';
import LoadingNFTIcon from 'public/svg/loading_nft_icon.svg';
import selectedAddress from 'redux/address/selector';
import MetamaskService from 'services/MetamaskService';
import AppButton from '../AppButton';

interface PropsPayment {
  isModalPayment: boolean;
  setIsModalLoading: any;
  handleClosePayment: () => void;
  dataNftDetail: any;
}

const { Title } = Typography;
const { AMOUNT } = LIST_FOR_SALE_FIELD;

const PaymentModal = ({ isModalPayment, handleClosePayment, dataNftDetail, setIsModalLoading }: PropsPayment) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { address } = useAppSelector(selectedAddress.getAddress);
  const { library } = useWeb3React();
  const { onMintNFT, loadingMint } = useMintNFT()

  const handleApproveMinted = async (data?: any, values?: any) => {
    const wallet = new MetamaskService().getInstance();
    await wallet.mintNFT({
      account: address,
      library,
      data,
      onCallback: (response: any) => onMintNFT({
        id: dataNftDetail[0]?._id,
        totalSupply: 1,
        hash: response?.hash
      }),
    });
  };

  const handleSumbit = async (values: any) => {
    setIsModalLoading(true)
    const param: any = {
      data: {
        collection: DEFAULT_RPC721,
        id: `0x${dataNftDetail[0]?._id}`,
        amount: 1,
        uri: dataNftDetail[0]?.ipfsImage,
      },
    };

    await handleApproveMinted(param?.data, values);
    setIsModalLoading(false)
    handleClosePayment()

  }
  const handleSetMaxQuantity = (setFieldValue: any, field: string) => () => setFieldValue(field, 0);

  return (
    <Modal
      visible={isModalPayment}
      onClose={handleClosePayment}>
      <AppLoading loading={loadingMint || false} src={LoadingNFTIcon}>

        <Title level={4} className='payment-title'>Mint NFT</Title>
        <div className='modal-payment'>
          <Formik
            onSubmit={handleSumbit}
            initialValues={[]}
          // validationSchema={}
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
                    {/* <Col xs={24} className='list-for-sale-modal-form'>
                      <FormItem
                        containerClassName='payment-form__input'
                        typeInput={TYPE_INPUT.NUMBER}
                        placeholder={t('nft_detail.txt_lfs_input_quantity')}
                        decimalScale={ZERO_VALUE}
                        thousandSeparator
                        name={AMOUNT}
                        label={t('nft_detail.txt_lfs_quantity')}
                        appendInput={
                          <AppButton
                            text={t('nft_detail.txt_max')}
                            className='field__button'
                            onClick={handleSetMaxQuantity(setFieldValue, AMOUNT)}
                            variant='primary'
                          />
                        }
                        isAllowed={limitMaxlengNumber(MAX_LENGTH_TOTAL_SUPPLY)}
                      />
                    </Col> */}
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
                    {/* <Col xs={24} className='payment-item'>
                      <span className='payment-item__title'>You will pay</span>
                      <div className='payment-item__price'>
                        <p>13,000 N1</p>
                        <span className='price-item'>~$1,600</span>
                      </div>
                    </Col> */}
                    <div className='payment-btn'>
                      <AppButton
                        htmlType='submit'
                        // className={classNames('button--second')}
                        text={'Mint NFT'}
                        variant='primary'
                      />
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

export default PaymentModal