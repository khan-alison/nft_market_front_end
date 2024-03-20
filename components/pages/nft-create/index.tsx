import AppButton from '@components//AppButton';
import FormItem, { TYPE_INPUT } from '@components//FormItem';
import showMessage from '@components//Message';
import DraggerMedia from '@components//pages/nft-create/DraggerMedia';
import FormAttributes from '@components//pages/nft-create/FormAttributes';
import { useCreateNFT } from '@components//pages/nft-create/hooks';
import { useGetUserProfile } from '@components//pages/user-profile/hooks';
import { Button, Col, Form, Image, Row, Typography, Upload, UploadProps } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { RcFile, UploadFile } from 'antd/lib/upload/interface';
import { KYCStatus } from 'constants/my-account';
import { DEFAULT_INIT, LIST_PREVIEW_SUPPORT_FILE, MAX_PREVIEW_SIZE, NFT_DEFAULT_CREATE_FIELD } from 'constants/nft';
import { Formik } from 'formik';
import { useAppSelector } from 'hooks/useStore';
import { get } from 'lodash';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react'
import selectAuthentication from 'redux/authentication/selector';
import { createNftSchema } from 'utils/schema';

const { Title } = Typography;
const initialValuesNft = {
  name: '',
  description: '',
  attributes: [
    {
      trait_type: "",
      value: ""
    },
  ],
  ipfsUrl: '',
  files: ''
}
const checkValidate = (values: any) => {
  return values?.name !== "" && values?.description !== "" && values?.name.length <= 255 && values?.description.length <= 4000
}

const CreateNft = () => {
  const { t } = useTranslation();
  const { TRAIT_TYPE, VALUE, DESCRIPTION, IPFS_URL, NAME, FILE } = DEFAULT_INIT;
  const { onCreateNFT, onUploadImg } = useCreateNFT()
  const [valuesInitial, setValuesInitial] = useState(initialValuesNft);
  const { authenticationToken } = useAppSelector(selectAuthentication.getAuthenticationToken);

  const { userProfile } = useGetUserProfile(authenticationToken);
  const { kycInfo } = userProfile ?? {};
  const { kycStatus = undefined } = kycInfo ?? {};

  const getOriginFile = (file: any) => get(file, ['fileList', 0, 'originFileObj']);

  const handleSubmit = async (values: any) => {
    const { file } = values;
    const image = getOriginFile(file);
    const param: any = {
      file: image,
      onTransaction: {
        onSuccess: (data: any) => onCreateNFT({
          name: values?.name,
          description: values?.description,
          attributes: valuesInitial.attributes,
          ipfsUrl: data
        }),
      },
    };
    if (checkValidate(values)) {
      onUploadImg(param)
    }
  }
  const handleAddAttribute = () => {
    setValuesInitial({
      ...valuesInitial,
      attributes: [...valuesInitial?.attributes, {
        trait_type: '',
        value: ''
      }],
    });
  };
  const handleCancelAttribute = (index: number) => {
    valuesInitial.attributes.splice(index, 1);
    setValuesInitial({
      ...valuesInitial,
      attributes: [...valuesInitial?.attributes],
    });
  };

  return (
    <div className='create-nft-page'>
      <div className='container'>
        <div className='creation-nft'>
          <div className='creation--title'>
            <Title level={3}>{t('nft_create.txt_title')}</Title>
          </div>
          <div className='creation--block'>
            <Formik
              onSubmit={handleSubmit}
              initialValues={initialValuesNft}
              validationSchema={createNftSchema(t, 225)}
            >
              {({ setFieldValue, values, errors }) => {

                return (
                  <Form className='creation-nft-form'>
                    <Row justify='space-between'>
                      <Col xs={12} className='list-for-sale-modal-form'>
                        <FormItem
                          name={NAME}
                          typeInput={TYPE_INPUT.TEXT}
                          required
                          placeholder={t('nft_create.txt_name')}
                          label={t('nft_create.txt_name')}
                        />
                        <FormItem
                          name={DESCRIPTION}
                          typeInput={TYPE_INPUT.TEXTAREA}
                          placeholder={t('nft_create.txt_description')}
                          label={t('nft_create.txt_description')}
                        />
                        <div className='attribute-group'>
                          <Button onClick={handleAddAttribute} className='attribute-btn--add'>+ Add product</Button>
                          <FormAttributes
                            setValues={setValuesInitial}
                            values={valuesInitial?.attributes}
                            handleCancelAttribute={handleCancelAttribute}
                          />
                        </div>
                      </Col>
                      <Col xs={11} className='list-for-sale-modal-form'>
                        <FormItem
                          name={FILE}
                          typeInput={null}
                          component={DraggerMedia}
                          errorField={`${NFT_DEFAULT_CREATE_FIELD.FILE}.previewContent`}
                        />
                      </Col>
                    </Row>
                    <div className='submit-btn'>
                      <AppButton
                        // htmlType='submit'
                        className={'button--second'}
                        text={t('nft_create.txt_create')}
                        variant='primary'
                        onClick={() => handleSubmit(values)}
                        disabled={kycStatus === KYCStatus.UNVERIFIED}
                      />
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
    </div>
  )
}

export default CreateNft