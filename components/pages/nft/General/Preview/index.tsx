import React, { useContext } from 'react';
import dynamic from 'next/dynamic';
import { Image } from 'antd';

import { NftDetailContext } from 'pages/nft/[id]';
import MediaPlayer from '@components//MediaPlayer';

import { NFT_MEDIA } from 'constants/nft';
import { useAppSelector } from 'hooks/useStore';
import selectorNft from 'redux/nft/selector';
import NftTopImage2 from 'public/images/Rectangle_727.png';

const ModelViewer = dynamic(() => import('@components//ModalViewer'), { ssr: false });

const { AUDIO, VIDEO, MODEL, IMAGE } = NFT_MEDIA;

const NFTContent = ({ dataNftDetail }: any) => {
  const nftDetail = useAppSelector(selectorNft.getNftDetail);

  const nftFormat = nftDetail?.media?.type || IMAGE;
  const previewSrc = nftDetail?.image?.mediumUrl;
  const contentSrc = nftDetail?.image?.mediumUrl;

  const renderContent = () => {
    switch (nftFormat) {
      case AUDIO:
        return (
          <div className='media__audio'>
            {previewSrc && <img src={previewSrc} className='image' />}
            <MediaPlayer src={contentSrc} wrapperClassName='audio' controllerClassName='controller' isVideo={false} />
          </div>
        );
      case VIDEO:
        return <MediaPlayer src={contentSrc} isVideo />;
      case MODEL:
        return (
          <div className='model-viewer'>
            <ModelViewer auto-rotate autoplay camera-controls src={contentSrc} />
          </div>
        );
      default:
        return <Image src={contentSrc} />;
    }
  };

  // return renderContent();
  return (
    <div className='media__audio'>
      <img src={dataNftDetail[0]?.ipfsImage} className='image' />
      {/* <MediaPlayer src={contentSrc} wrapperClassName='audio' controllerClassName='controller' isVideo={false} /> */}
    </div>
  );
};

export default NFTContent;
