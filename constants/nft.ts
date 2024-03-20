export const NFT_DECIMAL_SCALE = 8;
export const NFT_OVERVIEW_DECIMAL_SCALE = 2;
export const MIN_VALUE_TOTAL_COPIES = 1;
export const NFT_PREFIX_CODE = '#';
export const NFT_PERCENTAGE_SUFFIX = '%';
export const MAX_LENGTH_TOTAL_SUPPLY = 7;
export const MAX_LENGTH_PRICE = 12;
export const NFT_DECIMAL_SCALE_PRICE = 18;
export const MAX_VALUE_TOTAL_COPIES = 1000000;

export const MAX_FILE_NUMBER = 1;
export const MAX_FILE_SIZE = 100;
export const MAX_PREVIEW_SIZE = 2;
export const LIST_PREVIEW_SUPPORT_FILE = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/gif'];

export const LIST_SUPPORT_FILE = [
  'image/png',
  'image/jpeg',
  'image/svg+xml',
  'image/gif',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
  'audio/webm',
  'video/ogg',
  'video/mp4',
  'video/webm',
  '3d/glb',
];
export const NFT_DEFAULT_CREATE_FIELD = {
  FILE: 'file',
  FILE_PREVIEW: 'filePreview',
  NAME: 'name',
  ROYALTYFEE: 'royaltyFee',
  TOTAL_SUPPLY: 'totalSupply',
  DESCRIPTION: 'description',
  IS_PUT_ON_SALE: 'isPutOnSale',
  QUANTITY: 'quantity',
  UNIT_PRICE: 'unitPrice',
  CURRENCY: 'currency',
  IMAGE_MEDIUM: 'imageMedium',
  IMAGE_SMALL: 'imageSmall',
};

export const NFT_STANDARD = [
  { value: 'erc-721', key: 0, label: 'common.txt_erc_721' },
  { value: 'erc-1155', key: 1, label: 'common.txt_erc_1155' },
];

export const ACTIVITIES_TYPE = [
  { value: 'erc-721', label: 'common.txt_owners' },
  { value: 'erc-1155', label: 'common.txt_offer' },
];
export const DEFAULT_INIT = {
  NAME: 'name',
  DESCRIPTION: 'description',
  ATTRIBUTES: 'attributes',
  TRAIT_TYPE:'trait_type',
  VALUE:'value',
  IPFS_URL: 'ipfsUrl',
  FILE: 'file'
}
export const EXTENSION_3D_SUPPORT_ARRAY = ['3d/glb'];

export const NFT_TABS = {
  OWNERS: {
    key: 'OWNERS',
    label: 'common.txt_owners',
    type: 'Owners',
    query: 'Owners',
  },
  OFFER: {
    key: 'OFFER',
    label: 'common.txt_offer',
    type: 'Offer',
    query: 'item',
  },
};

export const NFT_STATUS = [
  { name: 'home.txt_for_sale', value: 'on-sale' },
  { name: 'home.txt_not_for_sale', value: 'off-sale' },
];

export const NFT_OWNED_STATUS = [
  { name: 'common.txt_on_sale', value: 'on-sale' },
  { name: 'common.txt_off_sale', value: 'off-sale' },
];

export const NFT_SALE_ORDER_TYPE = {
  SELL: 'sell',
  RESELL: 'resell',
};

export const NFT_TRANSACTION_EVENT = [
  { value: 'listed', label: 'nft_detail.txt_listed' },
  { value: 'delisted', label: 'nft_detail.txt_delisted' },
  { value: 'minted', label: 'nft_detail.txt_bought' },
  { value: 'transfer', label: 'nft_detail.txt_bought' },
];

export const NFT_MANAGEMENT_DEFAULT_FIELD = {
  KEYWORD: 'keyword',
  STATUS: 'status',
  PAGE: 'page',
  LIMIT: 'limit',
  SORT: 'sort',
  ISOWNED: 'isOwned',
};

export const NFT_MANAGEMENT_ATTRIBUTE_FIELD = {
  TYPE: 'type',
  CLASS: 'class',
  GOD: 'god',
  MYTHOLOGY: 'mythology',
  LEVEL: 'level',
};

export const BUY_FIELD = {
  QUANTITY: 'quantity',
  SALE_ORDER_ID: 'saleOrderId',
  TYPE: 'type',
};

export const BUY_TRANSACTION = {
  TYPE: 'type',
  NFT_ID: 'nftId',
  QUANTITY: 'quantity',
  TO_ADDRESS: 'toAddress',
  EVENT_ID: 'eventId',
};

export const LIST_FOR_SALE_FIELD = {
  QUANTITY: 'quantity',
  UNIT_PRICE: 'unitPrice',
  TOKEN_ID: 'tokenId',
  CURRENCY: 'currency',
  TYPE: 'type',
  AMOUNT: 'amount',
  PRICE: 'price',
};

export const ATTRIBUTE_EXCLUDE = ['type', 'god'];

export const NFT_MEDIA = {
  IMAGE: 'image',
  AUDIO: 'audio',
  VIDEO: 'video',
  MODEL: '3d',
};

