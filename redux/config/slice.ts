import { createSlice } from '@reduxjs/toolkit';

export interface Config {
  general: any;
}

const initialState: Config = {
  general: {},
};

export const ConfigSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    handleSetAppConfig: (state: Config, action: any) => {
      return {
        ...state,
        general: action.payload,
      };
    },
  },
});

export const { handleSetAppConfig } = ConfigSlice.actions;

export const namespace = 'ConfigSlice';

export default ConfigSlice.reducer;
