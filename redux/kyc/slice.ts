import { createSlice } from '@reduxjs/toolkit';
import omit from 'lodash/omit';

export interface Kyc {
  listKyc: any;
  cancelKyc: boolean;
}

const initialState: Kyc = {
  listKyc: {},
  cancelKyc: false,
};

export const KycSlice = createSlice({
  name: 'kyc',
  initialState,
  reducers: {
    handleSetCancelkyc: (state: Kyc, action: any) => {
      const cancelKyc = action.payload;
      return {
        ...state,
        cancelKyc,
      };
    },
    handleAddKyc: (state: Kyc, action: any) => {
      const { address, showPopupKycAgain } = action.payload;
      return {
        ...state,
        listKyc: {
          ...state.listKyc,
          [address]: {
            showPopupKycAgain,
          },
        },
      };
    },
  },
});

export const { handleSetCancelkyc, handleAddKyc } = KycSlice.actions;

export const namespace = 'KycSlice';

export default KycSlice.reducer;
