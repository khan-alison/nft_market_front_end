import React, { createContext } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Detail from '@components//pages/nft';
import PublicLayout from '@components//Layout/Public';

import { wrapper } from 'redux/configStore';
import { useGetNftDetail } from '@components//pages/nft/hooks';

import nftServices from 'services/nft';
import { checkSuccessRequest } from 'services/api';
import withServerSideProps from 'hoc/withServerSideProps';

export const NftDetailContext = createContext({});

const NftDetail = ({ nftDetailSeo }: { nftDetailSeo?: any }) => {
  const {
    query: { id },
  } = useRouter() as any;
  // const { t } = useTranslation();

  // const { loading } = useGetNftDetail(id as string) as any;

  return (
    <PublicLayout
      title={nftDetailSeo?.name}
      metaDescription={nftDetailSeo?.description}
      socialImageUrl={nftDetailSeo?.image?.mediumUrl}
    >
      <Detail />
    </PublicLayout>
  );
};

// export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(() => async (ctx: any) => {
//   const { locale, query, params }: any = ctx;

//   const nftDetailSeo = {};
//   // const response = await nftServices.handleGetNftDetail(query?.id);
//   // if (checkSuccessRequest(response)) {
//   //   nftDetailSeo = response?.data;
//   // }
//   return {
//     props: {
//       nftDetailSeo,
//       // ...params,
//       // ...(await serverSideTranslations(locale, ['common'])),
//     },
//   };
// });
export const getServerSideProps: GetServerSideProps = withServerSideProps((context: any) => context);

export default NftDetail;
