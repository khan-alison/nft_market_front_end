import { useTranslation } from 'next-i18next';
import { GetStaticProps } from 'next';

import PublicLayout from '@components//Layout/Public';
import EllipsisText from '@components//EllipsisText';

import Icon404 from 'public/images/404_icon.png';
import IconMobile404 from 'public/images/404_mobile_icon.png';

import { useMobile } from 'hooks/useWindowSize';

import { withStaticProps } from 'hoc/withServerSideProps';

const Page404 = () => {
  const { t } = useTranslation();
  const isMobile = useMobile();

  return (
    <div className='page-404'>
      {isMobile ? <img src={IconMobile404} /> : <img src={Icon404} />}
      <EllipsisText className='page-404__label' text={t('page-404.txt_page_not_available')} />
      <EllipsisText className='page-404__content' text={t('page-404.txt_page_not_be_found')} />
    </div>
  );
};

export const getStaticProps: GetStaticProps = withStaticProps();

export default Page404;
