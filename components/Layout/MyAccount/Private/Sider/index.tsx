import React, { Fragment, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Layout, Menu } from 'antd';
import classNames from 'classnames';

import MenuIcon from 'public/svg/back_icon.svg';

import routes from 'constants/routes';

const { Sider: SiderAntd } = Layout;
const { Item } = Menu;

type SiderType = {
  selectedKey: string;
  onRedirectPage: (e: any) => void;
};

const Sider = ({ selectedKey, onRedirectPage }: SiderType) => {
  const { t } = useTranslation();
  const [collapsed, setCollapsed] = useState(false);

  const handleToggleCollapse = () => setCollapsed(!collapsed);

  return (
    <SiderAntd trigger={null} collapsible className='my-account-sider' width={215} collapsed={collapsed}>
      <div
        className={classNames('my-account-sider__top', {
          'justify-content-center': collapsed,
          'justyfy-content-between': !collapsed,
        })}
      >
        <img src={MenuIcon} onClick={handleToggleCollapse} className='top__bar' />
      </div>
      <Menu className='my-account-sider__menu' mode='inline' selectedKeys={[`/my-account${selectedKey}`]}>
        {routes.privateRoutes.map(({ icon: Icon, name, isShow, path }: any, index: number) => (
          <Fragment key={index}>
            {isShow && (
              <Item className='my-account-sider__menu--item' key={path} icon={<Icon />} onClick={onRedirectPage}>
                {t(name)}
              </Item>
            )}
          </Fragment>
        ))}
      </Menu>
    </SiderAntd>
  );
};

export default Sider;
