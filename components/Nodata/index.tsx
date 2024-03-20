import React, { ReactNode } from 'react';
import { useTranslation } from 'next-i18next';
import { Image } from 'antd';

import NodataIcon from 'public/images/no_nft_icon.png';

type NodataProps = {
  emptyText?: string;
  emptySrc?: ReactNode | string | any;
};

const Nodata = ({ emptyText, emptySrc }: NodataProps) => {
  const { t } = useTranslation();
  return (
    <div className='no-data'>
      <Image src={emptySrc || NodataIcon} preview={false} className='no-data__img' />
      <p className='no-data__text'>{emptyText || t('common.txt_no_data')}</p>
    </div>
  );
};

export default Nodata;
