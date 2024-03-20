import { GetServerSideProps } from 'next';

import PublicLayout from '@components//Layout/Public';
import Banner from '@components//pages/home/Banner';

import withServerSideProps from 'hoc/withServerSideProps';
import { useReferrerUser } from '@components//pages/user-profile/hooks';
import { useRouter } from 'next/router';
import Page404 from './404';
import { useEffect } from 'react';
import { wrapper } from 'redux/configStore';
import homepageServices from 'services/homepage';
import { checkSuccessRequest } from 'services/api';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import eventServices from 'services/event';
import Outstanding from '@components//pages/home/Outstanding';
import DigitalArtworkNFT from '@components//pages/home/DigitalArtworkNFT';
import Blog from '@components//pages/home/Blog';
import Collection from '@components//pages/home/Collection';

const Home = ({ events }: { events: any }) => {
  const router = useRouter();
  const { addressReferrer } = router.query;
  const { checkReferrerUser, checkIsSuccess } = useReferrerUser(addressReferrer as string);
  return (
    <>
      {checkIsSuccess ? (
        <PublicLayout>
          <div className='home-page'>
            <Banner />
            <Outstanding />
            <DigitalArtworkNFT />
            <Collection />
            <Blog />
          </div>
        </PublicLayout>
      ) : (
        <Page404 />
      )}
    </>
  );
};

export const getServerSideProps: GetServerSideProps = wrapper.getServerSideProps(() => async (ctx: any) => {
  const { locale, query, params, req }: any = ctx;

  let events = {};

  const eventsResponse = await eventServices.handleGetList({});

  if (checkSuccessRequest(eventsResponse)) {
    events = eventsResponse?.data?.docs;
  }

  return {
    props: {
      events,
      ...params,
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
});

export default Home;
