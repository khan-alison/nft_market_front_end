import React from 'react';

import NumberFormat from '../NumberFormat';

import { formatCurrency } from 'utils';

import { NFT_OVERVIEW_DECIMAL_SCALE } from 'constants/nft';

type AppNumberProps = {
  value: number | any;
  decimalScale?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
};

const AppNumber = ({ value, decimalScale = NFT_OVERVIEW_DECIMAL_SCALE, ...props }: AppNumberProps) => {
  return (
    <NumberFormat
      thousandSeparator
      value={formatCurrency(value)}
      displayType='text'
      decimalScale={decimalScale}
      {...props}
    />
  );
};

export default AppNumber;
