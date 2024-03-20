import { useTranslation } from 'next-i18next';

import AppLink from '@components//AppLink';
import AppDropdown from '@components//AppDropdown';

import { renderURLs } from 'constants/routes';
import { Space } from 'antd';

const EcosystemDropdown = () => {
  const { t } = useTranslation();

  const overlay = () => {
    return (
      <div className='header-overlay'>
        <AppLink href={renderURLs.STAKING()}>
          <div className='item'>
            <span className='ml-0'>{t('home.txt_staking')}</span>
          </div>
        </AppLink>
        <AppLink href={renderURLs.LANDING_PAGE()}>
          <div className='item border-bottom-none'>
            <span className='ml-0'>{t('home.txt_landing_page')}</span>
          </div>
        </AppLink>
      </div>
    );
  };

  return (
    <AppDropdown overlay={overlay}>
      <Space>
        {t('home.txt_ecosystem')}
        <img src={''} />
      </Space>
    </AppDropdown>
  );
};

export default EcosystemDropdown;
