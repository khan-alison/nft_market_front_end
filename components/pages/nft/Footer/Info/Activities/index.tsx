import React, { useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useWeb3React } from '@web3-react/core';
import { TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface';

import AppLink from '@components//AppLink';
import AppTable from '@components//AppTable';
import AppAddress from '@components//AppAddress';
import AppNumber from '@components//AppNumber';
import NumberFormat from '@components//NumberFormat';
import { NftDetailContext } from 'pages/nft/[id]';

import RedirectIcon from 'public/svg/redirect_icon.svg';

import selectedConnection from 'redux/connection/selector';

import { useAppSelector } from 'hooks/useStore';

import { formatDate, getRowKey, setOrderSorter } from 'utils';

import {
  NFT_ACTIVITIES_FIELDS,
  NFT_ACTIVITIES_FIELD_SORTER,
  NFT_SALE_ORDER_TYPE,
  NFT_TRANSACTION_EVENT,
} from 'constants/nft';
import { SorterTable } from 'types';
import LENGTH_CONSTANTS from 'constants/length';
import { externalRoutes } from 'constants/routes';
import { EMPTY_DEFAULT_TEXT } from 'constants/common';

const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = LENGTH_CONSTANTS;
const { PAGE, LIMIT } = NFT_ACTIVITIES_FIELDS;
const { QUANTITY, TYPE, CREATED_AT, TO_ADDRESS, FROM_ADDRESS, UNIT_PRICE, HASH } = NFT_ACTIVITIES_FIELD_SORTER;

const Activities = ({ isMyHistory }: { isMyHistory?: boolean }) => {
  const { t } = useTranslation();

  const { account } = useWeb3React();
  const {
    totalActivities,
    listActivities,
    loadingActivities,
    address,
    nftId,
    onGetActivities,
    isCompletedBuy,
    isCompletedRemoveFromSale,
    isCompletedListForSale,
  } = useContext(NftDetailContext) as any;
  const { isConnected } = useAppSelector(selectedConnection.getConnection);

  const [params, setParams] = useState({
    [PAGE]: DEFAULT_PAGE,
    [LIMIT]: DEFAULT_PAGE_SIZE,
  }) as any;

  useEffect(() => {
    onGetActivities(nftId, params);
  }, [nftId, params]);

  useEffect(() => {
    setParams({
      ...params,
      isMyHistory,
      page: DEFAULT_PAGE,
    });
  }, [isMyHistory]);

  useEffect(() => {
    if ((address && account) || isCompletedBuy || isCompletedListForSale || isCompletedRemoveFromSale) {
      setParams({
        ...params,
        page: DEFAULT_PAGE,
      });
    }
  }, [address, account, isCompletedBuy, isCompletedListForSale, isCompletedRemoveFromSale]);

  const { limit, page } = params;

  const columns = [
    {
      title: t('nft_detail.txt_activities_event'),
      dataIndex: TYPE,
      key: TYPE,
      width: 75,
      render: (value: any) => {
        const event = NFT_TRANSACTION_EVENT.find((event) => event?.value === value) as any;
        return <div className='table-column-event'>{t(event?.label)}</div>;
      },
    },
    {
      title: t('nft_detail.txt_activities_price'),
      width: 225,
      dataIndex: UNIT_PRICE,
      key: UNIT_PRICE,
      ellipsis: true,
      sorter: true,
      render: (_value: any, row: any) => {
        const { saleOrder = {} } = row;
        const { currency, unitPrice } = saleOrder;
        return (
          <div className='table-column-price'>
            <p className='symbol'>
              <NumberFormat thousandSeparator displayType='text' value={unitPrice} />
              &nbsp;
              <span>{currency?.symbol}</span>
            </p>
          </div>
        );
      },
    },
    {
      title: t('nft_detail.txt_activities_quantity'),
      width: 75,
      dataIndex: QUANTITY,
      key: QUANTITY,
      sorter: true,
      render: (value: any) => (
        <div className='table-column-quantity'>{value ? <AppNumber value={value} /> : EMPTY_DEFAULT_TEXT}</div>
      ),
    },
    {
      title: t('nft_detail.txt_activities_from'),
      width: 100,
      dataIndex: FROM_ADDRESS,
      key: FROM_ADDRESS,
      ellipsis: true,
      render: (_value: any, row: any) => {
        const { fromAddress, saleOrder = {} } = row;
        const isYou = isConnected && fromAddress && address === fromAddress;
        const isAdmin = saleOrder?.type === NFT_SALE_ORDER_TYPE.SELL;

        const renderAddressContent = () => {
          if (isYou) {
            return t('common.txt_you');
          } else if (isAdmin) {
            return t('common.txt_ekoios');
          } else return <AppAddress address={fromAddress} isVisibleCopy={false} />;
        };

        return <div className='table-column-address'>{renderAddressContent()}</div>;
      },
    },
    {
      title: t('nft_detail.txt_activities_to'),
      width: 100,
      dataIndex: TO_ADDRESS,
      key: TO_ADDRESS,
      ellipsis: true,
      render: (_value: any, row: any) => {
        const { toAddress, type } = row;
        const isYou = isConnected && toAddress && address === toAddress;
        const isAdmin = type === NFT_SALE_ORDER_TYPE.SELL;

        const renderAddressContent = () => {
          if (isYou) {
            return t('common.txt_you');
          } else if (isAdmin) {
            return t('common.txt_ekoios');
          } else return <AppAddress address={toAddress} isVisibleCopy={false} />;
        };

        return <div className='table-column-address'>{renderAddressContent()}</div>;
      },
    },
    {
      title: t('nft_detail.txt_activities_date'),
      width: 100,
      key: CREATED_AT,
      dataIndex: CREATED_AT,
      sorter: true,
      render: (value: any) => <div className='table-column-date'>{formatDate(value)}</div>,
    },
    {
      title: '',
      width: 50,
      key: HASH,
      dataIndex: HASH,
      render: (value: any) =>
        value && (
          <AppLink href={externalRoutes.POLYGON_SCAN(value)} target='_blank' rel='noreferrer'>
            <img src={RedirectIcon} />
          </AppLink>
        ),
    },
  ];

  const handleChangePaging = (page: number, pageSize: number) => {
    pageSize;
    setParams({
      ...params,
      page: pageSize !== limit ? LENGTH_CONSTANTS.DEFAULT_PAGE : page,
      limit: pageSize,
    });
  };

  const handleChangeTable = (
    _pagination: TablePaginationConfig,
    _filter: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
    _extra: TableCurrentDataSource<any>,
  ) => {
    const { order, field } = sorter as SorterTable;
    const newOrder = setOrderSorter(order);

    setParams({
      ...params,
      field,
      order: newOrder,
      page: DEFAULT_PAGE,
    });
  };

  return (
    <AppTable
      columns={columns}
      total={totalActivities}
      dataSource={listActivities}
      loading={loadingActivities}
      pageSize={limit}
      current={page}
      onChangeTable={handleChangeTable}
      onChangePagination={handleChangePaging}
      rowKey={getRowKey}
      scroll={{ x: 784 }}
      emptyText={isMyHistory ? t('message.E16') : t('message.E13')}
    />
  );
};

export default Activities;
