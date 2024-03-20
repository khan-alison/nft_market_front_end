import BigNumber from 'bignumber.js';
import moment from 'moment';

import { EMPTY_DEFAULT_TEXT, IMAGE_TYPE, MAX_NFT_CODE_LENGTH, ZERO_VALUE } from 'constants/common';
import LENGTH_CONSTANTS from 'constants/length';
import { ANTD_ORDERS, EXTENSION_3D_SUPPORT_ARRAY, MAX_LENGTH_PRICE, NFT_MEDIA, ORDERS } from 'constants/nft';
import { EVENT_STATUS_VALUE } from 'constants/event';

declare let window: any;

const { MIN_VALUE } = LENGTH_CONSTANTS;

export const DATE_FORMAT = 'MMMM DD, YYYY  HH:mm:ss';

export const clearRequestParams = (params?: any) => {
  const newParams = {} as any;
  const cloneParams = { ...params };
  for (const field in cloneParams) {
    if (cloneParams?.[field] || cloneParams?.[field] === 0 || cloneParams?.[field] === false) {
      newParams[field] = cloneParams?.[field];
    }
  }
  return newParams;
};

export const formatDate = (date: moment.MomentInput | any, type = DATE_FORMAT) => {
  return date ? moment(date).format(type) : EMPTY_DEFAULT_TEXT;
};

export const disabledEventFromDate = (date: any) => (current: moment.Moment) => {
  return date && current?.clone()?.endOf('day') > date?.clone()?.endOf('day');
};

export const disabledEventToDate = (date: any) => (current: moment.Moment) => {
  return date && current?.clone()?.startOf('day') < date?.clone()?.startOf('day');
};

export const getLocation = () => {
  return typeof window !== 'undefined' ? window.location.href : '';
};

export const shortenAddress = (address: string, number = -4) => {
  if (address) {
    if (address.length < 10) return address;
    const first = address.slice(0, 6);
    const last = address.slice(number);
    return `${first}...${last}`;
  }
  return;
};

export const formatPadStart = (value: any) => {
  if (!value) {
    return EMPTY_DEFAULT_TEXT;
  }
  return value.length > MAX_NFT_CODE_LENGTH ? shortenAddress(value) : value;
};

export const formatCurrency = (value: any) => {
  if (!value) {
    return ZERO_VALUE;
  }
  return new BigNumber(value).isLessThan(new BigNumber(MIN_VALUE))
    ? new BigNumber(MIN_VALUE).toFormat()
    : new BigNumber(value).toFormat();
};

export const getNumberValue = (value?: number) => {
  return value ?? ZERO_VALUE;
};

export const convertPriceBigNumber = (value: any, coinDecimal = 18) => {
  BigNumber.config({
    EXPONENTIAL_AT: 100,
  });
  return new BigNumber(value).multipliedBy(new BigNumber(Math.pow(10, coinDecimal)));
};

export const isLessThanOfTenPowerByCap = (value: any, dicimal: 8) => {
  BigNumber.config({
    EXPONENTIAL_AT: 100,
  });
  return value > 0 && new BigNumber(value).lt(new BigNumber(Math.pow(10, dicimal)));
};

export const multipleTwoBigNumber = (first: any, second: any) => {
  if (!first || !second) {
    return 0;
  }
  BigNumber.config({
    EXPONENTIAL_AT: 100,
  });
  return new BigNumber(first).multipliedBy(new BigNumber(second)).toString();
};

export const convertToNumber = (value: any) => {
  return value ? new BigNumber(value).toNumber() : ZERO_VALUE;
};

export const limitMaxlengNumber =
  (maxLength: number = MAX_LENGTH_PRICE) =>
  (inputObj: any) => {
    const ZERO_CHARACTER = 0;
    const ONE_CHARACTER = 1;
    const { value } = inputObj;
    const integerPath = (value || '').split('.')[0];
    const isDemacial = value?.toString()?.includes('.');
    const maxSpecialCharacter = isDemacial ? ONE_CHARACTER : ZERO_CHARACTER;
    return integerPath.length <= maxLength + maxSpecialCharacter;
  };

