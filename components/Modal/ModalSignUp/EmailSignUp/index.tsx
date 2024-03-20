import { Col, Row } from 'antd';
import classNames from 'classnames';
import { Form, Formik } from 'formik';
import { useState } from 'react';

import AppButton from '@components//AppButton';
import FormItem, { TYPE_INPUT } from '@components//FormItem';
import Modal from '@components//Modal';


import { useTranslation } from 'next-i18next';
import VerifyAccount from './VerifyAccount';

interface EmailSignUpProp {
  visibleEmail: boolean;
  handleCloseSignUptByEmail: () => void;
  handleOpentVerifyAccount: () => void;
  initialValuesEmail: any;
}

const EmailSignUp = ({ visibleEmail, handleCloseSignUptByEmail, initialValuesEmail, handleOpentVerifyAccount }: EmailSignUpProp) => {
  const { t } = useTranslation();
  
  const handleSumbit = (values: any) => {

    handleCloseSignUptByEmail();
    handleOpentVerifyAccount();
    console.log("submit", values);
  }

  return (
    <Modal
      visible={visibleEmail}
      onClose={handleCloseSignUptByEmail}

      wrapClassName='connect-wallet-modal'
    >
      <div>
        <p className='title'>{t('signUp.txt_title_email')}</p>
        <Formik
          onSubmit={handleSumbit}
          initialValues={initialValuesEmail}
        // validationSchema={}
        >
          {({ setFieldValue, values, errors }) => {

            return (
              <Row>
                <Col xs={24} className='list-for-sale-modal-form'>
                  <Form>
                    <FormItem
                      name="username"
                      typeInput={TYPE_INPUT.TEXT}
                      placeholder={t('signUp.txt_user')}
                      label={t('signUp.txt_user')}
                    />
                    <FormItem
                      name="email"
                      typeInput={TYPE_INPUT.TEXT}
                      placeholder={t('signUp.txt_email')}
                      label={t('signUp.txt_email')}
                    />
                    <FormItem
                      name="password"
                      typeInput={TYPE_INPUT.PASSWORD}
                      placeholder={t('signUp.txt_password')}
                      label={t('signUp.txt_password')}
                    />
                    <div className='auth-btn'>
                      <AppButton
                        htmlType='submit'
                        className={classNames('button--second')}
                        text={t('common.txt_signUp')}
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
    </Modal >
  )
}

export default EmailSignUp;