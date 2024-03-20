import React from 'react'
import { Typography } from 'antd';
import BlogForm from '@components//CommonForm/BlogForm';
import Link from 'next/link';

const { Title } = Typography;

const Blog = () => {
  return (
    <div className='blog-home'>
      <div className='container'>
      <div className='blog-head'>
          <Title level={4} className='title-blog'>Blog</Title>
          <Link href="#">Browse all</Link>
        </div>
        <BlogForm />
      </div>
    </div>
  )
}

export default Blog