export const getValueAttributes = (attributes: any, field: string) => attributes?.[field]?.text || attributes?.[field];

export const getImageAttributes = (attributes: any, field: string) => attributes?.[field]?.imgUrl;

export const getRowKey = (row: any) => row?._id;

export const setOrderSorter = (order: string | null | undefined) => {
  const newOrder =
    (order === ANTD_ORDERS.ASCEND && ORDERS.ASC) || (order === ANTD_ORDERS.DESCEND && ORDERS.DESC) || null;
  return newOrder;
};

export const getStartDateTimestamp = (value: string) => {
  if (!value) {
    return;
  }
  return moment(value).clone().startOf('days').toISOString();
};

export const getEndDateTimestamp = (value: string) => {
  if (!value) {
    return;
  }
  return moment(value).clone().endOf('days').toISOString();
};

export const nFormatter = (num: any, digits: any = 2) => {
  const lookup = [
    { value: 1, symbol: '' },
    { value: 1e3, symbol: 'K' },
    { value: 1e6, symbol: 'M' },
    { value: 1e9, symbol: 'B' },
    { value: 1e12, symbol: 'T' },
    { value: 1e15, symbol: 'P' },
    { value: 1e18, symbol: 'E' },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item ? (num / item.value).toFixed(digits).replace(rx, '$1') + item.symbol : Number(num).toFixed(8);
};

export const sortDirection = (order: string) => {
  switch (order) {
    case 'descend':
      return ORDERS.DESC;
    case 'ascend':
      return ORDERS.ASC;
    default:
      return null;
  }
};

export const sortDirectionNumber = (order: string) => {
  switch (order) {
    case 'descend':
      return -1;
    case 'ascend':
      return 1;
    default:
      return null;
  }
};

export const sleep = async (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
};

export const compareDate = (date1: any, date2: any) => {
  if (moment(date1).isBefore(date2)) {
    return -1;
  }
  if (moment(date1).isAfter(date2)) {
    return 1;
  }
  return 0;
};

export const compareEvent = (firstEvent: any, secondEvent: any) => {
  if (firstEvent.status === secondEvent.status) {
    const sortDate =
      firstEvent.status === EVENT_STATUS_VALUE.COMING_SOON
        ? compareDate(firstEvent?.startDate, secondEvent?.startDate)
        : compareDate(firstEvent?.endDate, secondEvent?.endDate);
    if (sortDate === 0) {
      return firstEvent?.name.localeCompare(secondEvent?.name);
    }
    return sortDate;
  }

  if (firstEvent.status === EVENT_STATUS_VALUE.LIVE) {
    return -1;
  }

  if (secondEvent.status === EVENT_STATUS_VALUE.LIVE) {
    return 1;
  }

  if (firstEvent.status === EVENT_STATUS_VALUE.COMING_SOON) {
    return -1;
  }

  if (secondEvent.status === EVENT_STATUS_VALUE.COMING_SOON) {
    return 1;
  }
};

export const get3DFileType = (fileName: string) => {
  const extension = fileName?.slice(fileName?.lastIndexOf('.') + 1)?.toLowerCase() || '';
  const type = `3d/${extension}`;
  if (EXTENSION_3D_SUPPORT_ARRAY.includes(type)) {
    return type;
  }
  return '';
};

export const getFullFormatedNFT = (value: any) => {
  return value?.fileList?.[0]?.type || get3DFileType(value?.fileList?.[0]?.name) || IMAGE_TYPE;
};

export const getFormatedNFT = (value: any) => {
  const fullFormat = getFullFormatedNFT(value);
  return fullFormat?.split('/')[0] || NFT_MEDIA.IMAGE;
};