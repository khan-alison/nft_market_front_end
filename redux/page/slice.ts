import { createSlice } from '@reduxjs/toolkit';
export interface page {
  asPath: string;
  profile: any;
}

const initialState: page = {
  asPath: '',
  profile: {},
};

export const PageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    handleRoutePage: (state: page, action: any) => {
      const asPath = action.payload;
      return {
        ...state,
        asPath: asPath,
      };
    },
    handleGetProfile: (state: page, action: any) => {
      return {
        ...state,
        profile: action.payload,
      };
    },
  },
});

export const { handleRoutePage, handleGetProfile } = PageSlice.actions;

export const namespace = 'PageSlice';

export default PageSlice.reducer;
