import { useEffect } from 'react';

import { handleSetAppConfig } from 'redux/config/slice';
import { useAppDispatch } from './useStore';

import { checkSuccessRequest } from 'services/api';
import configServices from 'services/config';

export function useGetAppConfig() {
  const dispatch = useAppDispatch();

  const handleGetConfig = async () => {
    try {
      const response = await configServices.handleGetConfig();
      if (checkSuccessRequest(response)) {
        dispatch(handleSetAppConfig(response?.data));
      }
    } catch (error) {}
  };

  useEffect(() => {
    handleGetConfig();
  }, []);
}
