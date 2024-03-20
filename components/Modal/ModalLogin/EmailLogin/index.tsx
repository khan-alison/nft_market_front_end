import { Col, Row } from 'antd';
import classNames from 'classnames';
import { Form, Formik } from 'formik';

import AppButton from '@components//AppButton';
import FormItem, { TYPE_INPUT } from '@components//FormItem';
import Modal from '@components//Modal';

import InfoIcon from 'public/svg/info_icon.svg';

import { useTranslation } from 'next-i18next';

interface EmailLoginProp {
  visibleEmail: boolean;
  handleCloseLogintByEmail: () => void;
  initialValuesEmail: any;
}

const EmailLogin = ({ visibleEmail, handleCloseLogintByEmail, initialValuesEmail }: EmailLoginProp) => {
  const { t } = useTranslation();

  const handleSubmit = (values: any) => { console.log("submit", values); }
  return (
    <Modal
      visible={visibleEmail}
      onClose={handleCloseLogintByEmail}

      wrapClassName='connect-wallet-modal'
    >
      <div>
        <p className='title'>{t('common.txt_login_email')}</p>
        <Formik
          onSubmit={handleSubmit}
          initialValues={initialValuesEmail}
        // validationSchema={}
        >
          {({ setFieldValue, values, errors }) => {

            return (
              <Row>
                <Col xs={24} className='list-for-sale-modal-form'>
                  <Form>
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
                <p className='sub-note'>
                  <img className='sub-note__image' src={InfoIcon} />
                  <span dangerouslySetInnerHTML={{ __html: t('common.txt_question') }} />
                  {/* <strong onClick={handleOpenModalSignUp} style={{ cursor: 'pointer', marginLeft: '5px' }}>{t('common.txt_suggest_signUp')}</strong> */}
                </p>
              </Row>
            );
          }}
        </Formik>
      </div>
    </Modal >
  )
}

export default EmailLogin;