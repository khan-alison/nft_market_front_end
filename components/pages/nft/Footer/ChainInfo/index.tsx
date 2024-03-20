import React, { Fragment, useContext } from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'next-i18next';

import { NftDetailContext } from 'pages/nft/[id]';
import EllipsisText from '@components//EllipsisText';
import AppAddress from '@components//AppAddress';
import AppLink from '@components//AppLink';

import PolygonIcon from 'public/svg/polygon_logo.svg';
import OpenLinkIcon from 'public/svg/open_link_icon.svg';
import CopyMobileIcon from 'public/svg/copy_mobile_icon.svg';

import { useMobile } from 'hooks/useWindowSize';
import { useGetConfig } from 'hooks/useGetConfig';

import { NFT_STANDARD } from 'constants/nft';
import { externalRoutes } from 'constants/routes';

type ChainInfoType = {
  label: string;
  prefixIcon?: string;
  address?: any;
  text?: string;
};

type ButtonLinkType = {
  href: string;
  text: string;
};

const ChainInfo = () => {
  const { t } = useTranslation();

  const { ipfsGateway } = useGetConfig();
  const { nftDetail = {} } = useContext(NftDetailContext) as any;
  const { token = {} } = nftDetail;
  const isMobile = useMobile();

  const nftStandard = t(NFT_STANDARD.find((standard) => standard?.value === token?.standard)?.label as string);

  const buttonLinkInfo = [
    {
      href: externalRoutes.POLYGON_SCAN_ADDRESS(token?.address),
      text: 'nft_detail.txt_view_on_polygonscan',
    },
    {
      href: `${ipfsGateway}${token?.cid}`,
      text: 'nft_detail.txt_view_on_ipfs',
    },
  ];

  const chainInfo = [
    {
      label: 'nft_detail.txt_chain',
      text: 'nft_detail.txt_polygon',
      prefixIcon: PolygonIcon,
    },
    {
      label: 'nft_detail.txt_contract_address',
      address: token?.address,
    },
    {
      label: 'nft_detail.txt_standard',
      text: nftStandard,
    },
  ];

  const renderButtonLink = ({ href, text }: ButtonLinkType) => {
    return (
      <div className='app-link'>
        <AppLink href={href} target='_blank' rel='noreferrer'>
          <div className='info-button'>
            <EllipsisText text={t(text)} className='info-button__text' />
            <img src={OpenLinkIcon} className='info-button__icon' />
          </div>
        </AppLink>
      </div>
    );
  };

  const renderChainItem = ({ label, text, prefixIcon, address }: ChainInfoType) => {
    return (
      <Fragment>
        <EllipsisText text={t(label)} className='info' />
        <div className='info-text'>
          {prefixIcon && <img src={prefixIcon} className='binance-icon' />}
          {text && <EllipsisText text={t(text)} />}
          {address && <AppAddress address={address} srcCopy={isMobile ? CopyMobileIcon : undefined} />}
        </div>
      </Fragment>
    );
  };

  return (
    <div className='nft-detail-chain-info'>
      <EllipsisText text={t('nft_detail.txt_chain_information')} className='nft-detail-chain-info__header' />
      <Row>
        {chainInfo.map((item, index) => (
          <Col key={index} xs={24} sm={24} className='nft-detail-chain-info__col'>
            {renderChainItem(item)}
          </Col>
        ))}
        <Col xs={24} sm={24} className='nft-detail-chain-info__col'>
          {buttonLinkInfo.map((item, index) => (
            <Fragment key={index}>{renderButtonLink(item)}</Fragment>
          ))}
        </Col>
      </Row>
    </div>
  );
};

export default ChainInfo;
