import { GetServerSideProps } from 'next';
import { useTranslation } from 'next-i18next';

import PublicLayout from '@components//Layout/Public';
import NftTopImage1 from 'public/images/Rectangle_711.png';

import withServerSideProps from 'hoc/withServerSideProps';
import Link from 'next/link';
import { routeURLs } from 'constants/routes';
import { Avatar, Typography } from 'antd';
import { shortenAddress } from 'utils';
import CopyIcon from 'public/svg/copy_icon_white.svg';
import DigitalArtworkNFT from '@components//pages/home/DigitalArtworkNFT';
import DigitalArtworkForm from '@components//CommonForm/DigitalArtworkForm';
import ActivityContainer from '@components//pages/acitvity';


const { Title, Paragraph } = Typography;

const Activity = () => {
  const { t } = useTranslation();

  return (
    <PublicLayout>
      <div className='collection-page'>
        <div className='container'>
        <ActivityContainer />          
        </div>
      </div>
    </PublicLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withServerSideProps((context: any) => context);

export default Activity;
