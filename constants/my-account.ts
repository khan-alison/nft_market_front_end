
export const REDEMPTION_CREATE_FIELD = {
  NAME: '_name',
  TOKEN_ID: '_owners.tokenId',
  MINTED_DATE: '_owners.mintedDate',
  REDEMPTION_VALUE: '_owners.redemptionValue',
  ACTION: '_action',
  INFORMATION: 'information',
};

export const REDEMPTION_FILTER = {
  START_TIME: 'startDate',
  END_TIME: 'endDate',
  NFT_ID: 'nftIds',
  STATUS: 'status',
  CREATOR_ADDRESS: 'creatorAddress',
  KEYWORD: 'keyword',
};

export const REDEMPTION_TYPE = {
  CREATE_REDEMPTION: 'create-redemption',
  CANCEL_REDEMPTION: 'cancel-redemption',
};

export enum RedemptionStatus {
  DRAFT = 'draft',
  PROCESSING = 'processing',
  SUBMITTED = 'submitted',
  REDEEMABLE = 'redeemable',
  CANCELED = 'canceled',
  REDEEMED = 'redeemed',
  FAILED = 'failed',
}

export const SUBMIT_STATUS = {
  PROCESSING: 'processing',
  FAIL: 'fail',
  SUCCESS: 'success',
};

export enum USER_TYPE {
  COMMON = 1,
  BDA = 2,
}

export enum KYCStatus {
  UNVERIFIED = 1,
  PENDING = 2,
  REJECTED = 3,
  VERIFIED = 4,
}

export const REFERRAL_TOTAL_VOLUME = 50000;

export const PURCHASE_HISTORY_LIST_FIELD = {
  CREATED_AT: 'createdAt',
  EVENT_NAME: 'eventName',
  ITEM: 'item',
  ITEM_NAME: 'item.name',
  NUMBER_CATEGORIES: 'numberCategories',
  QUANTITY: 'quantity',
  SUBTOTAL: 'subTotal',
  ACTION: 'action',
  PAGE: 'page',
  LIMIT: 'limit',
  INFORMATION: 'information',
  UNIT_PRICE: 'unitPrice',
  NO: 'no',
  SORT: 'sort',
  STATUS: 'status',
  CODE: 'code',
  PRICE: "price"
};

export const PURCHASE_HISTORY_FILTER = {
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  KEYWORD: 'keyword',
  NFT_IDS: 'nftIds',
};
