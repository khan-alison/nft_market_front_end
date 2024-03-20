import { createSlice } from '@reduxjs/toolkit';
import { KEY_STORAGE } from 'constants/common';
import Cookies from 'js-cookie';

export interface Authentication {
  authenticationToken: string;
}

const initialState: Authentication = {
  authenticationToken: '',
};

export const AuthenticationSlice = createSlice({
  name: 'authentication',
  initialState,
  reducers: {
    handleSetAuthenticationToken: (state: Authentication, action: any) => {
      const token = action.payload;
      return {
        ...state,
        authenticationToken: token,
      };
    },
  },
});

export const { handleSetAuthenticationToken } = AuthenticationSlice.actions;

export const namespace = 'AuthenticationSlice';

export default AuthenticationSlice.reducer;
