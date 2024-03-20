import React from 'react'
import { Typography } from 'antd';
import Link from 'next/link';
import CollectionForm from '@components//CommonForm/CollectionForm';
import { routeURLs } from 'constants/routes';

const { Title } = Typography;

const Collection = () => {
  return (
    <div className='collection-home'>
      <div className='container'>
        <div className='collection-head'>
          <Title level={4} className='title-collection'>Collection</Title>
          <Link href={routeURLs.COLLECTION}>Browse all</Link>
        </div>
        <CollectionForm />
      </div>
    </div>
  )
}

export default Collection;