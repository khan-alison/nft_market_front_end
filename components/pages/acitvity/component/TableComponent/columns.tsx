import AppNumber from '@components//AppNumber';
import { Typography, Tooltip } from 'antd';
import cx from 'classnames';
import AppLink from 'components/AppLink';
import { FORMAT_DATETIME_PICKER } from 'constants/common';
import { RedemptionStatus, PURCHASE_HISTORY_LIST_FIELD } from 'constants/my-account';
import { renderURLs } from 'constants/routes';
import moment from 'moment';
import { TFunction } from 'next-i18next';
import CopyIcon from 'public/svg/copy_icon_white.svg';
import { Fragment } from 'react';
import { shortenAddress } from 'utils';

const { Paragraph } = Typography;

const { CREATED_AT, ITEM_NAME, QUANTITY, PRICE, STATUS, ACTION, NO, NUMBER_CATEGORIES, CODE, INFORMATION } =
  PURCHASE_HISTORY_LIST_FIELD;

export const renderStatus = (status: string, t: TFunction) => {
  switch (status) {
    case RedemptionStatus.PROCESSING:
      return {
        name: t('common.processing'),
        value: RedemptionStatus.PROCESSING,
      };
    case RedemptionStatus.SUBMITTED:
      return {
        name: t('common.submitted'),
        value: RedemptionStatus.SUBMITTED,
      };
    case RedemptionStatus.REDEEMABLE:
      return {
        name: t('common.redeemable'),
        value: RedemptionStatus.REDEEMABLE,
      };
    case RedemptionStatus.CANCELED:
      return {
        name: t('common.cancelled'),
        value: RedemptionStatus.CANCELED,
      };
    case RedemptionStatus.REDEEMED:
      return {
        name: t('common.redeemed'),
        value: RedemptionStatus.REDEEMED,
      };
    case RedemptionStatus.DRAFT:
      return {
        name: t('common.draft'),
        value: RedemptionStatus.DRAFT,
      };
    default:
      return {
        name: '',
        value: '',
      };
  }
};

const privateColumn = (t: any) => [
  {
    title: t('my_activities.txt_purchase_date'),
    dataIndex: CREATED_AT,
    key: CREATED_AT,
    sorter: true,
    render: (time: any) => moment(time).format(FORMAT_DATETIME_PICKER),
  },
  {
    title: t('my_activities.txt_quantity'),
    dataIndex: QUANTITY,
    key: QUANTITY,
    sorter: true,
    render: (value: number | string) => <AppNumber value={value} />,
  },
  {
    title: t('my_activities.txt_nft_name'),
    dataIndex: ITEM_NAME,
    key: ITEM_NAME,
    sorter: true,
    render: (value: number | string) => <AppNumber value={value} />,
  },
  {
    title: t('my_activities.txt_price'),
    dataIndex: QUANTITY,
    key: QUANTITY,
    sorter: true,
    render: (value: number | string) => <AppNumber value={value} />,
  },
  {
    title: t('my_activities.item_category'),
    dataIndex: NUMBER_CATEGORIES,
    key: NUMBER_CATEGORIES,
    sorter: true,
    render: (value: number | string, data?: any) => {
      const nftNameList = (data?.items || []).map((item: any) => item?.nftName);
      return (
        <Tooltip title={() => nftNameList?.map((item: any, index?: any) => <span key={index}>{item}</span>)}>
          <AppNumber value={value} />
        </Tooltip>
      );
    },
  },
  {
    title: t('my_activities.redeem_code'),
    dataIndex: CODE,
    key: CODE,
    sorter: true,
    render: (value: string, item: any) => {
      return (item?.status === RedemptionStatus.REDEEMABLE || item?.status === RedemptionStatus.REDEEMED) && value ? (
        <Paragraph
          copyable={{
            text: value,
            icon: <img className='app-address__icon' src={CopyIcon} key='copy-icon' />,
          }}
          className='code'
        >
          {shortenAddress(value)}
        </Paragraph>
      ) : (
        '--'
      );
    },
  },
  {
    title: t('my_activities.redemption_value'),
    dataIndex: PRICE,
    key: PRICE,
    sorter: true,
    render: (value: any) => (
      <Fragment>
        <AppNumber value={value} prefix='$' decimalScale={18} />
      </Fragment>
    ),
  },
  {
    title: t('my_activities.txt_status'),
    dataIndex: STATUS,
    key: STATUS,
    render: (status: string) => (
      <span className={cx('status', renderStatus(status, t)?.value)}>{renderStatus(status, t)?.name}</span>
    ),
  },
  {
    title: t('my_activities.txt_action'),
    dataIndex: ACTION,
    key: ACTION,
    render: (id: string) => <AppLink href={'#'}>{t('common.view_detail')}</AppLink>,
  },
];

