import React, { useState } from 'react'
import Modal from '@components//Modal';
import AppButton from '@components//AppButton';
import LoadingIcon from '@components//LoadingIcon';
import NextIcon from 'public/svg/next_icon.svg';
import MetamaskLogo from 'public/svg/metamask_icon.svg';
import FacebookLogo from 'public/svg/facebook_icon.svg';
import TwitterLogo from 'public/svg/twitter_icon.svg';
import EmailLogo from 'public/svg/email_icon.svg';
import InfoIcon from 'public/svg/info_icon.svg';
import { useTranslation } from 'next-i18next';
import { handleSetConnectModal } from 'redux/connection/slice';
import { useAppDispatch } from 'hooks/useStore';
import EmailSignUp from './EmailSignUp';
import { DEFAULT_EMAIL_SIGNUP_VALUE } from 'constants/common';
import VerifyAccount from './EmailSignUp/VerifyAccount';

interface SignUpProp {
  isVisibleSignUp: boolean;
  handleCloseModalSignUp: () => void;
}


const ModalSignUp = ({ isVisibleSignUp, handleCloseModalSignUp }: SignUpProp) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [visibleEmail, setVisibleEmail] = useState(false);
  const [initialValuesEmail, setInitialValuesEmail] = useState(DEFAULT_EMAIL_SIGNUP_VALUE);
  const [visibleVerifyAccount, setVisibleVerifyAccount] = useState(false);

  const handleClosetVerifyAccount = () => setVisibleVerifyAccount(false);
  const handleOpentVerifyAccount = () => setVisibleVerifyAccount(true);


  const handleShowConnectModal = () => {
    handleCloseModalSignUp();
    dispatch(handleSetConnectModal(true));
  }

  const handleSignUpByFacebook = () => { return };
  const handleSignUptByTwitter = () => { return };
  const handleOpenSignUptByEmail = () => setVisibleEmail(true);
  const handleCloseSignUptByEmail = () => {
    setVisibleEmail(false);
    setInitialValuesEmail(DEFAULT_EMAIL_SIGNUP_VALUE);
  };
  return (
    <div>
      <Modal
        visible={isVisibleSignUp}
        onClose={handleCloseModalSignUp}
        wrapClassName='connect-wallet-modal'
      >
        <div className='wallet-modal'>
          <p className='title'>{t('common.txt_signUp')}</p>
          <div className='wallet-modal__button'>
            <AppButton
              text={t('signUp.txt_title_facebook')}
              onClick={handleSignUpByFacebook}
              className='wallet-modal__button--first'
              variant='dark'
              prefixIcon={<img src={FacebookLogo} />}
              afterIcon={<img src={NextIcon} />}
            />
            <AppButton
              text={t('signUp.txt_title_twitter')}
              onClick={handleSignUptByTwitter}
              className='wallet-modal__button--first'
              variant='dark'
              prefixIcon={<img src={TwitterLogo} />}
              afterIcon={<img src={NextIcon} />}
            />
            <AppButton
              text={t('signUp.txt_title_email')}
              onClick={handleOpenSignUptByEmail}
              className='wallet-modal__button--first'
              variant='dark'
              prefixIcon={<img src={EmailLogo} />}
              afterIcon={<img src={NextIcon} />}
            />
            <p className='sub-note'>
              <img className='sub-note__image' src={InfoIcon} />
              <span dangerouslySetInnerHTML={{ __html: t('signUp.txt_confirm') }} />
              <strong onClick={handleShowConnectModal} style={{ cursor: 'pointer', marginLeft: '5px' }}>{t('common.txt_login')}</strong>
            </p>

          </div>
        </div>
      </Modal>
      <VerifyAccount visibleVerifyAccount={visibleVerifyAccount} handleClosetVerifyAccount={handleClosetVerifyAccount} />

      <EmailSignUp visibleEmail={visibleEmail} handleCloseSignUptByEmail={handleCloseSignUptByEmail} initialValuesEmail={initialValuesEmail} handleOpentVerifyAccount={handleOpentVerifyAccount}/>
    </div>
  )
}

export default ModalSignUp