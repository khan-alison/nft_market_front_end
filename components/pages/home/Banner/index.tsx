import React from 'react';
import { useTranslation } from 'next-i18next';
import { Carousel, Col, Row } from 'antd';
import classNames from 'classnames';

import ItemWithLabel from '@components//ItemWithLabel';
import EllipsisText from '@components//EllipsisText';

import { useGetConfig } from 'hooks/useGetConfig';
// import { useGetOverview } from '../hooks';

import { compareEvent, getNumberValue, nFormatter } from 'utils';

import { EMPTY_DEFAULT_TEXT } from 'constants/common';
import AppButton from '@components//AppButton';
import SubsequentPage from './SubsequentPage';
import { routeURLs } from 'constants/routes';
import AppLink from '@components//AppLink';
import { useAppSelector } from 'hooks/useStore';
import selectedConnection from 'redux/connection/selector';

type DashboardItem = {
  label?: string;
  value?: any;
  subLabel?: string;
  className?: string;
  icon?: string;
};

const Banner = () => {
  const { t } = useTranslation();

  const { isConnected } = useAppSelector(selectedConnection.getConnection);
  // const { data } = useGetOverview();
  const { currency = {} } = useGetConfig();
  const { symbol, icon } = currency;
  // const { itemsSold, totalVolume, totalMinters, events } = data;

  // if (data) {
  //   events && events.sort(compareEvent);
  // }

  const dashboardInfo: Array<DashboardItem> = [
    { label: t('home.txt_total_items_sold'), value: getNumberValue(0) },
    {
      label: t('home.txt_total_volume'),
      value: getNumberValue(0),
      icon: icon,
    },
    {
      label: t('home.txt_total_minters'),
      value: getNumberValue(0),
    },
  ];

  const renderDashboardItem = (item: DashboardItem = {}) => {
    const { label, subLabel, icon, value, className } = item;
    return (
      <ItemWithLabel label={label} className={classNames('item', className)}>
        {icon && <img className='icon' src={icon} />}
        {value ? <EllipsisText className='text' text={nFormatter(value)} /> : EMPTY_DEFAULT_TEXT}
        <span className='currency'>{subLabel}</span>
      </ItemWithLabel>
    );
  };

  return (
    <div className='home-banner'>
      <div className='container'>
        <Carousel>
          <div className='banner-content'>
            <Row gutter={24} justify='space-between' align='middle'>
              <Col md={11} sm={20}>
                <div className='intro'>
                  <h1 className='brillianz-minting-title'>
                    CVC
                  </h1>
                  <div className='text'>{t('home.txt_banner_text')}</div>
                  <AppLink href={routeURLs.HOME}>
                    <AppButton text={t('home.txt_mint_now')} />
                  </AppLink>
                </div>
              </Col>
              <Col md={13} xs={24}>
                <div className='overview'>
                  <Row justify='space-between' align='middle'>
                    <Col lg={5} md={24}>
                      {renderDashboardItem(dashboardInfo[0])}
                    </Col>
                    <div className='divider' />
                    <Col lg={6} md={24}>
                      {renderDashboardItem(dashboardInfo[1])}
                    </Col>
                    <div className='divider' />
                    <Col lg={6} md={24}>
                      {renderDashboardItem(dashboardInfo[2])}
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>
          </div>
          {/* {events &&
            events.map((event: any, index: any) => {
              if (event.isPrivate) {
                return;
              }
              return <SubsequentPage key={index} {...event} />;
            })} */}
        </Carousel>
      </div>
    </div>
  );
};

export default Banner;
