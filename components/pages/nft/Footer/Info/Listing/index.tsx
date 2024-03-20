import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import AppTable from '@components//AppTable';
import { getRowKey, setOrderSorter, sortDirection } from 'utils';
import { columns } from './columns';
import { TablePaginationConfig } from 'antd';
import { FilterValue, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface';
import { SorterTable } from 'types';
import LENGTH_CONSTANTS from 'constants/length';
import { NFT_OWNED_FIELDS, ORDERS } from 'constants/nft';
import { useAppSelector } from 'hooks/useStore';
import selectorNft from 'redux/nft/selector';
import { useMobile } from 'hooks/useWindowSize';

type listOwnerProps = {
  total: number;
  listOwner: Array<any> | undefined;
  limit: number;
  page: number;
  loading: boolean;
  params: any;
  handleChangePaging: (page: number, limit: number) => void;
  onSetParams: Function;
};

const { PAGE, EVENT_NAME, REDEEM, INFORMATION } = NFT_OWNED_FIELDS;
const { DEFAULT_PAGE } = LENGTH_CONSTANTS;
const { ORDER, FIELD } = ORDERS;
const listColumnMobile = [REDEEM, INFORMATION];

const Listing = ({
  total,
  listOwner,
  limit,
  page,
  loading,
  handleChangePaging,
  params,
  onSetParams,
}: listOwnerProps) => {
  const { t } = useTranslation();
  const nftDetail = useAppSelector(selectorNft.getNftDetail);
  const isMobile = useMobile();

  const handleChangeTable = (
    _pagination: TablePaginationConfig,
    _filter: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
    _extra: TableCurrentDataSource<any>,
  ) => {
    const { order, field } = sorter as SorterTable;
    const newOrder = setOrderSorter(order);

    onSetParams({
      ...params,
      [ORDER]: newOrder,
      [PAGE]: DEFAULT_PAGE,
      [FIELD]: newOrder ? field : null,
    });
  };

  const columnsByStandard = (column?: any) => {
    if (column) {
      return columns(t, page, limit).filter((item: any) => !column.includes(item.key));
    }
    return columns(t, page, limit);
  };

  const columnsNFTBlackDiamond = columnsByStandard([EVENT_NAME, INFORMATION]);
  const columnsNFT = columnsByStandard([INFORMATION]);

  const renderColumns = nftDetail?.isNFTBlack ? columnsNFTBlackDiamond : columnsNFT;

  const columnIsMobile = columns(t, page, limit, nftDetail?.isNFTBlack).filter((item: any) =>
    listColumnMobile.includes(item.key),
  );
  return (
    <AppTable
      className={'table-list-item'}
      columns={isMobile ? columnIsMobile : renderColumns}
      total={total}
      dataSource={listOwner}
      loading={loading}
      pageSize={limit}
      current={page}
      onChangeTable={handleChangeTable}
      onChangePagination={handleChangePaging}
      rowKey={'key'}
      // scroll={{ x: 1200 }}
      emptyText={t('common.txt_no_data')}
    />
  );
};

export default Listing;
