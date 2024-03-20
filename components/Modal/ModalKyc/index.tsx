import { useEffect, FC, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Typography, Spin, Checkbox } from 'antd';

import LoadingIcon from '@components//LoadingIcon';
import Modal from '..';
import KycIcon from 'public/svg/kyc_icon.svg';

import { useModal } from 'hooks/useModal';
import { handleSetCancelkyc, handleAddKyc } from 'redux/kyc/slice';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import selectedAddress from 'redux/address/selector';
import showMessage from '@components//Message';
import TYPE_CONSTANTS from 'constants/type';
import router from 'next/router';
import { routeURLs } from 'constants/routes';

type ModalKyc = {};

const ModalKyc: FC<ModalKyc> = ({}) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [showPopupKycAgain, setShowPopupKycAgain] = useState(false);
  const { address } = useAppSelector(selectedAddress.getAddress);

  const { visible: visibleModalUnsaved, setVisible: setVisible } = useModal(true);

  useEffect(() => {
    const blockpass = new window.BlockpassKYCConnect(
      process.env.NEXT_PUBLIC_APP_CLIENT_ID, // service client_id from the admin console
      {
        refId: address, // assign the local user_id of the connected user
      },
    );

    blockpass.startKYCConnect();

    blockpass.on('KYCConnectSuccess', (data: any) => {
      //add code that will trigger when data have been sent.
      showMessage(TYPE_CONSTANTS.MESSAGE.SUCCESS, 'message.S1');
      dispatch(
        handleAddKyc({
          address,
          showPopupKycAgain: true,
        }),
      );
      onCloseModal();
      router.push(routeURLs.ACCOUNT);
      console.log('kyc success');
      console.log('data :>> ', data);
    });

    blockpass.on('KYCConnectCancel', () => {
      showMessage(TYPE_CONSTANTS.MESSAGE.ERROR, 'message.E6');
      onCloseModal();
      router.push(routeURLs.ACCOUNT);
    });
  }, [address]);

  const onChange = (e: any) => {
    setShowPopupKycAgain(e.target.checked);
  };

  const onCloseModal = () => {
    dispatch(handleSetCancelkyc(true));
    setVisible(false);
  };

  const onSkipModal = () => {
    dispatch(
      handleAddKyc({
        address,
        showPopupKycAgain: showPopupKycAgain,
      }),
    );
    onCloseModal();
  };

  return (
    <Modal wrapClassName='kyc-modal' visible={visibleModalUnsaved} onClose={onCloseModal} showCloseIcon={true}>
      <div className='kyc'>
        <p className='title'>{t('common.txt_kyc_notice_title')}</p>
        <span
          dangerouslySetInnerHTML={{
            __html: t('common.txt_kyc_content'),
          }}
          className='sub-title'
        />
        <img src={KycIcon} alt='' />
        <span>
          <Checkbox className='show-popup-kyc' onChange={onChange}>
            {t('common.txt_kyc_popup_show')}
          </Checkbox>
        </span>
        <button id='blockpass-kyc-connect' className='submit-kyc'>
          {t('common.txt_kyc_button')}
        </button>
        <div className='skip-kyc'>
          <p className='skip-kyc__link' onClick={onSkipModal}>
            {t('common.txt_kyc_skip')}
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default ModalKyc;
