import AppButton from '@components//AppButton';
import AppDropdown from '@components//AppDropdown';
import FormItem, { TYPE_INPUT } from '@components//FormItem';
import { Checkbox, Form, Tooltip } from 'antd';
import LENGTH_CONSTANTS from 'constants/length';
import { RedemptionStatus, REDEMPTION_FILTER, PURCHASE_HISTORY_LIST_FIELD } from 'constants/my-account';
import { Formik } from 'formik';
import { useModal } from 'hooks/useModal';
import isString from 'lodash/isString';
import moment, { isMoment } from 'moment';
import { TFunction, useTranslation } from 'next-i18next';
import icon_refresh from 'public/svg/icon_refresh.svg';
import icon_search from 'public/svg/icon_search.svg';
import icon_setting from 'public/svg/icon_setting.svg';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import EllipsisText from '@components//EllipsisText';
import showMessage from '@components//Message';
import TYPE_CONSTANTS from 'constants/type';
import { useWeb3React } from '@web3-react/core';

const { START_TIME, END_TIME, NFT_ID, STATUS, KEYWORD } = REDEMPTION_FILTER;
const { MAX_LENGTH_INPUT } = LENGTH_CONSTANTS;
const {
  CREATED_AT,
  NUMBER_CATEGORIES,
  QUANTITY,
  PRICE,
  STATUS: STATUS_COLUMN,
  ACTION,
  ITEM_NAME,
  CODE,
  NO,
} = PURCHASE_HISTORY_LIST_FIELD;

type SearchFilterProps = {
  paramSearch?: any;
  setParamSearch: Function;
  setCurrentColumn?: any;
  currentColumn?: any;
};

const optionsStatus = (t: TFunction) => [
  { name: t('common.all_status'), value: null },
  { name: t('common.processing'), value: RedemptionStatus.PROCESSING },
  { name: t('common.submitted'), value: RedemptionStatus.SUBMITTED },
  { name: t('common.redeemable'), value: RedemptionStatus.REDEEMABLE },
  { name: t('common.cancelled'), value: RedemptionStatus.CANCELED },
  { name: t('common.redeemed'), value: RedemptionStatus.REDEEMED },
];

const options = (t: TFunction) => [
  {
    name: t('my_activities.txt_purchase_date'),
    value: CREATED_AT,
  },
  {
    name: t('my_activities.redemption_value'),
    value: PRICE,
  },
  {
    name: t('my_activities.txt_nft_name'),
    value: ITEM_NAME,
  },
  {
    name: t('my_activities.txt_code'),
    value: CODE,
  },
  {
    name: t('my_activities.item_category'),
    value: NUMBER_CATEGORIES,
  },
  {
    name: t('my_activities.txt_status'),
    value: STATUS_COLUMN,
  },
  {
    name: t('my_activities.txt_quantity'),
    value: QUANTITY,
  },
  {
    name: t('my_activities.txt_action'),
    value: ACTION,
    disable: true,
  },
];

