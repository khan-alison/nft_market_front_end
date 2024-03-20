import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { END } from 'redux-saga';
import { wrapper } from 'redux/configStore';
import handleServerSide from 'utils/handleServerSide';

const withServerSideProps = (getServerSidePropsCallback: any, needCtx?: boolean) => {
  return wrapper.getServerSideProps((store: any) => async (ctx: any) => {
    const { locale }: any = ctx;

    // end the saga
    store.dispatch(END);
    await store.sagaTask.toPromise();

    const { redirect } = await handleServerSide.handleRedirectServerSide();
    const props = await handleServerSide.handleGetPropsServerSide();

    return await getServerSidePropsCallback({
      props: {
        ...props,
        ...(await serverSideTranslations(locale, ['common'])),
      },
      ...(redirect ? { redirect } : {}),
      ...(needCtx ? { ctx } : {}),
    });
  });
};

export const withStaticProps = () => {
  return wrapper.getStaticProps((store: any) => async (ctx: any) => {
    const { locale, ...props } = ctx;
    return {
      props: {
        ...props,
        ...(await serverSideTranslations(locale, ['common'])),
      },
    };
  });
};

export default withServerSideProps;
