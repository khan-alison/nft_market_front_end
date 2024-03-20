import React, { Fragment, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useWeb3React } from '@web3-react/core';
import { Tooltip } from 'antd';
import classNames from 'classnames';

import AppLink from '@components//AppLink';
import AppTable from '@components//AppTable';
import AppAddress from '@components//AppAddress';
import AppNumber from '@components//AppNumber';
import NumberFormat from '@components//NumberFormat';
import ListForSaleButton from '@components//ListForSaleButton';
import RemoveFromSaleButton from '@components//RemoveFromSaleButton';
import { NftDetailContext } from 'pages/nft/[id]';

import TooltipIcon from 'public/svg/tooltip_icon.svg';
import RedirectIcon from 'public/svg/redirect_icon.svg';

import selectedConnection from 'redux/connection/selector';
import { useAppSelector } from 'hooks/useStore';
import { useGetConfig } from 'hooks/useGetConfig';

import { formatCurrency, getRowKey } from 'utils';

import LENGTH_CONSTANTS from 'constants/length';
import { externalRoutes } from 'constants/routes';
import { EMPTY_DEFAULT_TEXT } from 'constants/common';
import { NFT_OWNED_STATUS, NFT_STATUS } from 'constants/nft';

const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = LENGTH_CONSTANTS;

const Owned = () => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  const { currency } = useGetConfig();
  const { isConnected } = useAppSelector(selectedConnection.getConnection);

  const {
    totalOwned,
    listOwned,
    loadingOwned,
    nftId,
    onGetOwned,
    address,
    nftDetail,
    isCompletedBuy,
    isCompletedRemoveFromSale,
    isCompletedListForSale,
    onSetSelectedNFT,
    selectedNFT,
  } = useContext(NftDetailContext) as any;

  const [params, setParams] = useState({
    page: DEFAULT_PAGE,
    limit: DEFAULT_PAGE_SIZE,
  }) as any;

  useEffect(() => {
    if (isConnected) {
      onGetOwned(nftId, params);
    }
  }, [params.page, params.limit]);

  useEffect(() => {
    if ((address && account) || isCompletedBuy || isCompletedListForSale || isCompletedRemoveFromSale) {
      onGetOwned(nftId, params, { onSetParams: setParams });
    }
  }, [address, account, isCompletedListForSale, isCompletedBuy, isCompletedRemoveFromSale]);

  const { limit, page } = params;

  const columns = [
    {
      title: t('nft_detail.txt_owned_token_id'),
      dataIndex: 'tokenId',
      key: 'tokenId',
      width: 100,
      ellipsis: true,
      render: (value: any) => {
        const tokenAddress = nftDetail?.token?.address;
        return (
          <div className='table-column-token-id'>
            <AppAddress address={value} isShorten={false} />
            <AppLink href={externalRoutes.POLYGON_SCAN_TOKEN(tokenAddress, value)} target='_blank' rel='noreferrer'>
              <img src={RedirectIcon} className='icon-direct' />
            </AppLink>
          </div>
        );
      },
    },
    {
      title: t('nft_detail.txt_owned_status'),
      width: 100,
      dataIndex: 'status',
      key: 'status',
      render: (value: any) => {
        const status = NFT_OWNED_STATUS.find((status) => status?.value === value) as any;
        return (
          <div className={classNames('table-column-status', `table-column-status-${status?.value}`)}>
            {t(status?.name)}
          </div>
        );
      },
    },
    {
      title: t('nft_detail.txt_owned_price'),
      width: 200,
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (value: any) => (
        <div className='table-column-price'>
          {value ? (
            <p className='symbol'>
              <NumberFormat thousandSeparator displayType='text' value={value} />
              &nbsp;
              <span>{currency?.symbol}</span>
            </p>
          ) : (
            EMPTY_DEFAULT_TEXT
          )}
        </div>
      ),
    },
    {
      title: t('nft_detail.txt_owned_quantity'),
      width: 100,
      dataIndex: 'quantity',
      key: 'quantity',
      render: (value: any, row: any) => {
        const { status, isInvalid } = row;

        const renderQuantityOwner = () => {
          switch (true) {
            case isInvalid:
              return (
                <Fragment>
                  <AppNumber value={row?.quantityForSale} />/<AppNumber value={value} />
                  <Tooltip
                    title={t('nft_detail.txt_invalid_tooltip', {
                      onSaleQuantity: formatCurrency(row?.quantityForSale),
                      quantity: formatCurrency(row?.quantity),
                    })}
                    overlayClassName='tooltip-detail'
                  >
                    <img className='icon' cursor-pointer src={TooltipIcon} />
                  </Tooltip>
                </Fragment>
              );
            case NFT_STATUS[1].value === status:
              return <AppNumber value={value} />;
            default:
              return (
                <Fragment>
                  <AppNumber value={row?.quantityForSale} />/<AppNumber value={value} />
                </Fragment>
              );
          }
        };

        return (
          <div className={classNames('table-column-quantity', { 'text-primary': isInvalid })}>
            {value ? renderQuantityOwner() : EMPTY_DEFAULT_TEXT}
          </div>
        );
      },
    },
    {
      title: '',
      width: 125,
      dataIndex: 'status',
      key: 'status',
      fixed: 'right',
      render: (value: any, row: any) => {
        const isOnsale = NFT_STATUS[0].value === value;
        const isOffSale = NFT_STATUS[1].value === value;
        return (
          <Fragment>
            <ListForSaleButton
              visibleButton={isOffSale}
              nft={{ ...nftDetail, ...row }}
              onSetSelectedNFT={onSetSelectedNFT}
              selectedNFT={selectedNFT}
            />
            <RemoveFromSaleButton
              visibleButton={isOnsale}
              nft={{ ...nftDetail, ...row }}
              onSetSelectedNFT={onSetSelectedNFT}
              selectedNFT={selectedNFT}
            />
          </Fragment>
        );
      },
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

  return (
    <AppTable
      columns={columns}
      total={totalOwned}
      dataSource={listOwned}
      loading={loadingOwned}
      pageSize={limit}
      current={page}
      onChangePagination={handleChangePaging}
      rowKey={getRowKey}
      scroll={{ x: 784 }}
      emptyText={t('message.E16')}
    />
  );
};

export default Owned;
