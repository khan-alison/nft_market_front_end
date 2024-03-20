import { ListNFT } from './slice';

const selectorNft = {
  getNftDetail: (state: any) => state?.NFTSlice?.nftDetail,
};

export default selectorNft;
