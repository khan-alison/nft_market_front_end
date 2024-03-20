import { createSlice } from '@reduxjs/toolkit';
import { omit } from 'lodash';

export interface ListNFT {
  nftDetail: any;
  isLoading: boolean;
}

const initialState: ListNFT = {
  nftDetail: {},
  isLoading: false,
};

export const NFTSlice = createSlice({
  name: 'nft',
  initialState,
  reducers: {
    getNftDetailSuccess: (state: ListNFT, action: any) => {
      const nftDetail = action.payload.nftDetail;
      const isLoading = action.payload.isLoading;

      return {
        ...state,
        nftDetail: nftDetail,
        isLoading: isLoading,
      };
    },
    resetData: (state: ListNFT, action) => {
      return initialState;
    },
  },
});

export const { getNftDetailSuccess, resetData } = NFTSlice.actions;

export const namespace = 'NFTSlice';

export default NFTSlice.reducer;
