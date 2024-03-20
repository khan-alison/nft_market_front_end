import React, { FC, Fragment, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Select, Table as TableAntd } from 'antd';
import { TablePaginationConfig } from 'antd/lib/table';
import { FilterValue, GetRowKey, SorterResult, TableCurrentDataSource } from 'antd/lib/table/interface';
import { SizeType } from 'antd/lib/config-provider/SizeContext';

import AppPagination from '../AppPagination';

import Nodata from 'public/images/nodata_icon.png';
import PagingDownCaretIcon from 'public/svg/paging_down_caret_icon.svg';

import LENGTH_CONSTANTS from 'constants/length';
import { useMobile } from 'hooks/useWindowSize';

const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTIONS, DEFAULT_TOTAL } = LENGTH_CONSTANTS;

type AppTableProps = {
  columns?: Array<any>;
  dataSource?: readonly any[];
  current: number;
  pageSize?: number;
  total: number;
  rowClassName?: string;
  pageSizeOptions?: string[];
  onChangeTable?: (
    pagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<any> | SorterResult<any>[],
    extra: TableCurrentDataSource<any>,
  ) => void;
  onChangePagination?: (page: number, pageSize: number) => void;
  size?: SizeType;
  bordered?: boolean;
  rowKey?: string | GetRowKey<any>;
  className?: string;
  scroll?: any;
  loading?: boolean;
  showTotal?: boolean;
  showSizeChanger?: boolean;
  showPagination?: boolean;
  emptyText?: string;
  emptyImage?: boolean;
  rowSelection?: any;
  checkStrictly?: boolean;
  disabled?: boolean;
  showPaginate?: boolean;
};

const AppTable: FC<AppTableProps> = ({
  columns,
  dataSource,
  current,
  pageSize,
  total,
  rowClassName,
  pageSizeOptions,
  onChangeTable,
  onChangePagination,
  size,
  bordered,
  rowKey,
  className,
  scroll,
  emptyText,
  loading,
  emptyImage,
  rowSelection,
  disabled,
  showPaginate = true,
}) => {
  const { t } = useTranslation();

  const isMobile = useMobile();

  const handleMobilePageSizeChange = (value: string) =>
    onChangePagination && onChangePagination(current as number, parseInt(value) as number);

  const renderEmptyData = useMemo(() => {
    return (
      <div className='ant-empty-text'>
        {emptyImage && <img src={Nodata} />}
        <p>{emptyText || t('common.txt_no_data')}</p>
      </div>
    );
  }, [emptyText, emptyImage]);

  const pageSizeMobileOptions = pageSizeOptions?.map((size) => ({
    label: `${size}/page`,
    value: parseInt(size),
  }));

  return (
    <div className='app-table'>
      <TableAntd
        locale={{
          emptyText: renderEmptyData,
        }}
        pagination={false}
        columns={columns}
        bordered={bordered}
        rowClassName={rowClassName}
        dataSource={dataSource}
        onChange={onChangeTable}
        size={size}
        showSorterTooltip={false}
        rowKey={rowKey}
        className={className}
        scroll={scroll}
        loading={loading}
        rowSelection={rowSelection}
      />
      {isMobile && (
        <div className='app-table-mobile-size-changer'>
          <Select
            options={pageSizeMobileOptions}
            value={pageSize as any}
            className='mobile-size-changer'
            onChange={handleMobilePageSizeChange}
          />
        </div>
      )}
      {total > 0 && showPaginate && (
        <div className='app-table-pagination'>
          <AppPagination
            total={total}
            current={current}
            onChange={onChangePagination}
            pageSizeOptions={pageSizeOptions}
            pageSize={pageSize}
            showSizeChanger
            disabled={disabled}
          />
        </div>
      )}
    </div>
  );
};

AppTable.defaultProps = {
  pageSize: DEFAULT_PAGE_SIZE,
  pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
  total: DEFAULT_TOTAL,
  current: DEFAULT_PAGE,
};

export default AppTable;
