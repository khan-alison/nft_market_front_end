import React, { memo, ReactNode, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import noop from 'lodash/noop';

import ModalComponent from 'components/Modal';
import ContentModalStep from 'components/ContentModalStep';

import FailedIcon from 'public/images/failed_icon.png';
import ProcessingIcon from 'public/images/processing_icon.png';
import SuccessfulIcon from 'public/images/successful_icon.png';

type ModalStepProps = {
  visible: boolean;
  loadingSrc?: string;
  innerHtml?: boolean;

  failed?: boolean;
  failedDescription?: ReactNode;
  failedTitle?: string;
  failedSrc?: string;
  onFailedClose?: () => void;
  failedClassName?: string;
  textFailedDescription?: string;

  successfulDescription?: ReactNode;
  successful?: boolean;
  successfulTitle?: string;
  successfulSrc?: string;
  onSuccessfulClose?: () => void;
  successfullClassName?: string;
  textSuccessfulDescription?: string;

  processing?: boolean;
  processingTitle?: string;
  processingSrc?: string;
  processingDescription?: ReactNode;
  processingClassName?: string;
  textProcessingDescription?: string;

  maskClosable?: boolean;
  showCloseIcon?: boolean;
};

const ModalStep = memo(
  ({
    visible,
    loadingSrc,
    innerHtml,
    failed,
    failedTitle,
    failedSrc,
    failedDescription,
    textFailedDescription,
    onFailedClose,
    failedClassName,

    successful,
    successfulSrc,
    successfulTitle,
    successfulDescription,
    onSuccessfulClose,
    successfullClassName,
    textSuccessfulDescription,

    processing,
    processingSrc,
    processingTitle,
    processingDescription,
    processingClassName,
    textProcessingDescription,

    maskClosable,
    showCloseIcon,
    ...props
  }: ModalStepProps) => {
    const { t } = useTranslation();
    const defaultSuccessDescription = textSuccessfulDescription || (t('common.txt_successful') as any);
    const defaultFailedDescription = textFailedDescription || (t('common.txt_failed_description') as any);
    const defaultProcessingDescription =
      textProcessingDescription || (t('common.txt_processing_request_description') as any);

    const dependences = [processing, successful, failed];

    const handleOnclose = () => {
      switch (true) {
        case failed:
          return onFailedClose && onFailedClose();
        case successful:
          return onSuccessfulClose && onSuccessfulClose();
        default:
          return noop;
      }
    };

    const renderContent = useMemo(() => {
      switch (true) {
        case failed:
          return {
            title: failedTitle || t('common.txt_failed'),
            src: FailedIcon,
            className: classNames('modal-failed', failedClassName),
            customDescription: failedDescription,
            description: defaultFailedDescription,
          };
        case successful:
          return {
            title: successfulTitle || t('common.txt_successful'),
            src: SuccessfulIcon,
            className: classNames('modal-successful', successfullClassName),
            customDescription: successfulDescription,
            description: defaultSuccessDescription,
          };
        default:
          return {
            title: processingTitle || t('common.txt_processing_request'),
            src: ProcessingIcon,
            className: classNames('modal-processing', processingClassName),
            customDescription: processingDescription,
            description: defaultProcessingDescription,
          };
      }
    }, dependences);

    return (
      <ModalComponent
        width={550}
        visible={visible}
        maskClosable={maskClosable}
        showCloseIcon={showCloseIcon}
        onClose={handleOnclose}
        {...props}
      >
        <ContentModalStep innerHtml={innerHtml} {...renderContent} />
      </ModalComponent>
    );
  },
);

export default ModalStep;
