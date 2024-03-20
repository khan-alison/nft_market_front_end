import React from 'react'
import { Typography } from 'antd';
import DigitalArtworkForm from '@components//CommonForm/DigitalArtworkForm';
import Link from 'next/link';
import NftTopImage2 from 'public/images/Rectangle_727.png';
import NftTopImage1 from 'public/images/Rectangle_729.png';
import { routeURLs } from 'constants/routes';
import { useGetListNFTs } from '@components//pages/nft/hooks';
const { Title } = Typography;

const DigitalArtworkNFT = () => {
  const { data: dataNft } = useGetListNFTs();

  const dataAllNft = dataNft?.data?.docs?.filter((dtNft: any, index: number) => index < 8) || []

  return (
    <div className='digitalArtwork-home'>
      <div className='container'>
        <div className='digitalArtwork-head'>
          <Title level={4} className='title-digitalArtwork'>Digital Artwork NFT</Title>
          <Link href={routeURLs.NFT_ALL}>Browse all</Link>
        </div>
        <DigitalArtworkForm data={dataAllNft} />
      </div>
    </div>
  )
}

export default DigitalArtworkNFT