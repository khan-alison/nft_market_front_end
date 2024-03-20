import React from 'react';

import General from './General';
import Footer from './Footer';

const Detail = () => {
  return (
    <div className='nft-detail-page'>
      <div className='nft-detail-page__wrapper'>
        <div className='container'>
          <General />
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default Detail;
