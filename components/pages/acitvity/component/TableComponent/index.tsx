import React, { useCallback, useMemo } from 'react';
import Table from '@components//AppTable';
import { sortDirection } from 'utils';
import { columns, columnsMobile } from './columns';
import { useTranslation } from 'next-i18next';
import LENGTH_CONSTANTS from 'constants/length';
import { PURCHASE_HISTORY_LIST_FIELD } from 'constants/my-account';
import { useMobile } from 'hooks/useWindowSize';
import AppNumber from '@components//AppNumber';

const { DEFAULT_PAGE_SIZE_OPTIONS } = LENGTH_CONSTANTS;
const { INFORMATION } = PURCHASE_HISTORY_LIST_FIELD;

type TableComponentProps = {
  loading?: boolean;
  data: any;
  paramSearch: any;
  setParamSearch: Function;
  currentColumn?: any;
};

const TableComponent: React.FC<TableComponentProps> = ({
  loading,
  data,
  paramSearch,
  setParamSearch,
  currentColumn,
}) => {
  const { t } = useTranslation();
  const isMobile = useMobile();

  const dataSource = useMemo(() => {
    return data?.map((item: any, index: number) => ({
      ...item,
      no: index + 1,
      key: index,
      action: item?._id,
      [INFORMATION]: item,
    }));
  }, [data]);

  const onChangePagination = useCallback(
    (page: any, pageSize: any) => {
      setParamSearch((prevData: any) => ({
        ...prevData,
        limit: pageSize,
        page: page,
      }));
    },
    [setParamSearch],
  );

  const onSortChange = useCallback((pagination: any, filter: any, sorter: any) => {
    const { order, field } = sorter;
    setParamSearch((prevData: any) => {
      for (const key of Object.keys(prevData)) {
        if (key.includes('sort')) {
          delete prevData[key];
        }
      }
      return {
        ...prevData,
        [`sort[${field}]`]: sortDirection(order),
      };
    });
  }, []);

  return (
    <div className='table-component'>
      <div className='table-component__total'>
        <div>
          {t('common.total_redemption_value')}:<AppNumber value={data?.totalRedemptionValue || 0} prefix='$' />
        </div>
        <div>
          {t('common.total_request')}:<AppNumber value={data?.totalDocs || 0} />
        </div>
      </div>
      <Table
        loading={loading}
        columns={isMobile ? columnsMobile(t, currentColumn) : columns(t, currentColumn)}
        dataSource={dataSource}
        pageSizeOptions={DEFAULT_PAGE_SIZE_OPTIONS}
        pageSize={paramSearch?.limit}
        total={data?.totalDocs}
        current={data?.page}
        onChangePagination={(page: any, pageSize: any) => {
          onChangePagination(page, pageSize);
        }}
        onChangeTable={onSortChange}
        emptyText={t('common.txt_no_matched_data', { itemName: t('user_profile.txt_redemption') })}
      />
    </div>
  );
};

export default TableComponent;
