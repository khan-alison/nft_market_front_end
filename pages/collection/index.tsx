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
import { useAppSelector } from 'hooks/useStore';
import selectedAddress from 'redux/address/selector';


const { Title, Paragraph } = Typography;

const Collection = () => {
  const { t } = useTranslation();
  const { address } = useAppSelector(selectedAddress.getAddress);

  return (
    <PublicLayout>
      <div className='collection-page'>
        <div className='container'>
          <div className='collection-banner'>
            <img src={NftTopImage1} alt='' />
            <Avatar
              size={{ xs: 80, sm: 80, md: 80, lg: 80, xl: 100, xxl: 128 }}
              icon={<img src={NftTopImage1} alt='' />}
              className='avatar'
            />
          </div>
          <div className='collection-about'>
            <Title level={4} className='title-collection-page'>Digital Artwork NFT</Title>
            <span className='address-collection'>
              <Paragraph
                copyable={{
                  text: address,
                  icon: <img className='app-address__icon' src={CopyIcon} key='copy-icon' />,
                }}
                className='code'
              >
                {shortenAddress(address)}
              </Paragraph>
            </span>
            <p className='decs-collection'>
              Nothing generative. All handmade. The real deal! The worlds largest 3D collectible collection by 26 different top shelf artists from around the world!
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
              Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
              Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
          <div className='collection-content'>
            <div className='content-head'>
              <div className='content-head-item'>
                <p className='name'>Items</p>
                <p className='value'>$1,000</p>
              </div>
              <div className='content-head-item'>
                <p className='name'>Owners</p>
                <p className='value'>100</p>
              </div>
              <div className='content-head-item'>
                <p className='name'>Floor Price</p>
                <p className='value'>$100</p>
              </div>
              <div className='content-head-item'>
                <p className='name'>Volume Traded</p>
                <p className='value'>$1,000</p>
              </div>
            </div>
          </div>
        </div>
        <div className='digitalArtwork-home'>
            <div className='container'>
              <DigitalArtworkForm />
            </div>
          </div>

      </div>
    </PublicLayout>
  );
};

export const getServerSideProps: GetServerSideProps = withServerSideProps((context: any) => context);

export default Collection;
