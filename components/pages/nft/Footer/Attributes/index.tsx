import React, { Fragment, useContext } from 'react';
import { Col, Row } from 'antd';
import { useTranslation } from 'next-i18next';

import { NftDetailContext } from 'pages/nft/[id]';
import EllipsisText from '@components//EllipsisText';

import { NFT_MANAGEMENT_ATTRIBUTE_FIELD } from 'constants/nft';
import { getImageAttributes, getValueAttributes } from 'utils';

const { MYTHOLOGY, CLASS, LEVEL, GOD } = NFT_MANAGEMENT_ATTRIBUTE_FIELD;

type AttributesItem = {
  text: string;
  label: string;
  imgUrl?: string;
};

const Attributes = () => {
  const { t } = useTranslation();
  const { nftDetail = {} } = useContext(NftDetailContext) as any;
  const { attributes = [] } = nftDetail;

  const attributesInfo = [
    {
      label: 'nft_detail.txt_mythology',
      text: getValueAttributes(attributes, MYTHOLOGY),
      imgUrl: getImageAttributes(attributes, MYTHOLOGY),
    },
    {
      label: 'nft_detail.txt_level',
      text: getValueAttributes(attributes, LEVEL),
      imgUrl: getImageAttributes(attributes, LEVEL),
    },
    {
      label: 'nft_detail.txt_class',
      text: getValueAttributes(attributes, CLASS),
    },

    {
      label: 'nft_detail.txt_god',
      text: getValueAttributes(attributes, GOD),
    },
  ];

  return (
    <div className='nft-detail-attributes'>
      <EllipsisText className='nft-detail-attributes__header' text={t('nft_detail.txt_attributes')} />
      <Row>
        {attributesInfo?.map(({ text, label, imgUrl }: AttributesItem, index) => (
          <Col key={index} xs={12} sm={12}>
            <EllipsisText text={t(label)} className='info-label' />
            <div className='info-text'>
              {imgUrl && <img src={imgUrl} />}
              <EllipsisText text={text} />
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default Attributes;
