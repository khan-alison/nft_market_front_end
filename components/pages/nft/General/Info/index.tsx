import { Avatar, Button, Spin, Typography } from 'antd';
import { useTranslation } from 'next-i18next';
import { Fragment, useState } from 'react';

import { useAppSelector } from 'hooks/useStore';

import AppTab from '@components//AppTab';
import PaymentModal from '@components//Payment';
import { NFT_TABS } from 'constants/nft';
import NftTopImage1 from 'public/images/Rectangle_711.png';
import selectedAddress from 'redux/address/selector';
import OfferTab from './OfferTab';
import OwnersTab from './OwnersTab';
import PutOnSaleModal from '@components//PutOnSale';
import { STATUS_NFT } from 'connectors/constants';
import MetamaskService from 'services/MetamaskService';
import { useWeb3React } from '@web3-react/core';
import { useBuyNFT } from '@components//pages/nft/hooks';
import LoadingModal from '@components//ModalLoading';
import selectAuthentication from 'redux/authentication/selector';
import { useGetUserProfile } from '@components//pages/user-profile/hooks';
import { KYCStatus } from 'constants/my-account';

const { Title } = Typography;
const { OFFER, OWNERS } = NFT_TABS;
const { MINTED, OFF_SALE, ON_SALE, UNMINT } = STATUS_NFT;

const Info = ({ dataNftDetail }: any) => {
  const { t } = useTranslation();
  const [isModalPayment, setIsModalPayment] = useState(false);
  const [isModalPutOnSale, setIsModalPutOnSale] = useState(false);
  const [isModalLoading, setIsModalLoading] = useState(false);

  const wallet = new MetamaskService().getInstance();
  const { onBuyNFT } = useBuyNFT();

  const { address } = useAppSelector(selectedAddress.getAddress);
  const { library } = useWeb3React();

  const { authenticationToken } = useAppSelector(selectAuthentication.getAuthenticationToken);

  const { userProfile } = useGetUserProfile(authenticationToken);
  const { kycInfo } = userProfile ?? {};
  const { kycStatus = undefined } = kycInfo ?? {};

  const [activeTab, setActiveTab] = useState({
    tab: OWNERS.query,
    isClick: false,
  });
  const handleChangeTab = (value: string) => {
    setActiveTab({
      ...activeTab,
      tab: value,
    });
  };
  const listTab = [
    {
      key: OWNERS.query,
      tab: t(OWNERS.label),
      content: <OwnersTab />,
    },
    {
      key: OFFER.query,
      tab: t(OFFER.label),
      content: <OfferTab />,
    },
  ];

  const handleOpenPayment = () => setIsModalPayment(true);
  const handleOpenPutOnSale = () => setIsModalPutOnSale(true);
  const handleClosePayment = () => setIsModalPayment(false);
  const handleClosePutOnSale = () => setIsModalPutOnSale(false);

  const handleBuy = async () => {
    setIsModalLoading(true);
    await wallet.buyNFT({
      account: address,
      library,
      data: {
        orderId: dataNftDetail[0]?.orderId,
        buyAmount: 1,
        price: dataNftDetail[0]?.price,
      },
      onCallback: (response: any) =>
        onBuyNFT({
          nftId: dataNftDetail[0]?._id,
          quantity: 1,
          price: dataNftDetail[0]?.price,
          fromAddress: address,
          transactionHash: response.hash,
          status: 'SUCCESS',
        }),
    });
    setIsModalLoading(false);
  };
  const checkStatus =
    dataNftDetail[0]?.status === MINTED || dataNftDetail[0]?.status === OFF_SALE
      ? 0
      : dataNftDetail[0]?.price / 10 ** 18;
  console.log('checkStatus', checkStatus);
  console.log('dataNftDetail',dataNftDetail[0]);
  

  return (
    <Fragment>
      <div className='nft-detail-content'>
        <div className='nft-detail-head'>
          <Title level={4} className='title-collection'>
            {dataNftDetail[0]?.name}
          </Title>
        </div>
        <div className='feature'>
          <span className='feature-item-unlock'>
            <img src='' alt='' />
            <span>{dataNftDetail[0]?.status}</span>
          </span>
        </div>
        <div className='avatar'>
          <Avatar
            size={{ xs: 35, sm: 35, md: 35, lg: 35, xl: 40, xxl: 40 }}
            icon={<img src={dataNftDetail[0]?.ipfsImage} alt='' />}
          />
          <div className='avatar-info'>
            <p>Collection</p>
            <p>{dataNftDetail[0]?.name}</p>
          </div>
        </div>
        <p className='statistical'>{dataNftDetail[0]?.description}</p>
        <div className='price'>
          <span>{checkStatus || 0} XCR</span>
        </div>
        {kycStatus === KYCStatus.VERIFIED ? (
          address !== dataNftDetail[0]?.address ? (
            <div className='gr-btn'>
              {dataNftDetail[0]?.status === UNMINT && (
                <Button className='btn-buy' onClick={handleOpenPayment}>
                  Mint
                </Button>
              )}
              {(dataNftDetail[0]?.status === MINTED || dataNftDetail[0]?.status === OFF_SALE) && (
                <Button className='btn-offer' onClick={handleOpenPutOnSale}>
                  Put On Sale
                </Button>
              )}
              {dataNftDetail[0]?.status === ON_SALE &&
                (dataNftDetail[0]?.creatorAddress === address ? (
                  <Button className='btn-offer'>Cancel</Button>
                ) : (
                  <Button className='btn-buy' onClick={handleBuy}>
                    Buy
                  </Button>
                ))}
            </div>
          ) : null
        ) : (
          <div>Account unverified ! Please verify</div>
        )}
        {/* <div>
          <AppTab
            onChangeTab={handleChangeTab}
            activeKey={activeTab.tab}
            listTab={listTab}
            className='my-activities-page-tab container'
          />
        </div> */}
        <PaymentModal
          setIsModalLoading={setIsModalLoading}
          isModalPayment={isModalPayment}
          handleClosePayment={handleClosePayment}
          dataNftDetail={dataNftDetail}
        />
        <PutOnSaleModal
          setIsModalLoading={setIsModalLoading}
          isModalPutOnSale={isModalPutOnSale}
          handleClosePutOnSale={handleClosePutOnSale}
          dataNftDetail={dataNftDetail}
        />
      </div>
      <LoadingModal isModalLoading={isModalLoading} />
    </Fragment>
  );
};

export default Info;
