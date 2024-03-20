import { PAGE_TAB_QUERY } from './common';
import ReDemptionIcon from 'public/svg/CalendarIcon';

export const routeURLs = {
  HOME: '/',
  STAKING: '/',
  LANDING_PAGE: '/',
  MY_ACTIVITIES: '/activity',
  ACCOUNT: '/my-account',
  COLLECTION: '/collection',

  MY_ACCOUNT: '/my-account',
  NFT: '/nft',
  NFT_ALL: '/nft-all',
  CREATE_NFT: '/nft/create',
  KYC: '/kyc-user',
  PAGE_404: '/404',
};

export const renderURLs = {
  STAKING: () => routeURLs.STAKING,
  LANDING_PAGE: () => routeURLs.LANDING_PAGE,
  MY_ACCOUNT: () => routeURLs.MY_ACCOUNT,
  ACCOUNT: () => routeURLs.ACCOUNT,
  COLLECTION: () => routeURLs.COLLECTION,
  CREATE_NFT: () => routeURLs.CREATE_NFT,

  MY_ACTIVITIES: (query: string) => `${routeURLs.MY_ACTIVITIES}?${PAGE_TAB_QUERY}=${query}`,
  LINK_REFERRAL: (address: string) => `${routeURLs.HOME}?addressReferrer=${address}`,

  NFT_DETAIL: (id: string | number) => `${routeURLs.NFT}/${id}`,
};

export const EXTERNAL_URL = {
  POLYGON_SCAN: 'https://mumbai.polygonscan.com/tx',
  POLYGON_SCAN_ADDRESS: 'https://mumbai.polygonscan.com/address',
  POLYGON_SCAN_TOKEN: 'https://mumbai.polygonscan.com/token',
};

export const externalRoutes = {
  POLYGON_SCAN: (transaction: string) => `${EXTERNAL_URL.POLYGON_SCAN}/${transaction}`,
  POLYGON_SCAN_ADDRESS: (address: string) => `${EXTERNAL_URL.POLYGON_SCAN_ADDRESS}/${address}`,
  POLYGON_SCAN_TOKEN: (contractAddress: string, tokenId: string) =>
    `${EXTERNAL_URL.POLYGON_SCAN_TOKEN}/${contractAddress}?a=${tokenId}`,
};

const routes = {
  privateRoutes: [
    {
      name: 'menu.txt_referral',
      path: routeURLs.HOME,
      component: '',
      exact: true,
      isShow: true,
      icon: ReDemptionIcon,
      keynumber: 2,
    },
  ],
};
export default routes;
