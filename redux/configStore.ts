import { Dispatch } from 'react';
import createSagaMiddleware from 'redux-saga';
import storage from 'redux-persist/lib/storage';
import { createWrapper } from 'next-redux-wrapper';
import { configureStore, combineReducers, getDefaultMiddleware, EnhancedStore, AnyAction } from '@reduxjs/toolkit';
import { persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER, persistStore } from 'redux-persist';

import rootReducer from 'redux/rootReducer';
import rootSaga from 'redux/rootSaga';

import { namespace as AddressNamespace } from './address/slice';
import { namespace as AuthenticationNamespace } from './authentication/slice';
import { namespace as KycNameSpace } from './kyc/slice';

export let storeGlobal: EnhancedStore | undefined | any;

const persistConfig = {
  key: 'root',
  storage,
  whitelist: [AddressNamespace, AuthenticationNamespace, KycNameSpace],
  blacklist: [],
  timeout: null as any,
};

const NODE_ENV_DEVELOPMENT = 'development';

const persistedReducer = persistReducer(persistConfig, combineReducers(rootReducer));

function makeStore(preloadedState = {}) {
  const env = process.env.NODE_ENV;
  let store: any;
  const sagaMiddleware = createSagaMiddleware();
  const isClient = typeof window !== 'undefined';
  if (isClient) {
    store = configureStore({
      preloadedState,
      reducer: persistedReducer,
      devTools: env === NODE_ENV_DEVELOPMENT,
      middleware: [
        ...getDefaultMiddleware({
          thunk: false,
          serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            ignoredActionPaths: ['payload.callback'],
          },
        }),
        sagaMiddleware,
      ],
    });
    store.__persistor = persistStore(store);
    (store as any).sagaTask = sagaMiddleware.run(rootSaga);
    storeGlobal = store;
    return store;
  } else {
    const storeServer = configureStore({
      preloadedState,
      reducer: combineReducers(rootReducer),
      middleware: [
        ...getDefaultMiddleware({
          thunk: false,
        }),
        sagaMiddleware,
      ],
    });
    (storeServer as any).sagaTask = sagaMiddleware.run(rootSaga);
    return storeServer;
  }
}

export type AppState = ReturnType<AppStore['getState']>;

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = Dispatch<AnyAction>;

export const wrapper = createWrapper(makeStore, { debug: false });