const SearchFilter: React.FC<SearchFilterProps> = ({ setParamSearch, setCurrentColumn, currentColumn }) => {
  const { t } = useTranslation();
  const formikRef: any = useRef();
  const timeout: any = useRef(null);

  const { visible, onCloseModal, setVisible } = useModal(false);
  const [checkboxs, setCheckbox] = useState([ITEM_NAME, STATUS_COLUMN, QUANTITY, PRICE, CREATED_AT, ACTION]);
  const [categories, setCategories]: any = useState();
  const [listName, setListName]: any = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const fromDate = formikRef?.current?.values?.[START_TIME];
  const untilDate = formikRef?.current?.values?.[END_TIME];


  const onChangeCheckbox = (value: any) => {
    setError('');
    setCheckbox(value);
  };

  const onApplyColumn = () => {
    if (checkboxs.length > 6) {
      return setError(t('message.E17', { column: 6 }));
    }
    if (checkboxs.length === 1) {
      return setError(t('message.E18'));
    }
    setCurrentColumn(checkboxs);
  };

  const overlay = useMemo(() => {
    return (
      <div className='overlay' onClick={(e) => e.stopPropagation()}>
        <div className='header'>
          <span className='title'>{t('common.column_setting')}</span>
          <span className='count'>{t('common.column_selected', { columns: checkboxs.length })}</span>
        </div>
        <Checkbox.Group onChange={onChangeCheckbox} value={checkboxs}>
          {options(t).map((item, index) => (
            <Checkbox value={item?.value} disabled={item?.disable} key={index}>
              {item?.name}
            </Checkbox>
          ))}
        </Checkbox.Group>
        <AppButton text={t('common.apply')} onClick={onApplyColumn} />
        <span className='notice'>{t('common.you_can_select', { columns: 6 })}</span>
        {error && <span className='error'>{error}</span>}
      </div>
    );
  }, [checkboxs, error]);

  const onClear = () => {
    setParamSearch({});
  };

  const onChangeData = (name: string) => (value: any) => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => {
      const _value = isMoment(value) ? value.toISOString() : isString(value) ? value.trim() : value;
      setParamSearch((state: any) => ({
        ...state,
        [name]: name === NFT_ID ? [value] : _value,
      }));
    }, 500);
  };

  const disabledFromDate = (current: moment.Moment) => {
    return (untilDate && current?.clone()?.endOf('day') > untilDate?.clone()?.endOf('day')) || current > moment();
  };

  const disabledUntilDate = (current: moment.Moment) => {
    return (fromDate && current?.clone()?.startOf('day') < fromDate?.clone()?.startOf('day')) || current > moment();
  };

  useEffect(() => {
    document.querySelector('body')?.addEventListener('click', () => {
      onCloseModal();
    });
    return () => {
      document.querySelector('body')?.removeEventListener('click', () => {});
    };
  });

  return (
    <div className='search-filter'>
      <Formik initialValues={{}} onSubmit={() => {}} innerRef={formikRef}>
        {({ handleReset }) => (
          <Form autoComplete='off'>
            <FormItem
              name={KEYWORD}
              placeholder={t('my_activities.txt_search_placeholder')}
              typeInput={TYPE_INPUT.TEXT}
              onChange={onChangeData(KEYWORD)}
              maxLength={MAX_LENGTH_INPUT}
              prefix={<img src={icon_search} alt='' />}
              className='search-filter--input'
              containerClassName='search-input'
            />
            <FormItem
              name={START_TIME}
              placeholder={t('my_activities.txt_start_date')}
              typeInput={TYPE_INPUT.DATE}
              onChange={(date: any) => onChangeData(START_TIME)(date?.clone()?.startOf('day') || null)}
              disabledDate={disabledFromDate}
            />
            <FormItem
              name={END_TIME}
              placeholder={t('my_activities.txt_end_date')}
              typeInput={TYPE_INPUT.DATE}
              onChange={(date: any) => onChangeData(END_TIME)(date?.clone()?.endOf('day') || null)}
              disabledDate={disabledUntilDate}
            />
            <FormItem
              name={STATUS}
              placeholder={t('my_activities.txt_status')}
              typeInput={TYPE_INPUT.SELECT}
              options={optionsStatus(t)}
              onChange={onChangeData(STATUS)}
            />

            <AppButton
              text={<img src={icon_refresh} alt='' />}
              variant='transparent'
              onClick={() => {
                onClear();
                handleReset();
                setListName([]);
                setCategories([]);
                setCheckAll(false);
              }}
            />

            <AppDropdown
              overlay={overlay}
              visible={visible}
              onVisibleChange={(state: any) => !state && setCheckbox(currentColumn)}
            >
              <AppButton
                text={
                  <Tooltip title={t('common.column_setting')}>
                    <img src={icon_setting} alt='' />
                  </Tooltip>
                }
                className='setting'
                onClick={(e) => {
                  setVisible((state) => !state);
                  e.stopPropagation();
                }}
              />
            </AppDropdown>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SearchFilter;
