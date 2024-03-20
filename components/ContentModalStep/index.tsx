import React, { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import SuccessfulIcon from 'public/images/successful_icon.png';

type ContentModalStepProps = {
  src?: string;
  title?: string;
  className?: string;
  innerHtml?: boolean;
  customDescription?: ReactNode;
  description?: string | any;
};

const ContentModalStep = ({
  src,
  className,
  title,
  innerHtml,
  customDescription,
  description,
}: ContentModalStepProps) => {
  const { t } = useTranslation();

  return (
    <div className={classNames('modal-failed', className)}>
      <p className='title'>{title || t('common.txt_failed')}</p>
      <img src={src || SuccessfulIcon} />
      {customDescription ? (
        <div className='description'>{customDescription}</div>
      ) : innerHtml ? (
        <p className='description' dangerouslySetInnerHTML={{ __html: description }} />
      ) : (
        <p className='description'>{description}</p>
      )}
    </div>
  );
};

export default ContentModalStep;
