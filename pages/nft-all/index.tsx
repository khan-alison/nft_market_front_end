import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { createContext } from 'react';

import PublicLayout from '@components//Layout/Public';

import ListNft from '@components//pages/nft-list';
import withServerSideProps from 'hoc/withServerSideProps';
import ListNftAll from '@components//pages/nft-all';

export const NftDetailContext = createContext({});

const NftListAll = () => {
  const {
    query: { id },
  } = useRouter() as any;
  // const { t } = useTranslation();

  // const { loading } = useGetNftDetail(id as string) as any;

  return (
    <PublicLayout>
      <ListNftAll />
    </PublicLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withServerSideProps((context: any) => context);

export default NftListAll;
