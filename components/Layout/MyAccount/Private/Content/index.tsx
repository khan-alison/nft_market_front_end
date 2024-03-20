import React, { ReactNode } from 'react';
import { Layout } from 'antd';

const { Content: ContentAntd } = Layout;

const Content = ({ children }: { children: ReactNode }) => {
  return <ContentAntd className='app-content'>{children}</ContentAntd>;
};

export default Content;
