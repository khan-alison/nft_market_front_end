import { useModal } from 'hooks/useModal';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';

type ReadMoreProps = {
  textContent: string;
  contentClassName?: string;
  textSlice?: number;
};

const ReadMore = ({ textContent, contentClassName, textSlice = 250 }: ReadMoreProps) => {
  const { t } = useTranslation();

  const [isReadMore, setIsReadMore] = useState(true);
  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  return (
    <>
      <div className={contentClassName}>
        {isReadMore && textContent?.slice(0, textSlice).length === textSlice
          ? `${textContent?.slice(0, textSlice)}...`
          : textContent}
      </div>
      {textContent?.slice(0, textSlice).length === textSlice && (
        <div onClick={toggleReadMore} className='read-or-hide'>
          {isReadMore ? t('common.txt_read_more') : t('common.txt_show_less')}
        </div>
      )}
    </>
  );
};

export default ReadMore;
