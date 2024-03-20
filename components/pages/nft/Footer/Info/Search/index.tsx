import React, { useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Form, Formik, useFormikContext } from 'formik';
import { Col, Row } from 'antd';
import moment from 'moment';

import FormItem, { TYPE_INPUT } from '@components//FormItem';

import ResetIcon from 'public/svg/reset_icon.svg';
import ActivitiesSearchIcon from 'public/svg/activities_search_icon.svg';

import selectedAddress from 'redux/address/selector';

import { useMobile } from 'hooks/useWindowSize';
import { useAppSelector } from 'hooks/useStore';

import LENGTH_CONSTANTS from 'constants/length';
import { NFT_OWNED_FIELDS } from 'constants/nft';
import { isString, noop, omit, trim } from 'lodash';
import { useDebounce } from 'hooks/useDebounce';
import TIME_CONSTANTS from 'constants/time';

const { FROM, KEYWORD, UNTIL, REDEEMABLE, PAGE, LIMIT } = NFT_OWNED_FIELDS;
const { DEFAULT_PAGE, DEFAULT_PAGE_SIZE, MAX_LENGTH_INPUT } = LENGTH_CONSTANTS;

export const initFormValues = {
  [FROM]: '',
  [UNTIL]: '',
  [REDEEMABLE]: 0,
  [KEYWORD]: '',
};

type SearchFilterProps = {
  params?: any;
  onSetParams: Function;
};

const Search = ({ onSetParams, params }: SearchFilterProps) => {
  const { t } = useTranslation();
  const formikRef = useRef<any>(null);
  const [searchValue, setSearchValue] = useState('');
  const { address } = useAppSelector(selectedAddress.getAddress);
  const debouncedSearchVal = useDebounce(searchValue, TIME_CONSTANTS.DEBOUNCE_SEARCH_TIME);

  const fromDate = formikRef?.current?.values?.[FROM];
  const untilDate = formikRef?.current?.values?.[UNTIL];

  useEffect(() => {
    address && handleResetField();
  }, [address]);

  useEffect(() => {
    onSetParams({
      ...params,
      [KEYWORD]: debouncedSearchVal,
      [PAGE]: DEFAULT_PAGE,
    });
  }, [debouncedSearchVal]);

  const handleResetField = () => {
    onSetParams({
      [PAGE]: DEFAULT_PAGE,
      [LIMIT]: DEFAULT_PAGE_SIZE,
    });
    formikRef?.current?.resetForm();
    setSearchValue('');
  };

  const handleFieldChange = (setFieldValue: any, field: string) => (value: any) => {
    const valueToString = isString(value) ? value : value?.toISOString();
    if (KEYWORD === field) {
      setFieldValue(field, valueToString);
      setSearchValue(valueToString);
      return;
    }

    setFieldValue(field, value);
    onSetParams({
      ...params,
      [field]: valueToString,
      [PAGE]: DEFAULT_PAGE,
    });
  };

  const handleCheckBoxChange = (setFieldValue: any, field: string) => (value: any) => {
    setFieldValue(field, value.target.checked ? 1 : 0);
    if (value.target.checked) {
      onSetParams({
        ...params,
        [field]: 1,
        [PAGE]: DEFAULT_PAGE,
      });
    } else {
      params = omit(params, [field]);

      onSetParams({
        ...params,
        [PAGE]: DEFAULT_PAGE,
        [LIMIT]: DEFAULT_PAGE_SIZE,
      });
    }
  };

  const disabledFromDate = (current: moment.Moment) => {
    return (untilDate && current?.clone()?.endOf('day') > untilDate?.clone()?.endOf('day')) || current > moment();
  };

  const disabledUntilDate = (current: moment.Moment) => {
    return (fromDate && current?.clone()?.startOf('day') < fromDate?.clone()?.startOf('day')) || current > moment();
  };

  return (
    <Formik initialValues={initFormValues} onSubmit={noop} innerRef={formikRef}>
      {({ setFieldValue, values }) => (
        <Form>
          <Row gutter={24} className='search-filter'>
            <Col lg={7} md={10} xs={24} className='search-filter__keyword'>
              <FormItem
                name={KEYWORD}
                placeholder={t('nft_detail.txt_search_nft_item')}
                prefix={<img src={ActivitiesSearchIcon} />}
                onChange={handleFieldChange(setFieldValue, KEYWORD)}
                maxLength={MAX_LENGTH_INPUT}
                allowClear
              />
            </Col>
            <Col lg={3} md={7} xs={12} className='search-filter__from'>
              <FormItem
                name={FROM}
                typeInput={TYPE_INPUT.DATE}
                placeholder={t('nft_detail.txt_nft_start_mint_date')}
                onChange={(date: any) => handleFieldChange(setFieldValue, FROM)(date?.clone()?.startOf('day') || null)}
                disabledDate={disabledFromDate}
              />
            </Col>
            <Col lg={3} md={7} xs={12} className='search-filter__until'>
              <FormItem
                name={UNTIL}
                typeInput={TYPE_INPUT.DATE}
                placeholder={t('nft_detail.txt_nft_end_mint_date')}
                onChange={(date: any) => handleFieldChange(setFieldValue, UNTIL)(date?.clone()?.endOf('day') || null)}
                disabledDate={disabledUntilDate}
              />
            </Col>
            <Col lg={3} md={7} xs={20} className='col-checkbox'>
              <FormItem
                label={' '}
                content={t('nft_detail.text_redemable')}
                name={REDEEMABLE}
                typeInput={TYPE_INPUT.CHECKBOX}
                onChange={handleCheckBoxChange(setFieldValue, REDEEMABLE)}
                checked={values?.[REDEEMABLE] ? true : false}
              />
            </Col>
            <Col lg='auto' md='auto' xs='auto' className='col-reset'>
              <img src={ResetIcon} className='cursor-pointer reset-icon' onClick={handleResetField} />
            </Col>
          </Row>
        </Form>
      )}
    </Formik>
  );
};

export default Search;
