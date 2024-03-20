import { createSlice } from '@reduxjs/toolkit';

import { BUY_STEPS, LIST_FOR_SALE_STEPS, REMOVE_FROM_SALE_STEPS } from 'constants/nft';

const { START: startBuy } = BUY_STEPS;
const { START: startListForSale } = LIST_FOR_SALE_STEPS;
const { START: startRemoveFromSale } = REMOVE_FROM_SALE_STEPS;

export interface Action {
  buyStep?: number;
  listForSaleStep?: number;
  removeFromSaleStep?: number;
  transactionHash?: string;
  transactionId?: string;
  noticeCommission?: string;
}

const initialState: Action = {
  buyStep: startBuy,
  listForSaleStep: startListForSale,
  removeFromSaleStep: startRemoveFromSale,
  transactionHash: '',
  transactionId: '',
  noticeCommission: '',
};

export const ActionSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    handleSetBuyStep: (state: Action, action: any) => {
      return {
        ...state,
        buyStep: action.payload,
      };
    },

    handleSetListForSaleStep: (state: Action, action: any) => {
      return {
        ...state,
        listForSaleStep: action.payload,
      };
    },

    handleSetRemoveFromSaleStep: (state: Action, action: any) => {
      return {
        ...state,
        removeFromSaleStep: action.payload,
      };
    },

    handleSetTransactionHash: (state: Action, action: any) => {
      return {
        ...state,
        transactionHash: action.payload,
      };
    },

    handleSetTransactionId: (state: Action, action: any) => {
      return {
        ...state,
        transactionId: action.payload,
      };
    },

    handleSetNoticeCommission: (state: Action, action: any) => {
      return {
        ...state,
        noticeCommission: action.payload,
      };
    },
  },
});

export const {
  handleSetBuyStep,
  handleSetListForSaleStep,
  handleSetRemoveFromSaleStep,
  handleSetTransactionHash,
  handleSetTransactionId,
  handleSetNoticeCommission,
} = ActionSlice.actions;

export const namespace = 'ActionSlice';

export default ActionSlice.reducer;