const renderColumn = (t: TFunction, currentColumn: any) => {
  return privateColumn(t).filter((item) => currentColumn.includes(item?.key));
};

export const columns = (t: TFunction, currentColumn: any) => {
  const dynamicColumn = renderColumn(t, currentColumn);
  return [
    {
      title: t('common.no'),
      dataIndex: NO,
      key: NO,
      width: '5%',
    },
    ...dynamicColumn,
  ];
};

export const columnsMobile = (t: TFunction, currentColumn: any) => {
  const checkExist = (field: string) => {
    return !!currentColumn?.includes(field);
  };

  return [
    {
      title: t('common.information'),
      dataIndex: INFORMATION,
      key: INFORMATION,
      render: (item?: any) => {
        return (
          <div className='information create'>
            <div className='top'>
              <div className='left'>
                {checkExist(ITEM_NAME) && <span className='request_id'>{item?.[ITEM_NAME]}</span>}
                {checkExist(CREATED_AT) && (
                  <span className='time'>{moment(item?.[CREATED_AT]).format(FORMAT_DATETIME_PICKER)}</span>
                )}
                {checkExist(STATUS) && (
                  <span className={cx('status', renderStatus(item?.[STATUS], t)?.value)}>
                    {renderStatus(item?.[STATUS], t)?.name}
                  </span>
                )}
              </div>
              <div className='right'>
                <AppLink href={'#'}>{t('common.view_detail')}</AppLink>
              </div>
            </div>
            <div className='bottom'>
              {checkExist(QUANTITY) && (
                <div className='item'>
                  <div className='label'>{t('redemption.quantity')}</div>
                  <div className='value'>
                    <AppNumber value={item?.[QUANTITY]} />
                  </div>
                </div>
              )}
              {checkExist(PRICE) && (
                <div className='item'>
                  <div className='label'>{t('redemption.redemption_value')}</div>
                  <div className='value'>
                    <AppNumber value={item?.[PRICE]} prefix='$' decimalScale={10} />
                  </div>
                </div>
              )}
              {checkExist(CODE) && (
                <div className='item'>
                  <div className='label'>{t('redemption.redeem_code')}</div>
                  <div className='value'>
                    {(item?.status === RedemptionStatus.REDEEMABLE || item?.status === RedemptionStatus.REDEEMED) &&
                    item?.[CODE] ? (
                      <Paragraph
                        copyable={{
                          text: item?.code,
                          icon: <img className='app-address__icon' src={CopyIcon} key='copy-icon' />,
                        }}
                        className='code'
                      >
                        {shortenAddress(item?.[CODE])}
                      </Paragraph>
                    ) : (
                      '--'
                    )}
                  </div>
                </div>
              )}
              {checkExist(NUMBER_CATEGORIES) && (
                <div className='item'>
                  <div className='label'>{t('redemption.item_category')}</div>
                  <div className='value'>
                    <AppNumber value={item?.[NUMBER_CATEGORIES]} />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
  ];
};
