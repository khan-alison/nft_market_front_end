import { useTranslation } from 'next-i18next';

import AppLink from '@components//AppLink';
import AppDropdown from '@components//AppDropdown';

import { renderURLs } from 'constants/routes';
import { Space } from 'antd';

import DropdownIcon from 'public/svg/dropdown_icon.svg';

const DocsDropdown = () => {
  const { t } = useTranslation();

  const overlay = () => {
    return (
      <div className='header-overlay'>
        <AppLink href={renderURLs.STAKING()}>
          <div className='item'>
            <span className='ml-0'>{t('home.txt_whitepaper')}</span>
          </div>
        </AppLink>
        <AppLink href={renderURLs.LANDING_PAGE()}>
          <div className='item'>
            <span className='ml-0'>{t('home.txt_terms_of_service')}</span>
          </div>
        </AppLink>
        <AppLink href={renderURLs.LANDING_PAGE()}>
          <div className='item'>
            <span className='ml-0'>{t('home.txt_privacy_policy')}</span>
          </div>
        </AppLink>
        <AppLink href={renderURLs.LANDING_PAGE()}>
          <div className='item border-bottom-none'>
            <span className='ml-0'>{t('home.txt_faqs')}</span>
          </div>
        </AppLink>
      </div>
    );
  };

  return (
    <AppDropdown overlay={overlay}>
      <Space style={{ cursor: 'pointer' }}>
        {t('home.txt_docs')}
        <img src={DropdownIcon} />
      </Space>
    </AppDropdown>
  );
};

export default DocsDropdown;
