import { Avatar, Button } from 'antd'
import React from 'react'
import NftTopImage1 from 'public/images/Rectangle_711.png';

const OwnersTab = () => {
  return (
    <div className='owners-tab'>
      <div className='owners-tab-item'>
        <div className='owners-item-content'>
          <Avatar
            size={{ xs: 35, sm: 35, md: 35, lg: 35, xl: 40, xxl: 40 }}
            icon={<img src={NftTopImage1} alt='' />}
            className='owners-avatar'
          />
          <div className='owners-info'>
            <p>Rachel1200</p>
            <p>1/10 on sale</p>
          </div>
        </div>
        <Button className='btn-buy'>Buy</Button>
      </div>
      <div className='owners-tab-item'>
        <div className='owners-item-content'>
          <Avatar
            size={{ xs: 35, sm: 35, md: 35, lg: 35, xl: 40, xxl: 40 }}
            icon={<img src={NftTopImage1} alt='' />}
            className='owners-avatar'
          />
          <div className='owners-info'>
            <p>Rachel1200</p>
            <p>1/10 on sale</p>
          </div>
        </div>
        <Button className='btn-buy'>Buy</Button>
      </div>
    </div>
  )
}

export default OwnersTab