export const NFT_MIME_TYPE = ['image/gif'];

export const NFT_DEFAULT_FIELD = {
  NAME: 'name',
  TOTAL_SUPPLY: 'totalSupply',
  TOTAL_FOR_SALE: 'totalForSale',
};

export const NFT_MANAGEMENT_SORTER = [
  {
    label: 'home.txt_highest_price',
    field: 'unitPrice',
    order: 'desc',
    value: 1,
  },
  {
    label: 'home.txt_lowest_price',
    field: 'unitPrice',
    order: 'asc',
    value: 2,
  },
  {
    label: 'home.txt_new_arrivals',
    field: 'createdAt',
    order: 'desc',
    value: 3,
  },
];

export const NFT_TRANSACTION_TYPE = {
  LISTED: 'listed',
  DELISTED: 'delisted',
  MINTED: 'minted',
  TRANSFER: 'transfer',
  ADMIN_MINTED: 'admin-minted',
};

export const NFT_TRANSACTION_STATUS = {
  DRAFT: 'draft',
  SUCCESS: 'success',
  CANCEL: 'cancel',
  FAILED: 'failed',
};

export const MY_NFTS_SORTER = [
  {
    label: 'home.txt_highest_price',
    field: 'unitPrice',
    order: 'desc',
    value: 1,
  },
  {
    label: 'home.txt_lowest_price',
    field: 'unitPrice',
    order: 'asc',
    value: 2,
  },
  {
    label: 'home.txt_recently_bought',
    field: 'updatedAt',
    order: 'desc',
    value: 3,
  },
];

export const NFT_LISTING_FIELD_SORTER = {
  REMAIN: 'remain',
  DEFAULT: 'default',
  UNIT_PRICE: 'unitPrice',
  CREATED_AT: 'createdAt',
};

export const NFT_ACTIVITIES_FIELD_SORTER = {
  HASH: 'hash',
  TYPE: 'type',
  DEFAULT: 'default',
  QUANTITY: 'quantity',
  CREATED_AT: 'createdAt',
  TO_ADDRESS: 'toAddress',
  FROM_ADDRESS: 'fromAddress',
  UNIT_PRICE: 'saleOrder.unitPrice',
  SUB_TOTAL: 'subTotal',
  NFT_NAME: 'nft.name',
  REVENUE: 'revenue',
  PROFIT: 'profit',
};

export const BUY_STEPS = {
  START: 0,
  PROCESSING: 1,
  SUCCESSFUL: 2,
  FAILED: 3,
  CANCEL: 4,
};

export const LIST_FOR_SALE_STEPS = {
  START: 0,
  PROCESSING: 1,
  SUCCESSFUL: 2,
  FAILED: 3,
  CANCEL: 4,
};

export const REMOVE_FROM_SALE_STEPS = {
  START: 0,
  PROCESSING: 1,
  SUCCESSFUL: 2,
  FAILED: 3,
  CANCEL: 4,
};

export const NFT_DETAIL_TABS = {
  LISTING: {
    key: 'LISTING',
    label: 'nft_detail.txt_listing',
  },
  ACTIVITIES: {
    key: 'ACTIVITIES',
    label: 'nft_detail.txt_activities',
  },
  OWNED: {
    key: 'OWNED',
    label: 'nft_detail.txt_owned',
  },
};

export const ANTD_ORDERS = {
  ASCEND: 'ascend',
  DESCEND: 'descend',
};

export const ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
  FIELD: 'field',
  ORDER: 'order',
};

export const NFT_ACTIVITIES_TABS = {
  PURCHASE_HISTORY: {
    key: 'PURCHASE_HISTORY',
    label: 'my_activities.txt_purchase_history',
    query: 'purchase-history',
  },
  SALE_HISTORY: {
    key: 'SALE_HISTORY',
    label: 'my_activities.txt_sales_history',
    query: 'sale-history',
  },
};

export const NFT_ACTIVITIES_FIELDS = {
  KEYWORD: 'keyword',
  FROM: 'from',
  UNTIL: 'until',
  PAGE: 'page',
  LIMIT: 'limit',
  SORT: 'sort',
  QUANTITY: 'quantity',
  TYPE: 'tokenStandard',
};

export const NFT_OWNED_FIELDS = {
  KEYWORD: 'keyword',
  FROM: 'fromMintDate',
  UNTIL: 'toMintDate',
  PAGE: 'page',
  REDEEM: 'isRedeem',
  LIMIT: 'limit',
  SORT: 'sort',
  TOKEN_ID: 'tokenId',
  CREATED_AT: 'createdAt',
  MINT_DATE: 'owners.mintedDate',
  EVENT_NAME: 'owners.event.name',
  REDEEMABLE: 'redeemable',
  INFORMATION: 'information',
  DEFAULT: 'default',
};

export const TOKEN_STATUS = {
  LOCKING: 'locked',
  UNLOCKING: 'unlocked',
  REDEEMING: 'redeemed',
  BURNT: 'burned',
  INVALID: 'invalid',
};
