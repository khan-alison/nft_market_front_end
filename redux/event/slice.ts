import { createSlice } from '@reduxjs/toolkit';

export interface Event {
  listEventDetail: any;
  totalMint: number;
  totalQuantityForSale: number;
}

const initialState: Event = {
  listEventDetail: null,
  totalMint: 0,
  totalQuantityForSale: 0,
};

export const EventSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    getListEventDetail: (state: Event, action: any) => {
      let arrMint = null;
      let arrQuantity = null;

      arrMint = action?.payload?.categories?.reduce((previous: number, mint: any) => previous + mint?.totalMinted, 0);
      arrQuantity = action?.payload?.categories?.reduce(
        (previous: number, quantity: any) => previous + quantity?.quantityForSale,
        0,
      );

      return {
        ...state,
        listEventDetail: action.payload,
        totalMint: arrMint,
        totalQuantityForSale: arrQuantity,
      };
    },
  },
});

export const { getListEventDetail } = EventSlice.actions;

export const namespace = 'EventSlice';

export default EventSlice.reducer;
