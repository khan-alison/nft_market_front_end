import { Badge, Drawer } from 'antd';
import router from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroll-component';

import AppDropdown from '../AppDropdown';
import EllipsisText from '../EllipsisText';

import CloseIcon from 'public/svg/close_icon.svg';
import RingIcon from 'public/svg/ring_icon.svg';

import { useSocket } from 'hooks/useSocket';
import { useAppDispatch, useAppSelector } from 'hooks/useStore';
import selectedAddress from 'redux/address/selector';

import { checkSuccessRequest } from 'services/api';
import notificationService from 'services/notification';

import { formatDate } from 'utils';

import { FORMAT_DATE_PICKER, FORMAT_TIME_PICKER, SOCKET_EVENT, TYPE_NOTICE, ZERO_VALUE } from 'constants/common';
import LENGTH_CONSTANTS from 'constants/length';
import { routeURLs } from 'constants/routes';
import { useMobile } from 'hooks/useWindowSize';
import { noop } from 'lodash';
import { handleSetNoticeCommission } from 'redux/action/slice';
import AppButton from '../AppButton';

const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } = LENGTH_CONSTANTS;

const { N1, N10, N11, N12, N13, N14, N15, N2, N3, N4, N5, N6, N7, N8, N9, N16, N17 } = TYPE_NOTICE;

