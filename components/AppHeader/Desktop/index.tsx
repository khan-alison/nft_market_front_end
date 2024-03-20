import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled, MinusCircleFilled } from '@ant-design/icons';
import AppAddress from '@components//AppAddress';
import AppButton from '@components//AppButton';
import AppDropdown from '@components//AppDropdown';
import AppLink from '@components//AppLink';
import ConnectWalletButton from '@components//ConnectWalletButton';
import KycButton from '@components//KycButton';
import { useGetUserProfile } from '@components//pages/user-profile/hooks';
import { useWeb3React } from '@web3-react/core';
import { Divider } from 'antd';
import { walletConnect } from 'connectors';
import { METAMASK, WALLET_CONNECT } from 'connectors/constants';
import { KEY_STORAGE, TAB_PANE } from 'constants/common';
import { KYCStatus, USER_TYPE } from 'constants/my-account';
import { renderURLs, routeURLs } from 'constants/routes';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import Cookies from 'js-cookie';
import { useTranslation } from 'next-i18next';
import DisconnectIcon from 'public/svg/disconnect_icon.svg';
import selectedAddress from 'redux/address/selector';
import { handleSetAddressNetwork } from 'redux/address/slice';
import selectAuthentication from 'redux/authentication/selector';
import { handleSetAuthenticationToken } from 'redux/authentication/slice';
import selectedConnection from 'redux/connection/selector';
import { handleSetCancelkyc } from 'redux/kyc/slice';
import { getToken } from 'services/api';
import { shortenAddress } from 'utils';

const Desktop = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { deactivate } = useWeb3React();

  const { address } = useAppSelector(selectedAddress.getAddress);
  const { isConnected } = useAppSelector(selectedConnection.getConnection);
  const { authenticationToken } = useAppSelector(selectAuthentication.getAuthenticationToken);

  const { userProfile, onGetUserProfile } = useGetUserProfile(authenticationToken);
  const { kycInfo, userType } = userProfile ?? {};
  const { kycStatus = undefined } = kycInfo ?? {};
  const isBDA = userType === USER_TYPE.BDA;

  const handleDisconnect = () => {
    getToken('');
    Cookies.remove(KEY_STORAGE.TOKEN);
    sessionStorage.clear();
    deactivate();
    dispatch(handleSetAddressNetwork({}));
    dispatch(handleSetAuthenticationToken(''));
    dispatch(handleSetCancelkyc(false));
    walletConnect.walletConnectProvider = undefined;
    localStorage.removeItem(WALLET_CONNECT);
    localStorage.removeItem(METAMASK);
  };

  const renderKycStatus = (kycStatus: any) => {
    switch (kycStatus) {
      case KYCStatus.UNVERIFIED:
        return (
          <span className='kyc-status__box kyc-unverified'>
            <MinusCircleFilled className='kyc-status__icon kyc-status-icon__unverified' />
            {t('user_profile.txt_kyc_unverified')}
          </span>
        );
      case KYCStatus.PENDING:
        return (
          <span className='kyc-status__box kyc-pending'>
            <InfoCircleFilled className='kyc-status__icon kyc-status-icon__pending' />
            {t('user_profile.txt_kyc_pending')}
          </span>
        );
      case KYCStatus.REJECTED:
        return (
          <span className='kyc-status__box kyc-rejected'>
            <CloseCircleFilled className='kyc-status__icon kyc-status-icon__rejected' />
            {t('user_profile.txt_kyc_rejected')}
          </span>
        );
      case KYCStatus.VERIFIED:
        return (
          <span className='kyc-status__box kyc-verified'>
            <CheckCircleFilled className='kyc-status__icon kyc-status-icon__verified' />
            {t('user_profile.txt_kyc_verified')}
          </span>
        );
      default:
        return;
    }
  };

  const overlay = () => {
    return (
      <div className='header-overlay'>
        <div className='item user_type-kyc'>
          <span className={`user-type ${isBDA ? 'user-type_kda' : 'user-type_user-common'}`}>
            {isBDA ? t('home.txt_bda') : t('home.txt_user')}
          </span>
          {renderKycStatus(kycStatus)}
        </div>
        <div className='item header-overlay__address border-bottom-none'>
          <AppAddress address={address} addressClassName='text' />
        </div>
        {/* {kycStatus === KYCStatus.UNVERIFIED && (
          <KycButton
            className='item header-overlay__submit-kyc border-bottom-none'
            text={<span>{t('home.txt_submit_kyc')}</span>}
            refetch={onGetUserProfile?.refetch}
          />
        )} */}
        <AppLink href={'/'}>
          <div className='item'>
            <span>{t('home.txt_account')}</span>
          </div>
        </AppLink>
        {kycStatus === KYCStatus.UNVERIFIED && (
          <AppLink href={routeURLs.KYC}>
            <div className='item'>
              <span>{t('nft_create.txt_kyc')}</span>
            </div>
          </AppLink>)}
        {kycStatus === KYCStatus.VERIFIED && (
          <AppLink href={routeURLs.CREATE_NFT}>
            <div className='item'>
              <span>{t('nft_create.txt_title')}</span>
            </div>
          </AppLink>)}
        <div className='item border-bottom-none' onClick={handleDisconnect}>
          <img src={DisconnectIcon} />
          <span className='disconnect'>{t('home.txt_disconnect')}</span>
        </div>
      </div>
    );
  };

  return isConnected ? (
    <AppDropdown overlay={overlay}>
      <AppButton
        text={
          <>
            <span>{shortenAddress(address)}</span>
            <Divider type='vertical' className='divider' />
            <span className='user-type'>
              {isBDA ? (
                <span className='user-type_bda'>{t('home.txt_bda')}</span>
              ) : (
                <span className='user-type_user_common'>{t('home.txt_user')}</span>
              )}
            </span>
          </>
        }
        variant='default'
        className='app-header__button'
      />
    </AppDropdown>
  ) : (
    <ConnectWalletButton />
  );
};

export default Desktop;
