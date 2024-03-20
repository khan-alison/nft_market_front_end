import AppAddress from '@components//AppAddress';
import AppButton from '@components//AppButton';
import { Col, Image, Row, Tooltip } from 'antd';
import { useTranslation } from 'next-i18next';
import { shortenAddress } from 'utils';
import BDAImage from 'public/svg/bda_image.svg';
import UserCommonImg from 'public/svg/user_common_img.svg';
import { MinusCircleFilled, CloseCircleFilled, CheckCircleFilled, InfoCircleFilled } from '@ant-design/icons';
import { Progress } from 'antd';
import { DOLLAR_TEXT } from 'constants/common';
import AppNumber from '@components//AppNumber';
import { useAppSelector } from 'hooks/useStore';
import selectedAddress from 'redux/address/selector';
import { useGetUserProfile } from './hooks';
import { KYCStatus, REFERRAL_TOTAL_VOLUME, USER_TYPE } from 'constants/my-account';
import { useGetConfig } from 'hooks/useGetConfig';
import showMessage from '@components//Message';
import TYPE_CONSTANTS from 'constants/type';
import { renderURLs } from 'constants/routes';
import selectAuthentication from 'redux/authentication/selector';
import { useMobile } from 'hooks/useWindowSize';
import KycButton from '@components//KycButton';
import HelpIcon from 'public/svg/help_icon.svg';
import AppLink from '@components//AppLink';
import warningIcon from 'public/images/warning_icon.png';

const MAX_PERCENT = 100;

