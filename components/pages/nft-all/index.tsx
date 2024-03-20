import DigitalArtworkForm from '@components//CommonForm/DigitalArtworkForm';
import { useGetListNFTs } from '@components//pages/nft/hooks';
import { Typography } from 'antd';

const { Title } = Typography;

const ListNftAll = () => {
  const { data: dataNft } = useGetListNFTs();

  const dataAllNft = dataNft?.data?.docs || []
  return (
    <div className='nft-ListNft-page'>
      <div className='nft-ListNft-page__wrapper'>
        <div className='container'>
          <Title level={4} className='title-ListNft'>List NFT All</Title>

          <DigitalArtworkForm data={dataAllNft}/>
        </div>
      </div>
    </div>
  );
};

export default ListNftAll;
