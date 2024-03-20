import React, { createContext } from 'react'
import PublicLayout from '@components//Layout/Public';
import { GetServerSideProps } from 'next';
import withServerSideProps from 'hoc/withServerSideProps';
import KycUser from '@components//pages/user-profile/kyc';

export const NftDetailContext = createContext({});

const KycPage = () => {
  return (
    <PublicLayout>
      <KycUser />
    </PublicLayout>
  )
}
export const getServerSideProps: GetServerSideProps = withServerSideProps((context: any) => context);

export default KycPage