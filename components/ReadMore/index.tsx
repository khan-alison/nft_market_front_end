import React, { useState } from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'next-i18next';
import classnames from 'classnames';

const { Paragraph } = Typography;

const ReadMore: React.FC<{ values: string; rows?: number; classNameWrapper?: string; className?: string }> = ({
  values,
  rows = 3,
  classNameWrapper,
  className,
}) => {
  const { t } = useTranslation();
  const [status, setStatus] = useState({
    expand: false,
    counter: 0,
  });

  const typoExpand = () => {
    setStatus({
      expand: true,
      counter: !status.expand ? status.counter : status.counter + 1,
    });
  };

  const typoClose = () => {
    setStatus({
      expand: false,
      counter: !status.expand ? status.counter : status.counter + 1,
    });
  };

  return (
    <div className={classnames([classNameWrapper])} key={status.counter}>
      <Paragraph
        className={classnames([className])}
        ellipsis={{
          rows: rows,
          expandable: true,
          onExpand: typoExpand,
          symbol: t('common.view_mode'),
        }}
      >
        {values}
        {status.expand && (
          <a onClick={typoClose} className='ant-typography-expand'>
            {t('common.show_less')}
          </a>
        )}
      </Paragraph>
    </div>
  );
};

export default ReadMore;
