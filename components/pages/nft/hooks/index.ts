import { useEffect, useState } from 'react';
import router, { useRouter } from 'next/router';
import omit from 'lodash/omit';

import selectedAddress from 'redux/address/selector';
import selectedConnection from 'redux/connection/selector';

import { useAppDispatch, useAppSelector } from 'hooks/useStore';

import nftServices from 'services/nft';
import { checkSuccessRequest, checkSusscessRequest } from 'services/api';
import transactionServices from 'services/transaction';

import { routeURLs } from 'constants/routes';
import LENGTH_CONSTANTS from 'constants/length';
import { MIN_NATIVE_VALUE, ORDERS, ZERO_VALUE } from 'constants/common';
import {
  NFT_ACTIVITIES_FIELDS,
  NFT_LISTING_FIELD_SORTER,
  NFT_ACTIVITIES_FIELD_SORTER,
  NFT_OWNED_FIELDS,
} from 'constants/nft';
import { useMutation, useQuery, UseQueryResult } from 'react-query';
import { getNftDetailSuccess } from 'redux/nft/slice';
import { get } from 'lodash';
import TYPE_CONSTANTS from 'constants/type';
import showMessage from '@components//Message';

const { ORDER, FIELD, ASC, DESC } = ORDERS;
const { DEFAULT_PAGE } = LENGTH_CONSTANTS;
const { SORT, PAGE, LIMIT } = NFT_ACTIVITIES_FIELDS;
const {
  CREATED_AT: listingCreatedAt,
  REMAIN: listingRemain,
  UNIT_PRICE: listingUnitPrice,
  DEFAULT: listingDefault,
} = NFT_LISTING_FIELD_SORTER;
const {
  CREATED_AT: activitiesCreatedAt,
  QUANTITY: activitiesQuantity,
  UNIT_PRICE: activitiesUnitPrice,
  DEFAULT: activitiesDefault,
} = NFT_ACTIVITIES_FIELD_SORTER;

const { MINT_DATE, EVENT_NAME, DEFAULT } = NFT_OWNED_FIELDS;

