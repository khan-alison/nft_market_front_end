import { Image, Tooltip } from 'antd';
import { useTranslation } from 'next-i18next';
import { EVENT_STATUS_VALUE, EVENT_TYPE_VALUE } from 'constants/event';
import EllipsisText from '@components//EllipsisText';
import AppButton from '@components//AppButton';

import Countdown, { zeroPad } from 'react-countdown';
import { FORMAT_DATETIME_PICKER } from 'constants/common';
import { formatDate } from 'utils';
// import Progress from '@components//pages/event-detail/General/Progress';
import AppNumber from '@components//AppNumber';

import icon_clock from 'public/svg/icon_clock.svg';
import icon_flame from 'public/svg/icon_flame.svg';
import icon_star from 'public/svg/icon_start.svg';
import { renderURLs } from 'constants/routes';
import AppLink from '@components//AppLink';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';
import moment from 'moment';

type SubsequentPageProps = {
  _id: string;
  imgUrl: string;
  name: string;
  startDate: string;
  endDate: string;
  status: number;
  categories: any;
  type: string;
};

const SubsequentPage = ({ _id, imgUrl, name, startDate, endDate, status, categories, type }: SubsequentPageProps) => {
  const { t } = useTranslation();
  const router = useRouter();
  const timeRef = useRef<any>(null);
  const eventIsComing = status === EVENT_STATUS_VALUE.COMING_SOON;
  const eventIsLive = status === EVENT_STATUS_VALUE.LIVE;
  const eventIsEnded = status === EVENT_STATUS_VALUE.ENDED;

  const nameEvent =
    status === EVENT_STATUS_VALUE.LIVE ? (
      <>
        <img src={icon_flame} alt='' />
        {t('event_detail.txt_ends_in')}
      </>
    ) : status === EVENT_STATUS_VALUE.COMING_SOON ? (
      <>
        <img src={icon_star} alt='' />
        {t('event_detail.txt_starts_in')}
      </>
    ) : (
      <>
        <img src={icon_clock} alt='' />
        {t('event_detail.txt_ended_on')}
      </>
    );

  const getCategoriesTotal = () => {
    let totalSupply = 0;
    let totalMinted = 0;

    categories.map((category: any, index: any) => {
      totalMinted += category.totalMinted;
      totalSupply += category.quantityForSale;
    });

    return { totalMinted, totalSupply };
  };

  const { totalMinted, totalSupply } = getCategoriesTotal();

  const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
    if (completed && eventIsLive) {
      return (
        <div className='ant-statistic text-end padding-bottom'>
          <img src={icon_clock} alt='' />
          <span className='color--ended'>{`${t('home.txt_ended_on')} ${moment(endDate).format(
            FORMAT_DATETIME_PICKER,
          )}`}</span>
        </div>
      );
    }
    return (
      <div className='countdown'>
        <div className='label'>{nameEvent}</div>

        <div className='time'>
          <div className='countdown-item'>
            <span>
              {days}
              {t('common.txt_day')}
            </span>
          </div>
          <span>:</span>
          <div className='countdown-item'>
            <span>
              {zeroPad(hours)}
              {t('common.txt_hour')}
            </span>
          </div>
          <span>:</span>
          <div className='countdown-item'>
            <span>
              {zeroPad(minutes)}
              {t('common.txt_minute')}
            </span>
          </div>
          <span>:</span>
          <div className='countdown-item'>
            <span>
              {zeroPad(seconds)}
              {t('common.txt_second')}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const onComplete = () => {
    router.replace(router.asPath, router.asPath, { scroll: false });
  };

  const addSeconds = (numOfHours: number, date: Date) => {
    date.setTime(date.getTime() + numOfHours * 1000);
    return date;
  };

  useEffect(() => {
    setTimeout(() => timeRef.current?.start());
  }, []);

  return (
    <div className='sub-page'>
      <Image className='event-image' src={imgUrl} preview={false} />
      <div className='content'>
        <div className='event-header'>
          <EllipsisText text={name} tooltipText={name} className='event-name' />
          {type === EVENT_TYPE_VALUE.WHITELIST && (
            <Tooltip title={t('common.whitelisted_event')}>
              <span className='whitelist'>{t('home.txt_white_list')}</span>
            </Tooltip>
          )}
        </div>
        <Countdown
          date={new Date(eventIsComing ? addSeconds(5, new Date(startDate)) : endDate)}
          renderer={renderer}
          onComplete={onComplete}
          ref={timeRef}
        />
        {/* {!eventIsComing && (
          <Progress totalMint={totalMinted} totalQuantityForSale={totalSupply} isEndedEvent={eventIsEnded} />
        )} */}

        {!eventIsComing ? (
          <>
            <span className='title'>
              {t('home.txt_nft_minted')}:{' '}
              <span>
                <AppNumber value={totalMinted} />/<AppNumber value={totalSupply} />
              </span>
            </span>
          </>
        ) : (
          <span className='title'>
            {t('nft_detail.txt_total_items')}: <span>{totalSupply}</span>
          </span>
        )}
        {eventIsLive && (
          <div className='mint-btn'>
            <AppLink href='#'>
              <AppButton text={t('home.txt_mint_now')} />
            </AppLink>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubsequentPage;
