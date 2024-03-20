import React, { Fragment } from 'react';
import { useTranslation } from 'next-i18next';
import { Col, Row } from 'antd';

import AppLink from '../AppLink';

import AppLogo from 'public/images/logo_icon.webp';
import FooterBackground from 'public/images/footer_background.png';
import EmailIcon from 'public/svg/email_icon.svg';
import InstagramIcon from 'public/svg/instagram_contact_icon.svg';
import TwitterIcon from 'public/svg/twitter_contact_icon.svg';
import YoutubeIcon from 'public/svg/youtube_contact_icon.svg';
import FacebookIcon from 'public/svg/facebook_contact_icon.svg';

import { routeURLs } from 'constants/routes';

type FooterProps = Record<string, never>;

type FooterInfoItem = {
  href: string;
  text?: string;
  icon?: string;
  prefixIcon?: string;
};

const Footer: React.FC<FooterProps> = ({}) => {
  const { t } = useTranslation();

  const infoAbout = [
    {
      text: t('home.txt_terms_of_service'),
      href: '#',
    },
    {
      text: t('home.txt_privacy_policy'),
      href: '#',
    },
    {
      text: t('home.txt_faqs'),
      href: '#',
    },
  ];

  const infoEcosystem = [
    {
      text: t('home.txt_landing_page'),
      href: '#',
    },
    {
      text: t('home.txt_minting'),
      href: '#',
    },
    {
      text: t('home.txt_staking'),
      href: '#',
    },
  ];

  const infoContact = [
    {
      text: t('home.txt_email'),
      href: `mailto:${t('home.txt_email')}`,
    },
    { text: `+ ${t('home.txt_phone_number')}`, href: `tel:+${t('home.txt_phone_number')}` },
  ];

  const groupIcon = [
    { icon: TwitterIcon, href: '#' },
    { icon: FacebookIcon, href: '#' },
    { icon: YoutubeIcon, href: '#' },
    { icon: InstagramIcon, href: '#' },
  ];

  const renderFooterItem = ({ href, text, icon, prefixIcon }: FooterInfoItem) => {
    return (
      <AppLink href={href}>
        {prefixIcon && <img src={prefixIcon} className='contact__icon' />}
        {text && <span className='app-button'>{text}</span>}
        {icon && <img className='icon' src={icon} />}
      </AppLink>
    );
  };

  return (
    <footer id='footer' className='app-footer'>
      <div className='container'>
        <Row className='app-footer__body'>
          <Col md={6}>
            <AppLink href={routeURLs.HOME}>
              <img src={AppLogo} className='app-logo' />
            </AppLink>
            <div className='logo-title'>{t('home.txt_footer_under_logo')}</div>
          </Col>
          <Col md={6} xs={12}>
            <div className='title'>{t('home.txt_about')}</div>
            {infoAbout.map((item, index) => (
              <div key={index} className='contact'>
                {renderFooterItem(item)}
              </div>
            ))}
          </Col>
          <Col md={6} xs={12}>
            <div className='title'>{t('home.txt_ecosystem')} </div>
            {infoEcosystem.map((item, index) => (
              <div key={index} className='ecosystem'>
                {renderFooterItem(item)}
              </div>
            ))}
          </Col>
          <Col md={6}>
            <div className='title'>{t('home.txt_contact')} </div>
            {infoContact.map((item, index) => (
              <div key={index} className='contact'>
                {renderFooterItem(item)}
              </div>
            ))}
            <div className='description__group-icon'>
              {groupIcon.map((item, index) => (
                <Fragment key={index}>{renderFooterItem(item)}</Fragment>
              ))}
            </div>
          </Col>
        </Row>
      </div>
      <div className='copy-right'>{t('home.txt_copy_right')}</div>
    </footer>
  );
};

export default Footer;
