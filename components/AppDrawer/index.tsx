import React, { Fragment, ReactNode } from 'react';
import { Drawer } from 'antd';
import classNames from 'classnames';

type AppDrawerProps = {
  title?: string;
  visible?: boolean;
  onToggleDrawer?: any;
  toogleElement?: ReactNode;
  children?: ReactNode;
  className?: string;
  placement: 'top' | 'right' | 'bottom' | 'left' | undefined;
  height?: string | number;
};

const AppDrawer = ({ onToggleDrawer, visible, toogleElement, children, className, ...props }: AppDrawerProps) => {
  return (
    <Fragment>
      {toogleElement}
      <Drawer onClose={onToggleDrawer} visible={visible} className={classNames('app-drawer', className)} {...props}>
        {children}
      </Drawer>
    </Fragment>
  );
};

export default AppDrawer;
