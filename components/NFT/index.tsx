import React, { Fragment, useMemo } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { Image } from 'antd';

import AppLink from '../AppLink';
import AppNumber from '../AppNumber';
import NumberFormat from '../NumberFormat';
import EllipsisText from 'components/EllipsisText';

import VideoIcon from 'public/svg/video_icon.svg';

import { handleRoutePage } from 'redux/page/slice';

import { useAppDispatch } from 'hooks/useStore';
import { useGetConfig } from 'hooks/useGetConfig';

import { formatCurrency, formatPadStart } from 'utils';

import { renderURLs } from 'constants/routes';
import { DOLLAR_TEXT } from 'constants/common';
import {
  NFT_MANAGEMENT_ATTRIBUTE_FIELD,
  NFT_MEDIA,
  NFT_STATUS,
  MIN_VALUE_TOTAL_COPIES,
  NFT_MIME_TYPE,
} from 'constants/nft';

const { MYTHOLOGY, CLASS, LEVEL, GOD } = NFT_MANAGEMENT_ATTRIBUTE_FIELD;
const { IMAGE } = NFT_MEDIA;

type PreviewNFTProps = {
  nft: any;
};

const NFT = ({ nft = {} }: PreviewNFTProps) => {
  const { t } = useTranslation();
  const { currency: currencySupport } = useGetConfig();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { attributes, image, media, code, status, totalSupply, totalForSale, currency, unitPrice, usd } = nft;
  const getValueAttribute = (field: string) => attributes?.[field]?.text || attributes?.[field];

  const getImageAttribute = (field: string) => attributes?.[field]?.imgUrl;

  const nftFormat = media?.type || IMAGE;
  const isForSale = status === NFT_STATUS[0].value;
  const renderImg = NFT_MIME_TYPE.includes(image?.mimeType) ? image?.url : image?.mediumUrl;

  const renderNumberEdition = useMemo(() => {
    switch (true) {
      case isForSale:
        return t(
          totalSupply > MIN_VALUE_TOTAL_COPIES
            ? 'home.txt_edition_number_of_total'
            : 'home.txt_edition_number_of_total_single',
          {
            number: formatCurrency(totalForSale),
            total: formatCurrency(totalSupply),
          },
        );
      default:
        return t(
          totalSupply > MIN_VALUE_TOTAL_COPIES ? 'home.txt_edition_of_number' : 'home.txt_edition_of_number_single',
          {
            number: formatCurrency(totalSupply),
          },
        );
    }
  }, [isForSale, totalSupply, totalForSale]);

  const renderForSaleFooter = useMemo(() => {
    return (
      <div className='footer__active'>
        <div className='currency'>
          <img src={currencySupport?.icon} />
          <NumberFormat className='currency__price' thousandSeparator displayType='text' value={unitPrice} />
          <span className='currency__symbol'>{currency?.symbol}</span>
        </div>
        <div className='price'>
          <Fragment>
            ({DOLLAR_TEXT}&nbsp;
            <AppNumber value={usd} />)
          </Fragment>
        </div>
      </div>
    );
  }, [isForSale]);

  const renderNftFooter = useMemo(() => {
    switch (true) {
      case isForSale:
        return renderForSaleFooter;
      default:
        return <p className='footer__inactive'>{t('home.txt_not_for_sale')}</p>;
    }
  }, [isForSale]);

  const handleRouteNFT = () => {
    dispatch(handleRoutePage(router?.asPath));
  };

  return (
    <AppLink onClick={handleRouteNFT} href={renderURLs.NFT_DETAIL(nft?.slug as string)}>
      <div className='nft'>
        <div className='nft__header'>
          <div className='info'>
            <EllipsisText text={formatPadStart(code)} className='info__id' />
            <Fragment>
              <div className='info__dot' />
              <span className='info__class'>{getValueAttribute(CLASS)}</span>
            </Fragment>
          </div>
          <div className='skill'>
            {getImageAttribute(LEVEL) && <img src={getImageAttribute(LEVEL)} className='image--first' />}
            {getImageAttribute(MYTHOLOGY) && <img src={getImageAttribute(MYTHOLOGY)} className='image--second' />}
          </div>
        </div>
        <div className='nft__content'>
          <div className='info'>
            <Image src={renderImg} className='info__image' preview={false} />
            <div className='info__footer'>
              {getValueAttribute(GOD) ? (
                <EllipsisText text={getValueAttribute(GOD)} className='text' />
              ) : (
                <div>&nbsp;</div>
              )}
              {nftFormat !== IMAGE && <img src={VideoIcon} />}
            </div>
          </div>
          <div className='footer'>
            <EllipsisText text={nft?.name} className='footer__text' />
            <EllipsisText text={renderNumberEdition} className='footer__sub-text' />
            {renderNftFooter}
          </div>
        </div>
      </div>
    </AppLink>
  );
};

export default NFT;
