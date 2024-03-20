import React from 'react'
import { Col, Row, Typography } from 'antd';
import NftTopImage1 from 'public/images/Rectangle_711.png';
import NftTopImage2 from 'public/images/Rectangle_728.png';
import NftTopImage3 from 'public/images/Rectangle_731.png';
import Link from 'next/link';

const { Title } = Typography
const Outstanding = () => {
  return (
    <div className='outstanding-home'>
      <div className='container'>
        <Title level={4} className='title-outstanding'>Highlight</Title>
        <div className='outstanding-card'>
          <Row gutter={24}>
            <Col span={24} md={8}>
              <Link href="#">
                <a>
                  <div className='outstanding-content'>
                    <img src={NftTopImage1} alt='' />
                    <div className='outstanding-info'>
                      <p className='title'>Dead Dragon Bone</p>
                      <div className='price'>
                        <span>13,000 N1</span>
                        <span className='price-item'>~$1,600</span>
                      </div>
                      <span className='edition'>Edition 0/1</span>
                    </div>
                  </div>
                </a>
              </Link>
            </Col>
            <Col span={24} md={8}>
              <Link href="#">
                <a>
                  <div className='outstanding-content'>
                    <img src={NftTopImage2} alt='' />
                    <div className='outstanding-info'>
                      <p className='title'>Dead Dragon Bone</p>
                      <div className='price'>
                        <span>13,000 N1</span>
                        <span className='price-item'>~$1,600</span>
                      </div>
                      <span className='edition'>Edition 0/1</span>
                    </div>
                  </div>
                </a>
              </Link>
            </Col>
            <Col span={24} md={8}>
              {/* <Link href="#">
                <a> */}
                  <div className='outstanding-content'>
                    <img src={NftTopImage3} alt='' />
                    <div className='outstanding-info'>
                      <p className='title'>Dead Dragon Bone</p>
                      <div className='price'>
                        <span>13,000 N1</span>
                        <span className='price-item'>~$1,600</span>
                      </div>
                      <span className='edition'>Edition 0/1</span>
                    </div>
                  </div>
                {/* </a>
              </Link> */}
            </Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default Outstanding