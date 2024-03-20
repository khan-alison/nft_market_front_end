import React, { Fragment, FC } from 'react';
import { Modal as ModalAntd, Typography } from 'antd';

import CloseIcon from 'public/svg/close_icon.svg';

const { Title } = Typography;

const Modal: FC<{
  title?: any;
  onClose?: any;
  showCloseIcon?: boolean;
  visible: boolean;
  width?: number | string;
  maskClosable?: boolean;
  wrapClassName?: string;
  getContainer?: any;
  destroyOnClose?: boolean;
}> = ({ children, title, onClose, showCloseIcon = true, width, destroyOnClose = true, maskClosable, ...props }) => {
  return (
    <ModalAntd
      footer={null}
      wrapClassName='modal'
      closable={false}
      width={width ?? 565}
      destroyOnClose={destroyOnClose}
      onCancel={onClose}
      maskClosable={maskClosable || showCloseIcon}
      {...props}
    >
      <Fragment>
        {showCloseIcon && <img src={CloseIcon} onClick={onClose} className='modal-close-icon cursor-pointer' />}
        <div className='modal-wrap'>
          <Title level={5} className='title'>
            {title}
          </Title>
          {children}
        </div>
      </Fragment>
    </ModalAntd>
  );
};

export default Modal;
