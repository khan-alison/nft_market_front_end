import React, { createContext } from 'react'
import PublicLayout from '@components//Layout/Public';
import CreateNft from '@components//pages/nft-create';
import { GetServerSideProps } from 'next';
import withServerSideProps from 'hoc/withServerSideProps';

export const NftDetailContext = createContext({});

const CreateNftPage = () => {
  return (
    <PublicLayout>
      <CreateNft />
    </PublicLayout>
  )
}
export const getServerSideProps: GetServerSideProps = withServerSideProps((context: any) => context);

export default CreateNftPage