export const useGetListNFTs = () => {
  const { address } = useAppSelector(selectedAddress.getAddress);
  const [total, setTotal] = useState(ZERO_VALUE);
  const [listNfts, setListNfts] = useState([]);

  const handleGetListNFTs = async () => {

    try {

      const response = await nftServices.handleGetList();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const useFetchListNFTs: any = useQuery(['getListNft', address], handleGetListNFTs, {
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      const { docs = [], totalDocs = 0, summary = [] } = get(res, 'data');

      setListNfts(docs);
      setTotal(totalDocs);
    },
  });

  const { isLoading } = useFetchListNFTs;

  return {
    listNfts: listNfts,
    total,
    loading: isLoading,
    data: useFetchListNFTs.data,
  };
};

export const useGetListOwnerNFTs = () => {
  const { address } = useAppSelector(selectedAddress.getAddress);
  const [total, setTotal] = useState(ZERO_VALUE);
  const [listNfts, setListNfts] = useState([]);

  const handleGetListOwnerNFTs = async () => {

    try {

      const response = await nftServices.handleGetOwnerListNft();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const useFetchListNFTs: any = useQuery(['getOwnerNft', address], handleGetListOwnerNFTs, {
    refetchOnWindowFocus: false,
    onSuccess: (res) => {
      const { docs = [], totalDocs = 0, summary = [] } = get(res, 'data');

      setListNfts(docs);
      setTotal(totalDocs);
    },
  });

  const { isLoading } = useFetchListNFTs;

  return {
    listNfts: listNfts,
    total,
    loading: isLoading,
    data: useFetchListNFTs.data,
  };
};

export const useGetNftDetail = (id: string) => {
  const dispatch = useAppDispatch();
  const handleGetNftDetailQuery: any = async () => {
    try {
      const response = await nftServices.handleGetNftDetail(id);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const useQueryGetDetailNft: UseQueryResult = useQuery(['getDetailNft', id], handleGetNftDetailQuery, {
    refetchOnWindowFocus: false,
    enabled: !!id,
    onSuccess: (res: any) => {
      if (checkSuccessRequest(res)) {
        const { docs = [] } = get(res, 'data');
        const nftDetail = docs[0];

        dispatch(
          getNftDetailSuccess({
            nftDetail: { ...nftDetail },
            isLoading,
          }),
        );
      } else {
        router.push(routeURLs.HOME);
      }
    },
  });
  const { isLoading } = useQueryGetDetailNft;

  return {
    loading: isLoading,
    useQueryGetDetailNft: useQueryGetDetailNft,
    data: useQueryGetDetailNft.data
  };
};
export const useMintNFT = () => {
  const router = useRouter();

  const handleMintNFT = useMutation(
    async (params: any) => {

      const paramMint = {
        totalSupply: params?.totalSupply, hash:params?.hash
      }
      try {
        const response = await nftServices.handleMintNft(params?.id, paramMint);
        return { response };
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: (res: any) => {
        if (checkSusscessRequest(res?.response)) {

          showMessage(TYPE_CONSTANTS.MESSAGE.SUCCESS, 'message.S6');
          // router.push(renderURLs.NFT_DETAIL(idNft));
          setTimeout(() => router.reload(),1000)
        }
      },
    },
  );

  return {
    onMintNFT: handleMintNFT.mutate,
    loadingMint: handleMintNFT.isLoading,
  };
};

export const usePutOnSaleNFT = () => {
  const router = useRouter();

  const handlePutOnSaleNFT = useMutation(
    async (params: any) => {

      const paramPutOnSale = {
        price: params?.price, hashPutOnSale:params?.hashPutOnSale
      }
      try {
        const response = await nftServices.handlePutOnSaleNft(params?.id, paramPutOnSale);
        return { response };
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: (res: any) => {
        if (checkSusscessRequest(res?.response)) {

          showMessage(TYPE_CONSTANTS.MESSAGE.SUCCESS, 'message.S7');
          // router.push(renderURLs.NFT_DETAIL(idNft));
          setTimeout(() => router.reload(),1000)
        }
      },
    },
  );

  return {
    onPutOnSaleNFT: handlePutOnSaleNFT.mutate,
    loadingPutOnSale: handlePutOnSaleNFT.isLoading,
  };
};

export const useBuyNFT = () => {
  const router = useRouter();

  const handleBuyNFT = useMutation(
    async (params: any) => {

      try {
        const response = await nftServices.handleBuyNft(params);
        return { response };
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: (res: any) => {
        if (checkSusscessRequest(res?.response)) {

          showMessage(TYPE_CONSTANTS.MESSAGE.SUCCESS, 'message.S10');
          // router.push(renderURLs.NFT_DETAIL(idNft));
          setTimeout(() => router.reload(),1000)
        }
      },
    },
  );

  return {
    onBuyNFT: handleBuyNFT.mutate,
    loadingBuyNFT: handleBuyNFT.isLoading,
  };
};


export const useGetOwned = (id: string, params?: any, options?: any) => {
  const [data, setData] = useState([]);
  const [owned, setOwned] = useState(0);
  const [total, setTotal] = useState(0);

  const { isConnected } = useAppSelector(selectedConnection.getConnection);

  useEffect(() => {
    if (!isConnected) {
      setOwned(0);
      setData([]);
      setTotal(0);
    }
  }, [isConnected]);

  const INDEXED_SORTER = {
    [DEFAULT]: { [MINT_DATE]: DESC },
    [MINT_DATE]: { [MINT_DATE]: ASC, [MINT_DATE]: DESC },
    [EVENT_NAME]: { [EVENT_NAME]: ASC, [EVENT_NAME]: DESC },
  };

  const handleGetOwned = async () => {
    try {
      const newParams = omit({ ...params }, [FIELD, ORDER]) as any;
      const field = params?.[FIELD] || listingDefault;
      for (const key in INDEXED_SORTER?.[field]) {
        if (key === field && params?.[ORDER] && params?.[FIELD]) {
          newParams[`${SORT}[${key}]`] = params?.[ORDER];
        } else {
          newParams[`${SORT}[${key}]`] = INDEXED_SORTER?.[field]?.[key];
        }
      }

      for (const key in newParams) {
        if (!newParams[key]) {
          delete newParams[key];
        }
      }

      const response = await nftServices.handleGetOwned(id, newParams);
      return response;
    } catch (error) {
      throw error;
    } finally {
    }
  };

  const useQueryGetOwnedNft: UseQueryResult = useQuery(['getOwnedNft', id, params], handleGetOwned, {
    refetchOnWindowFocus: false,
    enabled: !!id || !!params,
    onSuccess: (res: any) => {
      if (checkSuccessRequest(res)) {
        const onSetParams = options?.onSetParams;

        const { docs = [], totalQuantity, totalDocs } = res?.data || {};
        setData(docs);
        setOwned(totalQuantity);
        setTotal(totalDocs);
        if (params?.[PAGE] >= totalDocs / params?.[LIMIT] && params?.[PAGE] !== DEFAULT_PAGE) {
          onSetParams &&
            onSetParams({
              ...params,
              [PAGE]: DEFAULT_PAGE,
            });
        }
      }
    },
  });

  const { isLoading } = useQueryGetOwnedNft;

  return {
    data,
    owned,
    isLoading,
    total,
    useQueryGeOwnedNft: useQueryGetOwnedNft,
  };
};

export const useGetListing = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const INDEXED_SORTER = {
    [listingCreatedAt]: { [listingCreatedAt]: DESC },
    [listingUnitPrice]: { [listingUnitPrice]: ASC, [listingCreatedAt]: DESC },
    [listingDefault]: { [listingUnitPrice]: ASC, [listingCreatedAt]: DESC },
    [listingRemain]: { [listingRemain]: DESC, [listingUnitPrice]: ASC, [listingCreatedAt]: DESC },
  };

  const handleGetListing = async (id: string, params?: any, notSetLoading?: boolean, options?: any) => {
    const onSetParams = options?.onSetParams;
    if (!notSetLoading) {
      setLoading(true);
    }

    try {
      const newParams = omit({ ...params }, [FIELD, ORDER]) as any;

      const field = params?.[FIELD] || listingDefault;

      for (const key in INDEXED_SORTER?.[field]) {
        if (key === field && params?.[ORDER] && params?.[FIELD]) {
          newParams[`${SORT}[${key}]`] = params?.[ORDER];
        } else {
          newParams[`${SORT}[${key}]`] = INDEXED_SORTER?.[field]?.[key];
        }
      }

      const response = await nftServices.handleGetListing(id, newParams);

      if (checkSuccessRequest(response)) {
        const { docs = [], totalDocs } = response?.data || {};
        setData(docs);
        setTotal(totalDocs);

        const balance = totalDocs % params?.[LIMIT];
        const subtractPage = balance > ZERO_VALUE ? MIN_NATIVE_VALUE : ZERO_VALUE;

        if (params?.[PAGE] >= totalDocs / params?.[LIMIT] && params?.[PAGE] !== DEFAULT_PAGE) {
          onSetParams &&
            onSetParams({
              ...params,
              [PAGE]: DEFAULT_PAGE,
            });
        }
      }
    } catch (error) {
    } finally {
      if (!notSetLoading) {
        setLoading(false);
      }
    }
  };

  return {
    data,
    loading,
    total,
    onGetListing: handleGetListing,
  };
};

export const useGetActivities = () => {
  const [data, setData] = useState(0);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const INDEXED_SORTER = {
    [activitiesCreatedAt]: { [activitiesCreatedAt]: DESC },
    [activitiesUnitPrice]: { [activitiesUnitPrice]: ASC, [activitiesCreatedAt]: DESC },
    [activitiesDefault]: { [activitiesUnitPrice]: ASC, [activitiesCreatedAt]: DESC },
    [activitiesQuantity]: { [activitiesQuantity]: DESC, [activitiesUnitPrice]: ASC, [activitiesCreatedAt]: DESC },
  };

  const handleGetActivities = async (id: string, params?: any) => {
    setLoading(true);
    const field = params?.[FIELD] || activitiesDefault;

    try {
      const newParams = omit({ ...params }, [FIELD, ORDER]) as any;

      for (const key in INDEXED_SORTER?.[field]) {
        if (key === field && params?.[ORDER] && params?.[FIELD]) {
          newParams[`${SORT}[${key}]`] = params?.[ORDER];
        } else {
          newParams[`${SORT}[${key}]`] = INDEXED_SORTER?.[field]?.[key];
        }
      }

      if (params?.[ORDER] && params?.[FIELD]) {
        newParams[`${SORT}[${params?.[FIELD]}]`] = params?.[ORDER];
      }
      const response = await nftServices.handleGetActivities(id, newParams);
      if (checkSuccessRequest(response)) {
        const { docs = [], totalDocs } = response?.data || {};
        setData(docs);
        setTotal(totalDocs);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    total,
    onGetActivities: handleGetActivities,
  };
};

export const useListForSaleNFT = () => {
  const handleListForSaleNFT = async (
    id: string,
    data: any,
    { onSuccess, onError }: { onSuccess: () => void; onError: () => void },
  ) => {
    try {
      const response = await nftServices.handleListForSaleNFT(id, data);
      if (checkSuccessRequest(response)) {
        onSuccess && onSuccess();
      } else {
        onError && onError();
      }
    } catch (error) {
    } finally {
    }
  };

  return {
    onListForSaleNFT: handleListForSaleNFT,
  };
};

export const useCreateTransaction = () => {
  const handleCreateTransaction = async (
    data: any,
    { onSuccess, onError }: { onSuccess: (id: string, data: any, nftId?: object) => void; onError: () => void },
  ) => {
    try {
      const response = await transactionServices.handleCreateTransaction(data);
      if (checkSuccessRequest(response)) {
        const dataRequest = response?.data?.signature?.dataRequest || [];
        onSuccess && onSuccess(response?.data?._id, dataRequest, response?.data?.nft);
      } else {
        onError && onError();
      }
    } catch (error) { }
  };

  return {
    onCreateTransaction: handleCreateTransaction,
  };
};

export const useUpdateTransaction = () => {
  const handleUpdateTransaction = async (
    id: string,
    data: any,
    { onSuccess, onError }: { onSuccess: () => void; onError: () => void },
  ) => {
    try {
      const response = await transactionServices.handleUpdateTransaction(id, data);
      if (checkSuccessRequest(response)) {
        if (!response?.isAlreadyCompleted) {
          onSuccess && onSuccess();
        }
      } else {
      }
    } catch (error) { }
  };

  return {
    onUpdateTransaction: handleUpdateTransaction,
  };
};
