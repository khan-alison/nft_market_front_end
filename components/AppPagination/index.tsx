import React from 'react';
import { Pagination } from 'antd';
import classNames from 'classnames';

import NextPaginationIcon from 'public/svg/next_pagination_icon.svg';
import PrevPaginationIcon from 'public/svg/prev_pagination_icon.svg';

import LENGTH_CONSTANTS from 'constants/length';

const { DEFAULT_PAGE_SIZE, DEFAULT_PAGE_SIZE_OPTIONS, DEFAULT_TOTAL, DEFAULT_PAGE } = LENGTH_CONSTANTS;

type AppPaginationProps = {
  onChange?: (page: number, pageSize: number) => void;
  pageSizeOptions?: string[];
  current?: number;
  pageSize?: number;
  total: number;
  showSizeChanger?: boolean;
  className?: string;
  renderPagination?: any;
  disabled?: boolean;
};

const AppPagination = ({
  onChange,
  pageSizeOptions,
  pageSize,
  showSizeChanger,
  current,
  total,
  className,
  renderPagination,
  disabled,
  ...props
}: AppPaginationProps) => {
  const renderCustomPagination = (_current: number, type: string, originalElement: any) => {
    if (type === 'prev') {
      return (
        <div className='paging-icon prev-icon'>
          <img src={PrevPaginationIcon} />
        </div>
      );
    }
    if (type === 'next') {
      return (
        <div className='paging-icon next-icon'>
          <img src={NextPaginationIcon} />
        </div>
      );
    }
    return originalElement;
  };

  return (
    <Pagination
      total={total}
      current={current}
      pageSize={pageSize}
      itemRender={renderPagination || renderCustomPagination}
      onChange={onChange}
      className={classNames('app-pagination', className)}
      showSizeChanger={showSizeChanger}
      pageSizeOptions={pageSizeOptions}
      disabled={disabled}
      {...props}
    />
  );
};

AppPagination.defaultProps = {
  pageSize: DEFAULT_PAGE_SIZE,
  pageSizeOptions: DEFAULT_PAGE_SIZE_OPTIONS,
  total: DEFAULT_TOTAL,
  current: DEFAULT_PAGE,
};

export default AppPagination;
