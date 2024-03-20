import { Col, Row } from 'antd';
import Link from 'next/link';
import React, { useRef } from 'react';
import NftTopImage1 from 'public/images/Rectangle_729.png';
import NftTopImage2 from 'public/images/Rectangle_727.png';
import Usdt from 'public/svg/ustd_token.svg';

const data = [
  {
    name: "Blog Title Digital Art",
    img: NftTopImage2,
    decs: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore..."
  },
  {
    name: "Blog Title Digital Art",
    img: NftTopImage1,
    decs: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore..."
  },
  {
    name: "Blog Title Digital Art",
    img: NftTopImage2,
    decs: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore..."
  },
  {
    name: "Blog Title Digital Art",
    img: NftTopImage2,
    decs: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore..."
  },
]
const BlogForm = () => {

  const CommonBlog = ({ blogVal, key }: any) => {
    return (
      <Col xs={24} md={8} lg={6} key={key}>
        <Link href="#">
          <a>
            <div className='blog-content'>
              <div className='blogImg'>
                <img src={blogVal?.img} alt='' />
              </div>
              <div className='blog-info'>
                <div className='content'>
                  <p className='title'>{blogVal?.name}</p>
                  <p className='decs'>{blogVal?.decs}</p>
                </div>
              </div>
            </div>
          </a>
        </Link>
      </Col>
    )
  }
  return (
    <div className='blog-card'>
      <Row gutter={24}>
        {data?.map((val, index) => (
          <CommonBlog blogVal={val} key={index} />
        ))}
      </Row>
    </div>
  )
}

export default BlogForm;