import { useMobile } from 'hooks/useWindowSize';

import LENGTH_CONSTANTS from 'constants/length';

const { DEFAULT_NFT_SIZE, DEFAULT_NFT_SIZE_MOBILE } = LENGTH_CONSTANTS;

export const useGetNFTSize = () => {
  const isMobile = useMobile();
  switch (isMobile) {
    case true:
      return DEFAULT_NFT_SIZE_MOBILE;
    default:
      return DEFAULT_NFT_SIZE;
  }
};
