import selectedConfig from 'redux/config/selector';

import { useAppSelector } from './useStore';

import { TOKEN_SUPPORT } from 'constants/common';

export function useGetConfig() {
  const { general = {} } = useAppSelector(selectedConfig.getConfig);
  const {
    currencies = [],
    mintingQuantityMax = 0,
    attributes = [],
    ipfsGateway,
    isMaintenance,
    userMintingQuantityMax = 0,
    systems = [],
  } = general;

  const selectedCurrency = currencies?.find((currency: any) => currency?.name === TOKEN_SUPPORT.value);
  return {
    currency: { ...selectedCurrency, icon: TOKEN_SUPPORT.icon },
    mintingQuantityMax,
    attributes,
    ipfsGateway,
    currencies,
    isMaintenance,
    userMintingQuantityMax,
    systems,
  };
}
