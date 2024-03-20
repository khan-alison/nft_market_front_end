import { appWithTranslation, useTranslation } from 'next-i18next';
import { useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Web3ReactProvider } from '@web3-react/core';

import AppConnectWalletWrapper from '@components//AppConnectWalletWrapper';
import PublicLayout from '@components//Layout/Public';
import EllipsisText from '@components//EllipsisText';

import MaintainIcon from 'public/images/maintain_icon.png';
import MaintainMobileIcon from 'public/images/maintain_mobile_icon.png';

import { wrapper } from 'redux/configStore';
import { namespace as AuthenticationNamespace } from 'redux/authentication/slice';
import { useGetConfig } from 'hooks/useGetConfig';
import { useGetAppConfig } from 'hooks/useGetAppConfig';
import { useMobile } from 'hooks/useWindowSize';

import { getToken } from 'services/api';

import { LIBRARY_CONSTANTS } from 'constants/library';

import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';

import 'antd/dist/antd.css';
import 'swiper/css';
import 'swiper/css/navigation';
import '../styles/_app.scss';
import Cookies from 'js-cookie';
import { KEY_STORAGE } from 'constants/common';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { useSessionStorage } from 'hooks/useSessionStorage ';

declare let window: any;

const onBeforeLift = (store: any) => () => {
  const state = store.getState();
  getToken(state?.[AuthenticationNamespace]?.authenticationToken);
  Cookies.set(KEY_STORAGE.TOKEN, state?.[AuthenticationNamespace]?.authenticationToken, { sameSite: 'strict' });
};

const MyApp = ({ Component, pageProps }: any) => {
  const { t } = useTranslation();
  const store = useStore();
  const isMobile = useMobile();
  const router = useRouter();
  const { addressReferrer } = router.query;
  const firstUpdate = useRef(true);
  const [referrer, setReferrer] = useSessionStorage('referrer', '');

  const isClient = typeof window !== 'undefined';

  const getLayout = Component.getLayout ?? ((page: any) => page);

  // useGetAppConfig();
  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      addressReferrer ? setReferrer(addressReferrer) : setReferrer('');
    }
  }, [addressReferrer]);

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', () => {
        sessionStorage.clear();
        addressReferrer ? setReferrer(addressReferrer) : '';
      });
    }
  });

  const { isMaintenance } = useGetConfig();
  const [queryClient] = useState(() => new QueryClient());
  // const queryClient = new QueryClient();
  
  return (
    <QueryClientProvider client={queryClient} contextSharing={true}>
      <Web3ReactProvider getLibrary={LIBRARY_CONSTANTS.getLibrary}>
        {!isMaintenance ? (
          isClient ? (
            <PersistGate persistor={(store as any).__persistor} loading={null} onBeforeLift={onBeforeLift(store)}>
              <AppConnectWalletWrapper>{getLayout(<Component {...pageProps} />)}</AppConnectWalletWrapper>
            </PersistGate>
          ) : (
            <AppConnectWalletWrapper>
              <Component {...pageProps} />
            </AppConnectWalletWrapper>
          )
        ) : (
          <PublicLayout>
            <div className='maintain'>
              {isMobile ? <img src={MaintainMobileIcon} /> : <img src={MaintainIcon} />}
              <EllipsisText className='maintain__label' text={t('maintain.txt_on_the_way')} />
              <div className='maintain__content' dangerouslySetInnerHTML={{ __html: t('maintain.txt_thank_you') }} />
            </div>
          </PublicLayout>
        )}
      </Web3ReactProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default wrapper.withRedux(appWithTranslation(MyApp));