const Notification = () => {
  const { t } = useTranslation();
  const { address } = useAppSelector(selectedAddress.getAddress);
  const isMobile = useMobile();
  const dispatch = useAppDispatch();

  const [page, setPage] = useState(DEFAULT_PAGE);
  const [totalUnread, setTotalUnread] = useState(ZERO_VALUE);
  const [totalNotification, setTotalNotification] = useState(ZERO_VALUE);
  const [listNotification, setListNotification] = useState([]) as Array<any>;
  const [visibleNotification, setVisibleNotification] = useState(false);

  const handleOpenNotification = () => setVisibleNotification(!visibleNotification);
  const handleCloseNotification = () => setVisibleNotification(false);

  const handleAddNotification = (data: any) => {
    console.log(data, 'data socket');
    const newListNotification = [{ ...data, isRead: false }, ...listNotification];
    setListNotification(newListNotification);
    setTotalUnread(totalUnread + 1);
  };

  useSocket({
    event: SOCKET_EVENT.NOTIFICATION,
    handleEvent: handleAddNotification,
    dependences: [totalUnread, listNotification],
  });

  const getListNotification = async (page: number) => {
    try {
      const response = await notificationService.getListNotification({ page, limit: DEFAULT_PAGE_SIZE });
      if (checkSuccessRequest(response)) {
        const { docs = [], totalDocs = 0, totalUnread = 0 } = response?.data || {};

        setListNotification(page === DEFAULT_PAGE ? [...docs] : [...listNotification, ...docs]);
        setTotalNotification(totalDocs);
        setTotalUnread(totalUnread);
      }
    } catch (error) {}
  };

  useEffect(() => {
    address && setTimeout(() => getListNotification(DEFAULT_PAGE));
  }, [address, totalUnread]);

  const getMoreNotification = () => {
    setPage(page + 1);
    getListNotification(page + 1);
  };

  const renderNotificationContent = (notification: any = {}) => {
    const { type, payload = {} } = notification;
    const { nftName, price, currency, buyerAddress } = payload;
    switch (type) {
      case N1:
      case N2:
      case N3:
      case N4:
      case N5:
      case N6:
      case N7:
      case N12:
        return {
          text: notification?.content,
          router: `${routeURLs.ACCOUNT}?tabPane=inventory`,
        };
      case N8:
      case N13:
        return {
          text: notification?.content,
          router: `${routeURLs.ACCOUNT}?tabPane=referral`,
        };
      case N15:
        return {
          text: notification?.content,
          router: `${routeURLs.ACCOUNT}?tabPane=referral`,
        };
      case N16:
      default:
        return {
          text: '',
          router: '/',
        };
    }
  };

  const handleClickNotification = (notification: any, asPath: string) => async (event: any) => {
    event.preventDefault();
    router.push(asPath);
    if (notification?.type === N13) {
      dispatch(handleSetNoticeCommission('network-tab'));
    }
    if (notification?.type === N15) {
      dispatch(handleSetNoticeCommission('commission-tab'));
    }

    if (!notification?.isRead) {
      try {
        const response = await notificationService.setMarkAsRead(notification?._id);
        if (checkSuccessRequest(response)) {
          const newListNotification = listNotification.map((item: any) => {
            return notification?._id === item?._id ? { ...notification, isRead: true } : item;
          });
          setTotalUnread(totalUnread > 0 ? totalUnread - 1 : totalUnread);
          setListNotification(newListNotification);
        }
      } catch (error) {}
    }
  };

  const handleMarkAllAsRead = async () => {
    setTotalUnread(ZERO_VALUE);
    try {
      const response = await notificationService.setMarkAsReadAll();
      return response;
    } catch (error) {
      throw error;
    }
  };

  const menu = () => (
    <div className='notification-card'>
      {!isMobile && (
        <div className='header'>
          <p className='title'>{`${t('notification.txt_title')} (${totalUnread}${totalUnread > 99 ? '+' : ''})`}</p>
          <AppButton text={t('home.txt_mark_all_as_read')} onClick={handleMarkAllAsRead} />
        </div>
      )}
      {totalNotification > ZERO_VALUE ? (
        <InfiniteScroll
          dataLength={listNotification?.length}
          next={getMoreNotification}
          hasMore={listNotification?.length < totalNotification}
          loader={null}
          scrollableTarget='scrollableDiv'
          height='80%'
        >
          {listNotification?.map((notification: any) => {
            const createdDate = notification?.createdAt;
            const content = renderNotificationContent(notification);
            const isReadClass = !notification?.isRead ? 'unread-dot' : '';
            const tooltipTextNotice = notification?.content
              .replaceAll('<strong style="color:#B38465">', '')
              .replaceAll('</strong>', '');

            return (
              <div
                key={notification?._id}
                className='group'
                onClick={handleClickNotification(notification, content?.router as string)}
              >
                {isMobile && <div className='effect'>{<div className={`dot mobile-dot ${isReadClass}`} />}</div>}
                <div className='content'>
                  <EllipsisText
                    text={content?.text}
                    className='text'
                    innerHtml
                    tooltipText={tooltipTextNotice}
                    alwaysShowTooltip={true}
                  />
                  <p className='sub-text'>
                    <span>{formatDate(createdDate, FORMAT_DATE_PICKER)}</span>
                    <span>{formatDate(createdDate, FORMAT_TIME_PICKER)}</span>
                  </p>
                </div>
                {!isMobile && <div className='effect'>{!notification?.isRead ? <div className='dot' /> : null}</div>}
              </div>
            );
          })}
        </InfiniteScroll>
      ) : (
        <div className='notification-empty-text'>{t('message.E21')}</div>
      )}
    </div>
  );

  const renderRingIcon = useMemo(() => {
    return (
      <Badge count={totalUnread ? totalUnread : null} className='notification-icon' overflowCount={99}>
        <img src={RingIcon} onClick={isMobile ? handleOpenNotification : noop} />
      </Badge>
    );
  }, [totalUnread]);

  const renderHeaderDrawer = () => {
    return (
      <div className='header-menu'>
        <div className='mark-notification'>
          <p className='title'>{t('notification.txt_title')}</p>
          <AppButton text={t('home.txt_mark_all_as_read')} onClick={handleMarkAllAsRead} />
        </div>
        <img src={CloseIcon} alt='close icon' onClick={handleCloseNotification} />
      </div>
    );
  };

  return !isMobile ? (
    <AppDropdown overlay={menu} placement='bottomRight' className='notification' trigger={'click'}>
      {renderRingIcon}
    </AppDropdown>
  ) : (
    <>
      {renderRingIcon}
      <Drawer
        title={renderHeaderDrawer()}
        visible={visibleNotification}
        closable={false}
        placement='right'
        className='mobile-drawer notification'
        onClose={handleCloseNotification}
      >
        {menu()}
      </Drawer>
    </>
  );
};

export default Notification;
