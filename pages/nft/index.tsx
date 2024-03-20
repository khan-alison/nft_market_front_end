import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { createContext } from 'react';

import PublicLayout from '@components//Layout/Public';

import ListNft from '@components//pages/nft-list';
import withServerSideProps from 'hoc/withServerSideProps';

export const NftDetailContext = createContext({});

const NftList = () => {
  const {
    query: { id },
  } = useRouter() as any;
  // const { t } = useTranslation();

  // const { loading } = useGetNftDetail(id as string) as any;

  return (
    <PublicLayout>
      <ListNft />
    </PublicLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withServerSideProps((context: any) => context);

export default NftList;
