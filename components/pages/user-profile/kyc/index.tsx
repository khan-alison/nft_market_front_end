import AppButton from '@components//AppButton';
import FormItem, { TYPE_INPUT } from '@components//FormItem';
import { useGetUserProfile, useKYC, useSubmitKYC } from '@components//pages/user-profile/hooks';
import { Col, Form, Row, Typography } from 'antd';
import { Formik } from 'formik';
import { useAppSelector } from 'hooks/useStore';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import selectedAddress from 'redux/address/selector';
import { kycSchema } from 'utils/schema';
import CheckIcon from 'public/svg/CheckIcon';
import { INFO_KYC } from 'constants/common';
import selectAuthentication from 'redux/authentication/selector';
import { KYCStatus } from 'constants/my-account';

const { Title } = Typography;
const initialValuesNft = {
  imageUrl: '',
}

const KycUser = () => {
  const { t } = useTranslation();
  const { authenticationToken } = useAppSelector(selectAuthentication.getAuthenticationToken);

  const { userProfile, onGetUserProfile } = useGetUserProfile(authenticationToken);
  const { kycInfo } = userProfile ?? {};
  const { kycStatus = undefined } = kycInfo ?? {};
  const { onKyc, infoKyc, checkKyc, setCheckKyc } = useKYC();
  const { onSubmitKyc } = useSubmitKYC();
  const { address } = useAppSelector(selectedAddress.getAddress);

  const handleVeryfy = async (values: any) => {
    onKyc(values)
  };

  const handleSubmit = async () => {
    const param = {
      ...infoKyc,
      address: address,
    }
    onSubmitKyc(param);
  };

  const CommonInfoKYC = ({ info, index }: any) => {
    return (
      <p key={index} className='kyc-info__item'>
        <span className='title'>{t(`${info.name}`)}:</span>
        <span>{infoKyc[info.value]}</span>
      </p>
    )
  }

  return (
    <div className='create-nft-page'>
      <div className='container'>
        <div className='creation-nft'>
          <div className='creation--title'>
            <Title level={3}>{t('nft_create.txt_kyc')}</Title>
          </div>
          <div className='creation--block'>
            <Formik
              onSubmit={handleVeryfy}
              initialValues={initialValuesNft}
              validationSchema={kycSchema(t, 225)}
            >
              {({ setFieldValue, values, errors }) => {

                return (
                  <Form className=''>
                    <Row justify='space-between'>
                      {!checkKyc ?
                        <Col xs={12} className=''>
                          <FormItem
                            name='imageUrl'
                            typeInput={TYPE_INPUT.TEXT}
                            required
                            placeholder={t('nft_create.txt_upload_media')}
                            label={t('nft_create.txt_imageUrl')}
                          />
                        </Col> :
                        <Col xs={24} style={{ textAlign: 'center' }}>
                          <CheckIcon />
                          <h3 style={{ color: '#fff' }}>{t('message.S11')}</h3>
                          <div className='kyc-info'>
                            {INFO_KYC.map((info: any, index: number) => (
                              <CommonInfoKYC info={info} key={index} />
                            ))}
                          </div>
                        </Col>}
                    </Row>
                    <div className='submit-btn'>
                      {checkKyc ? <div>
                        <AppButton
                          // htmlType='submit'
                          className={'button--second'}
                          text={t('nft_detail.txt_back')}
                          variant='dark'
                          onClick={() => setCheckKyc(false)}
                        />
                        <AppButton
                          // htmlType='submit'
                          className={'button--second'}
                          text={t('home.txt_submit_kyc')}
                          variant='primary'
                          onClick={() => handleSubmit()}
                          disabled={kycStatus === KYCStatus.VERIFIED}
                        />
                      </div> :
                        <AppButton
                          // htmlType='submit'
                          className={'button--second'}
                          text={t('home.txt_verify')}
                          variant='primary'
                          onClick={() => handleVeryfy(values)}
                          disabled={kycStatus === KYCStatus.VERIFIED}
                        />
                      }
                    </div>
                  </Form>
                );
              }}
            </Formik>
            <div className="info">

            </div>
          </div>
        </div>
      </div>
    </div >
  )
}

export default KycUser