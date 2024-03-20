import React, { useState } from 'react';
import { Col, Row } from 'antd';

import Info from './Info';
import Preview from './Preview';
import Question from './Question';
import { useRouter } from 'next/router';
import { useGetNftDetail } from '@components//pages/nft/hooks';

const General = () => {
  const routes = useRouter();
  const { data }: any = useGetNftDetail(routes?.query?.id as string);
  const dataNftById: any = data?.data?.docs || [];
  return (
    <div className='nft-detail-page-general'>
      <Row>
        <Col lg={10} md={12} xs={24} xl={12} className='general__preview'>
          <Preview dataNftDetail={dataNftById}/>
        </Col>
        <Col lg={12} md={10} xs={24} xl={12} className='general__info'>
          <Info dataNftDetail={dataNftById} />
        </Col>
        {/* <Col xs={24}>
          <Question />
        </Col> */}
      </Row>
    </div>
  );
};

export default General;
