export const REFERRAL_LIST_FIELD = {
  NO: 'no',
  CREATED_AT: 'createdAt',
  TRANSACTION_DATE: 'transactionDate',
  DIRECT_REFEREE: 'address',
  REFERRER_TYPE: 'referrerType',
  USER_TYPE: 'userType',
  TOTAL_VALUE: 'totalValue',
  STATUS: 'status',
  TOTAL_MEMBER: 'totalMember',
  TOTAL_VOLUME: 'totalVolume',
  TOTAL_EARNINGS: 'totalEarnings',
  PERSONAL_VOLUME: 'personalVolume',
  TOTAL_SOLD: 'totalTokenSold',
  TOTAL_SOLD_ITEMS: 'personalTokenSold',
  ACTION: 'action',
  ADDRESS: 'address',
  TOTAL_REFEREE: 'directReferee',
  REFERRER: 'referrer',
  BUYER: 'buyer',
  SUBTOTAL: 'subTotal',
  NAME_NFT: 'nameNft',
  EARNINGS: 'earnings',
  EVENTNAME: 'eventName',
  COMMISSION: 'commision',
  QUANTITY: 'quantity',
  INFORMATION: 'information',
};
export const REFERRAL_TOTAL_NETWORK = [
  {
    title: 'referral.total_lines',
    name: 'totalLines',
  },
  {
    title: 'referral.txt_total_member',
    name: 'totalMembers',
  },
  {
    title: 'referral.total_items_sold',
    name: 'totalTokenSold',
  },
  {
    title: 'referral.txt_total_volume',
    name: 'totalVolume',
  },
];
export const REFERRAL_TOTAL_COMMISSION = [
  {
    title: 'referral.txt_total_volume',
    name: 'totalVolume',
  },
  {
    title: 'referral.txt_total_earnings',
    name: 'totalEarnings',
  },
  {
    title: 'referral.txt_category',
    name: 'itemCategories',
  },
  {
    title: 'referral.txt_total_transaction',
    name: 'totalDocs',
  },
];
export const REFERRAL_TOTAL_NETWORK_DETAIL = [
  {
    title: 'referral.txt_direct_referee',
    name: 'directReferree',
  },
  {
    title: 'referral.txt_total_member',
    name: 'totalMembers',
  },
  {
    title: 'referral.total_items_sold',
    name: 'totalTokenSold',
  },
  {
    title: 'referral.txt_total_volume',
    name: 'totalVolume',
  },
];
export const REFERRAL_OWNED_FIELDS = {
  KEYWORD: 'keyword',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  PAGE: 'page',
  LIMIT: 'limit',
  SORT: 'sort',
  CREATED_AT: 'createdAt',
  USERTYPE: 'userType',
  NFT_IDS: 'nftIds',
};
export const REFERRAL_TYPE = {
  COMMON: 1,
  BDA: 2,
};
export const REFERRAL_TYPE_NAME = {
  [REFERRAL_TYPE.COMMON]: 'common.common',
  [REFERRAL_TYPE.BDA]: 'common.BDA',
};

export enum MEMBER_FILTER_TYPE {
  COMMON = 1,
  BDA = 2,
}
