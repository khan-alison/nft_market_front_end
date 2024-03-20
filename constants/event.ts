export enum EventStatus {
  LIVE = 1,
  COMING_SOON = 2,
  END = 3,
  DRAFT = 4,
}

export const EVENT_TYPE_VALUE = {
  PUBLIC: 'public',
  WHITELIST: 'whitelist',
};
export const EVENT_STATUS_VALUE = {
  LIVE: 1,
  COMING_SOON: 2,
  ENDED: 3,
  DRAFT: 4,
  CANCEL: 5,
};

export const NFT_ACTIVITIES_FIELDS = {
  KEYWORD: 'keyword',
  STATUS: 'status',
  STARTDATE: 'startDate',
  ENDDATE: 'endDate',
  TYPE: 'type',
  NFTIDS: 'nftIds',
  QUANTITY: 'quantity',
};
