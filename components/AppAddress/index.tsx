import { ReactNode } from 'react';
import { Divider, Tooltip, Typography } from 'antd';

import EllipsisText from 'components/EllipsisText';

import CopyIcon from 'public/svg/copy_icon.svg';
import OpenLinkIcon from 'public/svg/open_in_new_icon.svg';
import warning_icon from 'public/svg/warning_icon.svg';
import { CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';

import { shortenAddress } from 'utils';
import { useTranslation } from 'next-i18next';
import AppLink from '../AppLink';
import { externalRoutes } from 'constants/routes';
import { TOKEN_STATUS } from 'constants/nft';

const { Paragraph } = Typography;
const { INVALID } = TOKEN_STATUS;

type AddressCopyProps = {
  address: string;
  isVisibleCopy?: boolean;
  isShorten?: boolean;
  subAddress?: ReactNode;
  customAddress?: string;
  addressClassName?: string;
  srcCopy?: string;
  isBDA?: boolean;
  kycIsVerified?: boolean;
  isVisibleKyc?: boolean;
  isVisibleUserType?: boolean;
  isVisibleOpenLink?: boolean;
  textViewOpenLink?: string;
  tokenId?: string;
  contractAddress?: string;
  tokenStatus?: string;
};

const AppAddress = ({
  address,
  isVisibleCopy = true,
  isShorten = true,
  subAddress,
  customAddress,
  addressClassName,
  srcCopy,
  isVisibleOpenLink,
  textViewOpenLink,
  tokenId,
  contractAddress,
  tokenStatus,
}: AddressCopyProps) => {
  const { t } = useTranslation();
  const renderAddress = customAddress ? customAddress : address;

  return (
    <div>
      <div className='app-address'>
        <EllipsisText text={isShorten ? shortenAddress(renderAddress) : renderAddress} className={addressClassName} />
        {tokenStatus === INVALID && (
          <div className='info-button'>
            <Tooltip title={t('common.txt_invalid_token')}>
              <img src={warning_icon} className='info-button__warning' />
            </Tooltip>
          </div>
        )}

        {subAddress && <EllipsisText text={subAddress} />}
        {isVisibleCopy && (
          <Paragraph
            copyable={{
              text: address,
              icon: <img className='app-address__icon' src={srcCopy || CopyIcon} key='copy-icon' />,
            }}
          />
        )}
        {isVisibleOpenLink && (
          <AppLink
            href={
              tokenId && contractAddress
                ? externalRoutes.POLYGON_SCAN_TOKEN(contractAddress, tokenId)
                : externalRoutes.POLYGON_SCAN_ADDRESS(address)
            }
            target='_blank'
            rel='noreferrer'
          >
            <Tooltip title={textViewOpenLink ? textViewOpenLink : t('common.txt_view_on_bscScan')}>
              <div className='info-button'>
                <img src={OpenLinkIcon} className='info-button__icon' />
              </div>
            </Tooltip>
          </AppLink>
        )}
      </div>
    </div>
  );
};

export default AppAddress;
