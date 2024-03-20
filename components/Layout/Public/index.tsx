import { FC } from 'react';
import { BackTop, Spin } from 'antd';
import { withTranslation } from 'next-i18next';

import AppSeo from '@components//AppSeo';
import Header from '@components//AppHeader';
import Footer from '@components//AppFooter';
import LoadingIcon from '@components//LoadingIcon';

import ChevronUpIcon from 'public/svg/chevron_up_icon.svg';

const Layout: FC<{
  children: any;
  title?: string;
  className?: string;
  notShowFooter?: boolean;
  notShowHeader?: boolean;
  socialImageUrl?: string;
  metaDescription?: string;
  faviconImageUrl?: string;
}> = ({
  children,
  className,
  title = '',
  notShowFooter,
  notShowHeader,
  socialImageUrl,
  faviconImageUrl,
  metaDescription,
}) => {
  return (
    <Spin indicator={<LoadingIcon />} spinning={false}>
      <AppSeo
        title={title}
        socialImageUrl={socialImageUrl}
        faviconImageUrl={faviconImageUrl}
        metaDescription={metaDescription}
      />

      <div className={className}>
        {!notShowHeader && <Header />}
        <div className='app-content'>
          <BackTop>
            <div className='scroll-to-top'>
              <img src={ChevronUpIcon} />
            </div>
          </BackTop>
          {children}
        </div>

        {!notShowFooter && <Footer />}
      </div>
    </Spin>
  );
};

export default withTranslation('common')(Layout);
