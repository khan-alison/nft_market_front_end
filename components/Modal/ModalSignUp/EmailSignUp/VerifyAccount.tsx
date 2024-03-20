import { Col, Row } from 'antd';
import classNames from 'classnames';
import { Form, Formik } from 'formik';

import AppButton from '@components//AppButton';
import FormItem, { TYPE_INPUT } from '@components//FormItem';
import Modal from '@components//Modal';


import { useTranslation } from 'next-i18next';
import OTPInput from 'react-otp-input';
import { useState } from 'react';

interface VerifyAccountProp {
  visibleVerifyAccount: boolean;
  handleClosetVerifyAccount: () => void;
}

const VerifyAccount = ({ visibleVerifyAccount, handleClosetVerifyAccount }: VerifyAccountProp) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState('');
  const handleSumbit = () => { console.log("submit", otp); }
  return (
    <Modal
      visible={visibleVerifyAccount}
      onClose={handleClosetVerifyAccount}

      wrapClassName='connect-wallet-modal'
    >
      <div className='verify-account-content'>
        <p className='title'>{t('signUp.txt_verify_account')}</p>
        <p className='decs'>{t('signUp.txt_verify_account_des')}</p>
        <div className='content-verify'>
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            renderSeparator={<span>-</span>}
            inputStyle='otp-form'
            renderInput={(props) => <input {...props} />}
          />
        </div>
        <p className='decs'>{t('signUp.txt_received_email')}</p>
        <div className='content-verify'>
          <ul className='list-step'>
            <li className='list-step__item'>{t('signUp.txt_li_1')}</li>
            <li className='list-step__item'>{t('signUp.txt_li_2')}</li>
            <li className='list-step__item'>{t('signUp.txt_li_3')}</li>
            <li className='list-step__item'>{t('signUp.txt_li_4')}</li>
          </ul>
        </div>
        <div className='auth-btn'>
          <AppButton
            onClick={handleSumbit}
            className={classNames('button--second')}
            text={t('signUp.txt_submit')}
            variant='primary'
          />
        </div>
      </div>
    </Modal >
  )
}

export default VerifyAccount;