const UserProfile = () => {
  const { t } = useTranslation();
  const isMobile = useMobile();

  const { address } = useAppSelector(selectedAddress.getAddress);
  const config = useGetConfig();
  const { systems } = config;
  const { authenticationToken } = useAppSelector(selectAuthentication.getAuthenticationToken);

  const { userProfile, onGetUserProfile } = useGetUserProfile(authenticationToken);
  const {
    kycInfo,
    userType,
    referrer,
    personalVolume = 0,
    oldPersonalVolume = 0,
    haveReceivedBlackFromAdmin,
    ownedValidTokens,
  } = userProfile ?? {};
  const { kycStatus = undefined } = kycInfo ?? {};

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

  const renderUserType = (userType: any) => {
    switch (userType) {
      case USER_TYPE.COMMON:
        return <Image src={UserCommonImg} preview={false} />;
      case USER_TYPE.BDA:
        return <Image src={BDAImage} preview={false} />;
      default:
        return;
    }
  };

  const copyClipBoard = () => {
    navigator.clipboard.writeText(`${window.location.host}${renderURLs.LINK_REFERRAL(address)}`);
    return showMessage(TYPE_CONSTANTS.MESSAGE.SUCCESS, 'user_profile.txt_message_copy');
  };

  return userType ? (
    <>
      {((haveReceivedBlackFromAdmin && personalVolume >= REFERRAL_TOTAL_VOLUME) ||
        (!haveReceivedBlackFromAdmin && oldPersonalVolume >= REFERRAL_TOTAL_VOLUME)) &&
        ownedValidTokens === 0 &&
        userType === USER_TYPE.COMMON && (
          <div className='profile-page-header__breadcrumb'>
            <div className='container'>
              <div className='wrap'>
                <div className='breadcrum'>
                  <img src={warningIcon} />
                </div>
                <div className='breadcrum'>
                  <p dangerouslySetInnerHTML={{ __html: t('user_profile.txt_note_bda') }}></p>
                </div>
              </div>
            </div>
          </div>
        )}

      <div className='profile profile__content'>
        <div className='container'>
          <Row className='info'>
            <Col md={14} xs={24}>
              <Row className='info_user'>
                <Col>
                  <div className='info_user__image'>{renderUserType(userType)}</div>
                </Col>
                <Col md={12} xs={24}>
                  <div className='address-kyc'>
                    <AppAddress address={address} addressClassName='info_user__address' />
                    {referrer !== '' && !systems.includes(referrer) && (
                      <div className='referral-by'>
                        <span className='referral-by_txt'>{t('user_profile.txt_referrer_by')}</span>
                        <AppAddress
                          address={`${shortenAddress(referrer)}`}
                          addressClassName='info_user__referrer'
                          isVisibleCopy={false}
                          isShorten={false}
                        />
                      </div>
                    )}

                    <div className='kyc-box'>
                      <div className='kyc-status'>{renderKycStatus(kycStatus)}</div>
                      {/* {isMobile &&
                        kycStatus &&
                        (kycStatus === KYCStatus.UNVERIFIED || kycStatus === KYCStatus.REJECTED) && (
                          <KycButton
                            className='info_referral_button_submit-kyc'
                            text={<span>{t('user_profile.txt_submit_kyc')}</span>}
                            refetch={onGetUserProfile?.refetch}
                          />
                        )} */}
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
            <Col md={10} xs={24}>
              {!isMobile && (
                <Row className='info_referral_button'>
                  <Col>
                    {/* {kycStatus && (kycStatus === KYCStatus.UNVERIFIED || kycStatus === KYCStatus.REJECTED) && (
                      <KycButton
                        className='info_referral_button_submit-kyc'
                        text={<span>{t('user_profile.txt_submit_kyc')}</span>}
                        refetch={onGetUserProfile?.refetch}
                      />
                    )}
                    {kycStatus === KYCStatus.VERIFIED && (
                      <AppButton
                        onClick={copyClipBoard}
                        className='info_referral_button_referral'
                        text={t('user_profile.txt_get_referral_link')}
                        variant='link'
                      />
                    )} */}
                  </Col>
                </Row>
              )}
              {userType === USER_TYPE.COMMON && kycStatus === KYCStatus.VERIFIED && (
                <Row className='info_referral_progress'>
                  <Col span={24}>
                    <div className='referral-progress'>
                      <div className='referral-progress__text'>
                        <span className='referral-progress__text_rp'>{t('user_profile.txt_referral_progress')}</span>
                        {!isMobile && (
                          <span className='referral-progress__remain'>
                            <AppLink href={''} target='_blank' rel='noreferrer'>
                              <span className='referral-progress__remain__number'>
                                {DOLLAR_TEXT}{' '}
                                {haveReceivedBlackFromAdmin ? (
                                  <AppNumber
                                    value={
                                      Math.floor(REFERRAL_TOTAL_VOLUME - personalVolume) > 1
                                        ? Math.floor(REFERRAL_TOTAL_VOLUME - personalVolume)
                                        : 0
                                    }
                                  />
                                ) : (
                                  <AppNumber
                                    value={
                                      Math.floor(REFERRAL_TOTAL_VOLUME - oldPersonalVolume) > 1
                                        ? Math.floor(REFERRAL_TOTAL_VOLUME - oldPersonalVolume)
                                        : 0
                                    }
                                  />
                                )}
                              </span>
                              {` ${t('user_profile.txt_more_to_become_bda')}`}

                              <Tooltip title={t('nft_detail.txt_no_of_shares_help')} overlayClassName='tooltip-detail'>
                                <img src={HelpIcon} />
                              </Tooltip>
                            </AppLink>
                          </span>
                        )}
                      </div>
                      {haveReceivedBlackFromAdmin ? (
                        <Tooltip
                          title={`${t('user_profile.txt_referral_progress')}: ${Math.floor(
                            (personalVolume / REFERRAL_TOTAL_VOLUME) * MAX_PERCENT < MAX_PERCENT
                              ? (personalVolume / REFERRAL_TOTAL_VOLUME) * MAX_PERCENT
                              : MAX_PERCENT,
                          )}%`}
                        >
                          <Progress
                            strokeColor={'#c1296a'}
                            percent={Math.floor((personalVolume / REFERRAL_TOTAL_VOLUME) * MAX_PERCENT)}
                            showInfo={false}
                          />
                        </Tooltip>
                      ) : (
                        <Tooltip
                          title={`${t('user_profile.txt_referral_progress')}: ${Math.floor(
                            (oldPersonalVolume / REFERRAL_TOTAL_VOLUME) * MAX_PERCENT < MAX_PERCENT
                              ? (oldPersonalVolume / REFERRAL_TOTAL_VOLUME) * MAX_PERCENT
                              : MAX_PERCENT,
                          )}%`}
                        >
                          <Progress
                            strokeColor={'#c1296a'}
                            percent={Math.floor((oldPersonalVolume / REFERRAL_TOTAL_VOLUME) * MAX_PERCENT)}
                            showInfo={false}
                          />
                        </Tooltip>
                      )}

                      {isMobile && (
                        <span className='referral-progress__remain mobile'>
                          <AppLink href={''} target='_blank' rel='noreferrer'>
                            <span className='referral-progress__remain__number'>
                              {DOLLAR_TEXT}{' '}
                              {haveReceivedBlackFromAdmin ? (
                                <AppNumber
                                  value={
                                    Math.floor(REFERRAL_TOTAL_VOLUME - personalVolume) > 1
                                      ? Math.floor(REFERRAL_TOTAL_VOLUME - personalVolume)
                                      : 0
                                  }
                                />
                              ) : (
                                <AppNumber
                                  value={
                                    Math.floor(REFERRAL_TOTAL_VOLUME - oldPersonalVolume) > 1
                                      ? Math.floor(REFERRAL_TOTAL_VOLUME - oldPersonalVolume)
                                      : 0
                                  }
                                />
                              )}
                            </span>
                            {` ${t('user_profile.txt_more_to_become_bda')}`}

                            <Tooltip title={t('nft_detail.txt_no_of_shares_help')} overlayClassName='tooltip-detail'>
                              <img src={HelpIcon} />
                            </Tooltip>
                          </AppLink>
                        </span>
                      )}
                    </div>
                  </Col>
                  {isMobile && kycStatus === KYCStatus.VERIFIED && (
                    <Col span={24}>
                      <AppButton
                        onClick={copyClipBoard}
                        className='info_referral_button_referral mobile'
                        text={t('user_profile.txt_get_referral_link')}
                        variant='link'
                      />
                    </Col>
                  )}
                </Row>
              )}
            </Col>
          </Row>
        </div>
      </div>
    </>
  ) : (
    <></>
  );
};

export default UserProfile;
