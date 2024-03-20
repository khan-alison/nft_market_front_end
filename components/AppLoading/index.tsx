import React, { ReactNode } from 'react';
import { Spin } from 'antd';

import LoadingIcon from 'components/LoadingIcon';

type AppLoadingProps = {
  loading?: boolean;
  children?: ReactNode;
  src?: string;
};

const AppLoading = ({ loading, children, src, ...props }: AppLoadingProps) => {
  return (
    <Spin spinning={loading} indicator={<LoadingIcon src={src} />} {...props}>
      {children}
    </Spin>
  );
};

export default AppLoading;
