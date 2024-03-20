import TokenLogo from 'public/svg/ustd_token.svg';
import { routeURLs } from './routes';

export const ORDERS = {
  ASC: 'asc',
  DESC: 'desc',
  FIELD: 'field',
  ORDER: 'order',
};

export const TOKEN_SUPPORT = {
  symbol: 'EKO',
  icon: TokenLogo,
  value: 'ageofgods',
};

export const WALLET_STATUS = {
  CANCEL_METAMASK: 4001,
  NOT_EXISTED_NETWORK: 4092,
};

export const MOBILE_SIZE = 768;
export const TABLET_SIZE = 1280;

export const SOCKET_EVENT = {
  NOTIFICATION: 'notification',
  REMOVE_FROM_SALE: 'removeFromSale',
  ADMIN_MINT: 'adminMint',
  BUY_NFT: 'buyNFT',
};

export const EVENT_NOTIFICATION = {
  ADMIN_PUT_ON_SALE: 'admin-put-on-sale',
  BUY_FROM_ADMIN: 'buy-from-admin',
  BUY_FROM_USER: 'buy-from-user',
  DEACTIVE_SELLORDER: 'deactive-sellorder',
  ACTIVE_SELLORDER: 'active-sellorder',
  DEACTIVE_SELLORDER_ADMIN: 'deactive-sellorder-admin',
};

export const KEY_STORAGE = {
  TOKEN: 'cookies-token',
};

export const ZERO_VALUE = 0;
export const MIN_NATIVE_VALUE = 1;
export const EMPTY_DEFAULT_TEXT = '--';
export const DOLLAR_TEXT = '$';
export const PAD_START_MAX_LENGTH = 4;
export const PAD_START_TEXT = '0';
export const SECOND_NUMBER = 60;
export const PERCENTAGE_NUMBER = 100;
export const FORMAT_DATE_PICKER = 'DD/MM/YYYY';
export const FORMAT_TIME_PICKER = 'HH:mm:ss';
export const FORMAT_DATETIME_PICKER = 'DD/MM/YYYY HH:mm:ss';
export const MAX_NFT_CODE_LENGTH = 10;
export const PAGE_TAB_QUERY = 'tab';

export const IMAGE_TYPE = 'image/png';

export const FILE_BINARY_SIZE = 1024;

export const IMAGE_MEDIUM_SIZE = {
  WIDTH: 300,
  HEIGHT: 300,
};

export const IMAGE_SMALL_SIZE = {
  WIDTH: 50,
  HEIGHT: 50,
};
export const UPLOAD_STATUS = {
  DONE: 'done',
  ERROR: 'error',
  OK: 'ok',
};

export const TAB_PANE = {
  INVENTORY: 'inventory',
  REFERRAL: 'referral',
  REDEMPTION: 'redemption',
  PURCHASE_HISTORY: 'purchase-history',
};

export enum TYPE_LOGIN {
  ADMIN = 'admin',
  USER = 'user',
}

export const DEFAULT_EMAIL_SIGNUP_VALUE = {
  username: "",
  email: "",
  password: ""
}
export const DEFAULT_EMAIL_LOGIN_VALUE = {
  email: "",
  password: ""
}

export const TYPE_NOTICE = {
  N1: 'N1',
  N2: 'N2',
  N3: 'N3',
  N4: 'N4',
  N5: 'N5',
  N6: 'N6',
  N7: 'N7',
  N8: 'N8',
  N9: 'N9',
  N10: 'N10',
  N11: 'N11',
  N12: 'N12',
  N13: 'N13',
  N14: 'N14',
  N15: 'N15',
  N16: 'N16',
  N17: 'N17',
};

export const INFO_KYC = [
  { name: 'home.txt_birth_date', value: 'birth_date' },
  { name: 'home.txt_birth_place', value: 'birth_place' },
  { name: 'home.txt_country', value: 'country' },
  { name: 'home.txt_expiry_date', value: 'expiry_date' },
  { name: 'home.txt_id_number', value: 'id_number' },
  { name: 'home.txt_issuance_date', value: 'issuance_date' },
  { name: 'home.txt_issuance_place', value: 'issuance_place' },
  { name: 'home.txt_given_names', value: 'given_names' },
];