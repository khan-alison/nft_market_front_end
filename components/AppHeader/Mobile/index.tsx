import { CheckCircleFilled, CloseCircleFilled, InfoCircleFilled, MinusCircleFilled } from '@ant-design/icons';
import AppAddress from '@components//AppAddress';
import AppButton from '@components//AppButton';
import AppLink from '@components//AppLink';
import ConnectWalletButton from '@components//ConnectWalletButton';
import KycButton from '@components//KycButton';
import { useGetUserProfile } from '@components//pages/user-profile/hooks';
import { useWeb3React } from '@web3-react/core';
import { Drawer, Menu } from 'antd';
import { walletConnect } from 'connectors';
import { METAMASK, WALLET_CONNECT } from 'connectors/constants';
import { KEY_STORAGE, TAB_PANE } from 'constants/common';
import { KYCStatus, USER_TYPE } from 'constants/my-account';
import { renderURLs, routeURLs } from 'constants/routes';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import Cookies from 'js-cookie';
import { useTranslation } from 'next-i18next';
import AppIcon from 'public/svg/app_logo.svg';
import CloseIcon from 'public/svg/close_icon.svg';
import DisconnectIcon from 'public/svg/disconnect_icon.svg';
import MenuIcon from 'public/svg/menu_icon.svg';
import UserIcon from 'public/svg/user_icon.svg';
import { useState } from 'react';
import selectedAddress from 'redux/address/selector';
import { handleSetAddressNetwork } from 'redux/address/slice';
import selectAuthentication from 'redux/authentication/selector';
import { handleSetAuthenticationToken } from 'redux/authentication/slice';
import selectedConnection from 'redux/connection/selector';
import { handleSetCancelkyc } from 'redux/kyc/slice';
import { getToken } from 'services/api';

const { SubMenu } = Menu;

const Mobile = () => {
  const { t } = useTranslation();
  const { deactivate } = useWeb3React();

  const dispatch = useAppDispatch();
  const { address } = useAppSelector(selectedAddress.getAddress);
  const { isConnected } = useAppSelector(selectedConnection.getConnection);
  const { authenticationToken } = useAppSelector(selectAuthentication.getAuthenticationToken);

  const { userProfile, onGetUserProfile } = useGetUserProfile(authenticationToken);
  const { kycInfo, userType } = userProfile ?? {};
  const { kycStatus = undefined } = kycInfo ?? {};
  const isBDA = userType === USER_TYPE.BDA;

  const [visible, setVisible] = useState(false);
  const [visibleAccountMenu, setVisibleAccountMenu] = useState(false);

  const handleOpenMenu = () => setVisible(!visible);

  const handleCloseMenu = () => setVisible(false);

  const handleOpenAccountMenu = () => setVisibleAccountMenu(!visibleAccountMenu);
  const handleCloseAccountMenu = () => setVisibleAccountMenu(false);

  const handleDisconnect = () => {
    getToken('');
    Cookies.remove(KEY_STORAGE.TOKEN);
    deactivate();
    dispatch(handleSetAddressNetwork({}));
    dispatch(handleSetAuthenticationToken(''));
    dispatch(handleSetCancelkyc(false));
    walletConnect.walletConnectProvider = undefined;
    localStorage.removeItem(WALLET_CONNECT);
    localStorage.removeItem(METAMASK);
    handleCloseAccountMenu();
  };

  const docsMenus = [
    {
      key: 'whitepaper',
      label: t('home.txt_whitepaper'),
      href: '#',
    },
    {
      key: 'terms-of-service',
      label: t('home.txt_terms_of_service'),
      href: '#',
    },
    {
      key: 'privacy-policy',
      label: t('home.txt_whitepaper'),
      href: '#',
    },
    {
      key: 'faqs',
      label: t('home.txt_faqs'),
      href: '#',
    },
  ];

  const listMenus = [
    {
      label: t('home.txt_events'),
      isLink: true,
      href: routeURLs.HOME,
    },
    {
      content: (
        <div className='locking'>
          {t('home.txt_locking')}
          <div className='collab'>
            {t('home.txt_collab_with')}
            {'  '}
            <img src={AppIcon} className='app-header__collab-icon' />
          </div>
        </div>
      ),
      isLink: true,
      href: '#',
    },
    {
      label: t('home.txt_landing_page'),
      isLink: true,
      href: '#',
    },
    {
      content: (
        <Menu mode='inline'>
          <SubMenu key='docs-menu' title={t('home.txt_docs')}>
            {docsMenus.map((menuItem, index) => (
              <Menu.Item key={menuItem.key}>
                <AppLink href={menuItem.href}>{menuItem.label}</AppLink>
              </Menu.Item>
            ))}
          </SubMenu>
        </Menu>
      ),
      isLink: true,
      href: '#',
    },
  ];

  const renderHeaderDrawer = () => {
    return (
      <div className='header-menu'>
        <div className='close-btn'>
          <img src={CloseIcon} alt='close icon' onClick={handleCloseMenu} />
        </div>
        <div className='container'>
          <div className='menu'>
            {listMenus.map((menu, index) => {
              const { href, label, content } = menu;
              return (
                <div key={index} className='item'>
                  <AppLink href={href}>{content ?? label}</AppLink>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderAccountDrawer = () => {
    return (
      <div className='header-overlay'>
        <div className='item user_type-kyc'>
          <span className={`user-type ${isBDA ? 'user-type_kda' : 'user-type_user-common'}`}>
            {isBDA ? t('home.txt_bda') : t('home.txt_user')}
          </span>
          <div className='status-close_container'>
            {renderKycStatus(kycStatus)}
            <img src={CloseIcon} alt='close icon' onClick={handleCloseAccountMenu} />
          </div>
        </div>
        <div className='account-button'>
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
        </div>
        <AppLink href={{ pathname: renderURLs.ACCOUNT(), query: { tabPane: TAB_PANE.INVENTORY } }}>
          <div className='item'>
            <span>{t('home.txt_account')}</span>
          </div>
        </AppLink>
        <AppLink href={{ pathname: renderURLs.ACCOUNT(), query: { tabPane: TAB_PANE.PURCHASE_HISTORY } }}>
          <div className='item'>
            <span>{t('home.txt_history')}</span>
          </div>
        </AppLink>
      </div>
    );
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

  return (
    <div className='mobile-header'>
      {isConnected && <img src={UserIcon} className='mobile-header__icon' onClick={handleOpenAccountMenu} />}
      <img src={MenuIcon} className='mobile-header__icon menu-icon' onClick={handleOpenMenu} />

      <Drawer
        title={renderHeaderDrawer()}
        visible={visible}
        closable={false}
        placement='right'
        className='mobile-drawer'
        onClose={handleCloseMenu}
      >
        <div className='connect-wallet-mobile'>
          {!isConnected && <ConnectWalletButton className='connect-wallet-mobile' />}
        </div>
      </Drawer>

      <Drawer
        title={renderAccountDrawer()}
        visible={visibleAccountMenu}
        closable={false}
        placement='right'
        className='mobile-drawer mobile-drawer_account'
        onClose={handleCloseAccountMenu}
      >
        <AppButton
          text={
            <div className='item border-bottom-none' onClick={handleDisconnect}>
              <img src={DisconnectIcon} />
              <span className='disconnect'>{t('home.txt_disconnect')}</span>
            </div>
          }
          variant='default'
          className='app-header__button'
        />
      </Drawer>
    </div>
  );
};

export default Mobile;
