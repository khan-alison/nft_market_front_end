import { createSlice } from '@reduxjs/toolkit';
import omit from 'lodash/omit';

export interface Address {
  address: string;
  chainId: number | null;
  listAddress: any;
  connectedWalletType: string;
}

const initialState: Address = {
  address: '',
  chainId: null,
  listAddress: {},
  connectedWalletType: '',
};

export const AddressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    handleSetAddressNetwork: (state: Address, action: any) => {
      const { address, chainId } = action.payload;
      return {
        ...state,
        address,
        chainId,
      };
    },
    handleRemoveAddressNetwork: (state: Address, action: any) => {
      const { address } = action.payload;
      return {
        ...state,
        listAddress: omit(state?.listAddress, [address]),
        address: '',
        chainId: null,
      };
    },
    handleAddAddressNetWork: (state: Address, action: any) => {
      const { address, signature } = action.payload;
      return {
        ...state,
        listAddress: {
          ...state.listAddress,
          [address]: {
            address,
            signature,
          },
        },
      };
    },
    handleSetConnectedWalletType: (state: Address, action: any) => {
      return {
        ...state,
        connectedWalletType: action.payload,
      };
    },
  },
});

export const {
  handleSetAddressNetwork,
  handleAddAddressNetWork,
  handleRemoveAddressNetwork,
  handleSetConnectedWalletType,
} = AddressSlice.actions;

export const namespace = 'AddressSlice';

export default AddressSlice.reducer;
