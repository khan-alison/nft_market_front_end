import { TFunction } from 'next-i18next';
import { formatDate } from 'utils';
import ResponsiveImage from '@components//ResponsiveImage';
import EllipsisText from '@components//EllipsisText';
import AppLink from '@components//AppLink';
import { NFT_OWNED_FIELDS, NFT_PREFIX_CODE, TOKEN_STATUS } from 'constants/nft';
import { FORMAT_DATETIME_PICKER } from 'constants/common';
import moment from 'moment';
import AppAddress from '@components//AppAddress';
import { renderURLs, routeURLs } from 'constants/routes';
import { Tooltip } from 'antd';
import HelpIcon from 'public/svg/help_icon.svg';

const { TOKEN_ID, MINT_DATE, EVENT_NAME, REDEEM, INFORMATION } = NFT_OWNED_FIELDS;
const { INVALID } = TOKEN_STATUS;

export const columns = (t: TFunction, page: number, limit: number, isNFTBlack?: boolean) => [
  {
    title: t('nft_detail.txt_no'),
    width: 20,
    ellipsis: true,
    render: (_value: any, _row: any, index: number) => (page - 1) * limit + index + 1,
  },
  {
    title: t('nft_detail.txt_information'),
    dataIndex: INFORMATION,
    key: INFORMATION,
    width: 70,
    ellipsis: true,
    render: (_value: any, _row: any) => (
      <div className='column-event-information'>
        {isNFTBlack === false && (
          <div className='column-event-information__image'>
            <ResponsiveImage src={_row?.owners?.event?.imgUrl} />
          </div>
        )}
        <div className='column-event-information__content'>
          {isNFTBlack === false && <EllipsisText text={_row?.owners?.event?.name} />}
          <AppAddress
            addressClassName={'text_token_id'}
            address={_row?.owners?.tokenId}
            isVisibleCopy={true}
            isVisibleKyc={false}
            isVisibleUserType={false}
            isVisibleOpenLink
          />
          <EllipsisText text={moment(_row?.owners?.mintedDate).format(FORMAT_DATETIME_PICKER)} />
        </div>
      </div>
    ),
  },
  {
    title: t('nft_detail.txt_token_id'),
    dataIndex: TOKEN_ID,
    key: TOKEN_ID,
    width: 60,
    ellipsis: true,
    render: (_value: any, _row: any) => (
      <AppAddress
        addressClassName={'text_token_id'}
        textViewOpenLink={t('common.view_on_polygon')}
        address={`${_row?.owners?.tokenId}`}
        tokenId={_row?.owners?.tokenId}
        contractAddress={_row?.token?.address}
        isVisibleCopy={true}
        isVisibleKyc={false}
        isVisibleUserType={false}
        tokenStatus={_row?.owners?.status}
        isVisibleOpenLink
      />
    ),
  },
  {
    title: t('nft_detail.txt_mint_date'),
    width: 60,
    dataIndex: MINT_DATE,
    key: MINT_DATE,
    sorter: true,
    render: (value: any, _row: any) => moment(_row?.owners?.mintedDate).format(FORMAT_DATETIME_PICKER),
  },
  {
    title: t('nft_detail.txt_event_name'),
    width: 60,
    dataIndex: EVENT_NAME,
    key: EVENT_NAME,
    sorter: true,
    render: (value: any, _row: any) => (
      <AppLink href={'#'} target='_blank' rel='noreferrer'>
        <div className='column-event-name'>
          <ResponsiveImage src={_row?.owners?.event?.imgUrl} />
          <EllipsisText text={_row?.owners?.event?.name} />
        </div>
      </AppLink>
    ),
  },
  {
    title: (
      <>
        {t('nft_detail.txt_actions')}
        <Tooltip title={t('nft_detail.txt_help_action_redeem')} overlayClassName='tooltip-detail'>
          <img src={HelpIcon} />
        </Tooltip>
      </>
    ),
    width: 50,
    dataIndex: REDEEM,
    key: REDEEM,
    sorter: false,
    render: (value: any, _row: any) =>
      _row?.isRedeem && _row?.owners?.status !== INVALID ? (
        <div className='column-actions'>
          <AppLink target='_blank' href={'#'}>
            {t('nft_detail.text_redeem')}
          </AppLink>
        </div>
      ) : (
        ''
      ),
  },
];
