import React from 'react';
import { Layout as LayoutAntd } from 'antd';

import Sider from './Sider';
import Content from './Content';
import { useRouter } from 'next/router';

const Layout = ({ children }: any) => {
  const router = useRouter();

  const selectedKey = `/${router.pathname?.split('/')[2]}`;

  const handleRedirectPage = (e: any) => router.push(e.key);

  return (
    <div>
      <LayoutAntd className='my-account-layout'>
        <Sider selectedKey={selectedKey} onRedirectPage={handleRedirectPage} />
        <LayoutAntd>
          <Content>{children}</Content>
        </LayoutAntd>
      </LayoutAntd>
    </div>
  );
};

export default Layout;
