import React, { Fragment, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { CountdownCircleTimer } from 'react-countdown-circle-timer';
import { Switch } from 'antd';

import AppTab from '@components//AppTab';
import Owned from './Owned';
import Listing from './Listing';
import Activities from './Activities';
import noop from 'lodash/noop';
import { NftDetailContext } from 'pages/nft/[id]';

import selectedConnection from 'redux/connection/selector';

import { useAppSelector } from 'hooks/useStore';

import { formatCurrency } from 'utils';

import { NFT_ACTIVITIES_FIELDS, NFT_DETAIL_TABS, NFT_OWNED_FIELDS } from 'constants/nft';
import LoadingIcon from '@components//LoadingIcon';
import Search from './Search';
import { Formik } from 'formik';
import LENGTH_CONSTANTS from 'constants/length';
import ItemWithLabel from '@components//ItemWithLabel';
import AppNumber from '@components//AppNumber';
import { useGetOwned } from '../../hooks';
import selectedAddress from 'redux/address/selector';
import { useRouter } from 'next/router';

const { FROM, KEYWORD, UNTIL, REDEEM, PAGE, LIMIT } = NFT_OWNED_FIELDS;
const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = LENGTH_CONSTANTS;

const Info = () => {
  const { t } = useTranslation();
  const [params, setParams] = useState({
    [PAGE]: DEFAULT_PAGE,
    [LIMIT]: DEFAULT_PAGE_SIZE,
  });

  const {
    query: { id },
  } = useRouter() as any;

  const { data, total, loading } = useGetOwned(id, params) as any;

  const dataShow = data.map((value: any, index: any) => {
    return { ...value, key: `${value._id} - ${index}` };
  });

  const handleChangePaging = (page: number, limit: number) => {
    setParams({
      ...params,
      [PAGE]: limit !== params?.[LIMIT] ? LENGTH_CONSTANTS.DEFAULT_PAGE : page,
      limit,
    });
  };

  return (
    <Fragment>
      <Search onSetParams={setParams} params={params} />
      <ItemWithLabel label={`${t('nft_detail.txt_total_items')}:`} className='content-overview'>
        &nbsp; <AppNumber value={total} />
      </ItemWithLabel>
      <Listing
        listOwner={dataShow}
        total={total}
        params={params}
        page={params?.page as number}
        limit={params?.limit as number}
        loading={loading}
        handleChangePaging={handleChangePaging}
        onSetParams={setParams}
      />
    </Fragment>
  );
};

export default Info;
