
import { useTranslation } from 'next-i18next';
import DigitalArtworkNFT from '../../home/DigitalArtworkNFT';

const Footer = () => {
  const { t } = useTranslation();
  return (
    <div className='nft-detail-page-footer'>
      <DigitalArtworkNFT />
    </div>
  );
};
export default Footer;
