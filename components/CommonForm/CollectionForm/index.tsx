import { Avatar, Col, Row } from 'antd';
import Link from 'next/link';
import React, { useRef } from 'react';
import NftTopImage1 from 'public/images/Rectangle_711.png';
import NftTopImage2 from 'public/images/Rectangle_728.png';
import Usdt from 'public/svg/ustd_token.svg';

const data = [
  {
    name: "Soul World",
    img: NftTopImage2,
    decs: "ERC-721"
  },
  {
    name: "Monsters Of The Sea",
    img: NftTopImage1,
    decs: "ERC-721"
  },
  {
    name: "Last War On Hell",
    img: NftTopImage2,
    decs: "ERC-721"
  },
  {
    name: "Blog Title Digital Art",
    img: NftTopImage2,
    decs: "ERC-721"
  },
]
const CollectionForm = () => {

  const CommonCollection = ({ collectionVal, key }: any) => {
    return (
      <Col xs={24} md={8} lg={6} key={key}>
        <Link href="#">
          <a>
            <div className='collection-content'>
              <div className='collectionImg'>
                <img src={collectionVal?.img} alt='' />
              </div>
              <div className='collection-info'>
                <div className='content'>
                  <p className='title'>{collectionVal?.name}</p>
                  <p className='decs'>{collectionVal?.decs}</p>
                </div>
              </div>
              <Avatar
                  size={{ xs: 64, sm: 64, md: 64, lg: 64, xl: 80, xxl: 100 }}
                  icon={<img src={collectionVal?.img} alt='' />}
                  className='avatar'
                />
            </div>
          </a>
        </Link>
      </Col>
    )
  }
  return (
    <div className='collection-card'>
      <Row gutter={24}>
        {data?.map((val, index) => (
          <CommonCollection collectionVal={val} key={index} />
        ))}
      </Row>
    </div>
  )
}

export default CollectionForm;