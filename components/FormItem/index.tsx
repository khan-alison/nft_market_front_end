import React, { memo, FC, Fragment, useEffect, useState, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Field, ErrorMessage, FieldInputProps, FieldConfig, FormikProps } from 'formik';
import { Input, Select, Checkbox, Switch, DatePicker, Radio, AutoComplete, Slider } from 'antd';
import cx from 'classnames';
import { trim } from 'lodash';

import NumberFormat from 'components/NumberFormat';
import InfinityScrollSelect from 'components/InfinityScrollSelect';

import NodataIcon from 'public/images/no_nft_icon.png';
import EyeIcon from 'public/svg/EyeIcon';
import IconCalendar from 'public/svg/CalendarIcon';
import EyeInvisibleIcon from 'public/svg/EyeInvisibleIcon';

import validate from 'utils/validate';

import LENGTH_CONSTANTS from 'constants/length';
import { FORMAT_DATE_PICKER } from 'constants/common';
import { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { useDebounce } from 'hooks/useDebounce';
import TIME_CONSTANTS from 'constants/time';

const { Password, Search, TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
const { Option } = Select;

const levelPassword = [
  { level: 0, text: 'common.low' },
  { level: 1, text: 'common.low' },
  { level: 2, text: 'common.medium' },
  { level: 3, text: 'common.high' },
  { level: 4, text: 'common.high' },
];

export const TYPE_INPUT = {
  TEXT: 'TEXT',
  TEXTAREA: 'TEXTAREA',
  DATE: 'DATE',
  PASSWORD: 'PASSWORD',
  SELECT: 'SELECT',
  CHECKBOX: 'CHECKBOX',
  CHECKBOXGROUP: 'CHECKBOXGROUP',
  NUMBER: 'NUMBER',
  SEARCH: 'SEARCH',
  SELECT_INFINITY_SCROLL: 'SELECT_INFINITY_SCROLL',
  SWITCH: 'SWITCH',
  RADIO: 'RADIO',
  AUTOCOMPLETE: 'AUTOCOMPLETE',
  RANGE: 'RANGE',
  SEARCH_DEBOUNCE: 'SEARCH_DEBOUNCE',
};

export const RangeInput: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  props: any;
  onChange?: any;
}> = ({ field, form, ...props }) => {
  const { onChange } = props;

  const handleChange = (val: any) => {
    if (onChange) {
      onChange(val);
    } else {
      form.setFieldValue(field.name, val);
    }
  };

  return <Slider {...field} onChange={handleChange} {...props} />;
};

export const AutoCompleteInput: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  placeholder: string;
  onChange?: any;
  onBlur?: any;
  props: any;
}> = ({ field, form, placeholder, ...props }) => {
  const { onChange, onBlur } = props;

  const handleChange = (val: any) => {
    if (onChange) {
      onChange(val);
    } else {
      form.setFieldValue(field.name, val);
    }
  };

  const handleBlur = (e: any) => {
    const { value } = e.target;

    if (!onBlur) {
      form.handleBlur(e);
      form.setFieldValue(field.name, trim(value));
    } else {
      onBlur(e);
    }
  };

  return (
    <AutoComplete {...field} {...props} onChange={handleChange} onBlur={handleBlur} showArrow>
      <Input {...props} {...field} placeholder={placeholder} onBlur={handleBlur} />
    </AutoComplete>
  );
};

export const TextInput: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  props: any;
  onChange?: any;
  onBlur?: any;
}> = ({ field, form, ...props }) => {
  const { onChange, onBlur } = props as any;
  const handleChange = (e: any) => {
    const { value } = e.target;
    if (onChange) {
      onChange(value);
    }
    form.setFieldValue(field.name, value);
  };

  const handleBlur = (e: any) => {
    const { value } = e.target;
    if (!onBlur) {
      form.handleBlur(e);
      form.setFieldValue(field.name, trim(value));
    } else {
      onBlur(e);
    }
  };

  return (
    <Input
      maxLength={LENGTH_CONSTANTS.MAX_LENGTH_INPUT}
      {...field}
      {...props}
      onChange={handleChange}
      onBlur={handleBlur}
      value={form.values[field.name]}
    />
  );
};

export const InputTextArea: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  maxLength?: number;
  props: any;
}> = ({ maxLength, field, form, ...props }) => {
  const maxLengthTextarea = maxLength || LENGTH_CONSTANTS.MAX_LENGTH_INPUT;

  const { onChange, onBlur } = props as any;
  const handleChange = (e: any) => {
    const { value } = e.target;
    if (!onChange) {
      form.setFieldValue(field.name, value);
    } else {
      onChange(e);
    }
  };

  const handleBlur = (e: any) => {
    const { value } = e.target;
    if (!onBlur) {
      form.handleBlur(e);
      form.setFieldValue(field.name, trim(value));
    } else {
      onBlur(e);
    }
  };

  return (
    <div className='text-area'>
      <TextArea
        rows={5}
        maxLength={maxLengthTextarea}
        {...field}
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        value={form.values[field.name]}
      />
    </div>
  );
};

export const InputDate: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  onChange?: any;
  props: any;
}> = ({ field, form, onChange, ...props }) => {
  const handleChange = (val: any) => {
    if (onChange) {
      onChange(val);
    }
    form.setFieldValue(field.name, val);
  };

  return (
    <DatePicker
      format={FORMAT_DATE_PICKER}
      inputReadOnly
      suffixIcon={<IconCalendar style={{ color: 'red' }} />}
      {...field}
      {...props}
      onChange={handleChange}
    />
  );
};

export const NumberInput: FC<{
  field: FieldInputProps<any>;
  props: any;
  form: FormikProps<any>;
  unit: string;
  thousandSeparator?: boolean;
  onChange?: any;
  onValueChange?: any;
}> = ({ field, form, unit, thousandSeparator, onChange, onValueChange, ...props }) => {
  const handleChange = (e: React.ChangeEvent<any>) => {
    if (thousandSeparator) {
      return;
    } else {
      field.onChange(e);
    }
  };

  const handleValueChange = (values: any) => {
    if (thousandSeparator) {
      form.setFieldValue(field.name, values?.value);
    }
  };

  return (
    <Fragment>
      <NumberFormat
        allowNegative={false}
        customInput={Input}
        thousandSeparator={thousandSeparator}
        onValueChange={onValueChange ?? handleValueChange}
        {...field}
        {...props}
        onChange={onChange ?? handleChange}
      />
      {unit && <span className='unit'>{unit}</span>}
    </Fragment>
  );
};

export const SearchInput: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  props: any;
}> = ({ field, form, ...props }) => {
  return <Search maxLength={LENGTH_CONSTANTS.MAX_LENGTH_INPUT} {...field} {...props} />;
};

export const PasswordInput: FC<{
  field: FieldInputProps<any>;
  props: any;
  showLevelPassword?: boolean;
  label?: any;
  labelClassName?: string;
  required?: boolean;
  form: FormikProps<any>;
}> = ({ required, field, showLevelPassword, label, labelClassName, form, ...props }) => {
  const fieldVal = field.value;
  const addClassLevel =
    validate.passwordStrength(fieldVal) < 2
      ? 'input__label--low'
      : validate.passwordStrength(fieldVal) < 3
      ? 'input__label--medium'
      : validate.passwordStrength(fieldVal) < 5
      ? 'input__label--high'
      : '';
  const { t } = useTranslation('common');
  return (
    <>
      {label && showLevelPassword && (
        <div className={cx('form-item__label', labelClassName)}>
          {!!fieldVal && !!showLevelPassword && (
            <div className='input__label--level'>
              {levelPassword.map((item) => (
                <span
                  className={`input__label--level-item ${
                    item.level <= validate.passwordStrength(fieldVal) && addClassLevel
                  }`}
                  key={item.level}
                />
              ))}
              <span className={`input__label--level-title ${addClassLevel}`}>
                {t(levelPassword.filter((item) => item.level === validate.passwordStrength(fieldVal))[0]?.text)}
              </span>
            </div>
          )}
        </div>
      )}
      <Password iconRender={(visible) => (!visible ? <EyeInvisibleIcon /> : <EyeIcon />)} {...field} {...props} />
    </>
  );
};

export const SelectInput: FC<{
  field: FieldInputProps<any>;
  props: FieldConfig;
  form: FormikProps<any>;
  options: {
    value: any;
    name: any;
    label: any;
  }[];
  prefix?: any;
  className?: string;
  onChange?: any;
  mode?: any;
  values?: any;
  optionsType?: any;
  enableAllOption?: any;
  placeholder?: string;
  optionCustom?: any;
}> = ({
  field,
  form,
  options,
  prefix,
  className,
  onChange,
  optionsType,
  enableAllOption,
  placeholder,
  optionCustom,
  ...props
}) => {
  const { t } = useTranslation();

  const ALL_OPTIONS = 'all-options';
  const [indeterminate, setIndeterminate] = useState(true);
  const [checkAll, setCheckAll] = useState(false);
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>([]);
  const { value } = field;

  useEffect(() => {
    setIndeterminate(!!value && !!value.length && value.length < options.length);
    setCheckAll(!!value && !!value.length && value.length === options.length);
    setCheckedList(value);
  }, [value]);

  const onCheckAllOptions = (event: any) => {
    const { checked } = event.target;
    let values = [];
    if (checked) {
      values = options.map((option) => option.value);
    } else {
      values = [];
    }
    setCheckedList(values);
    setIndeterminate(false);
    setCheckAll(checked);
    onChangeSelect(values);
  };

  const optionsSelectAllRender = () => {
    switch (optionsType) {
      case TYPE_INPUT.CHECKBOXGROUP:
      case TYPE_INPUT.CHECKBOX: {
        return (
          <div className='search-form__all-options'>
            <Checkbox onChange={onCheckAllOptions} id={ALL_OPTIONS} indeterminate={indeterminate} checked={checkAll}>
              {t('common.txt_all')}
            </Checkbox>
          </div>
        );
      }
      default: {
        return null;
      }
    }
  };

  const optionsRender = (item: any) => {
    switch (optionsType) {
      case TYPE_INPUT.CHECKBOX: {
        return (
          <Checkbox id={item.value} checked={value && value.indexOf(item.value) >= 0}>
            <div onClick={onPreventMouseDown}>{item.name}</div>
          </Checkbox>
        );
      }
      default: {
        return item.name;
      }
    }
  };

  const onPreventMouseDown = (event: any) => {
    event.stopPropagation();
  };

  const onChangeSelect = (val: any) => {
    setCheckedList(val);
    if (onChange) {
      onChange(val);
    }
    form.setFieldValue(field.name, val);
  };

  return (
    <div className={className}>
      {prefix}
      <Select
        {...field}
        {...props}
        placeholder={placeholder}
        onChange={onChangeSelect}
        notFoundContent={
          <div className='ant-empty-text'>
            <img src={NodataIcon} width='100%' />
            <p>{t('common.txt_no_data')}</p>
          </div>
        }
        dropdownRender={(menu) => {
          if (optionCustom) return optionCustom;

          return (
            <Fragment>
              {enableAllOption && options.length > 1 && optionsSelectAllRender()}
              {optionsType === TYPE_INPUT.CHECKBOXGROUP ? (
                <CheckboxGroup
                  options={options.map((e: any) => ({ ...e, label: e.name }))}
                  value={checkedList}
                  onChange={onChangeSelect}
                />
              ) : (
                menu
              )}
            </Fragment>
          );
        }}
      >
        {options.map((item: any) => (
          <Option value={item.value} key={item?.key || item.value} label={item.name}>
            {optionsRender(item)}
          </Option>
        ))}
      </Select>
    </div>
  );
};

export const CheckboxInput: FC<{
  field: FieldInputProps<any>;
  props: any;
  form: FormikProps<any>;
  content: any;
  checked?: boolean;
}> = ({ field, content, form, checked, ...props }) => (
  <Checkbox {...field} {...props} checked={checked ?? field.value}>
    {content}
  </Checkbox>
);

export const CheckboxGroupInput: FC<{
  field: FieldInputProps<any>;
  props: any;
  form: FormikProps<any>;
  options: any;
  fieldNameChange: any;
  onChangeValue: any;
  onChange: any;
}> = ({ field, form, options, onChange, ...props }) => {
  const handleChange = (value: any) => {
    if (onChange) {
      onChange(value);
    } else {
      if (field.value.includes(value)) {
      } else {
        form.setFieldValue(field.name, [...value]);
        form.setFieldValue(props?.fieldNameChange, props?.onChangeValue);
      }
    }
  };

  return (
    <CheckboxGroup
      options={options.map((e: any) => ({ ...e, label: e.name }))}
      value={field.value}
      {...props}
      onChange={handleChange}
    />
  );
};

export const SwitchInput: FC<{
  field: FieldInputProps<any>;
  props: any;
  form: FormikProps<any>;
  onChange: any;
}> = ({ field, form, onChange, ...props }) => {
  const handleSwitchChange = (checked: boolean) => {
    if (onChange) {
      onChange(checked);
    } else {
      form.setFieldValue(field.name, checked);
    }
  };
  return <Switch {...field} {...props} checked={!!field.value} onChange={handleSwitchChange} />;
};

export const RadioInput: FC<{
  field: FieldInputProps<any>;
  props: any;
  form: FormikProps<any>;
  options: {
    value: any;
    name: any;
  }[];
}> = ({ field, form, options, ...props }) => {
  const { onChange } = props as any;
  const handleChange = (e: any) => {
    if (!onChange) {
      form.setFieldValue(field.name, e.target.value);
    } else {
      onChange(e);
    }
  };

  return (
    <Radio.Group onChange={handleChange} value={field.value}>
      {options.map((e: { value: any; name: any }) => (
        <Radio key={e.value} value={e.value}>
          {e.name}
        </Radio>
      ))}
    </Radio.Group>
  );
};

export const SearchDebounceInput: FC<{
  field: FieldInputProps<any>;
  form: FormikProps<any>;
  props: any;
  onSearch: any;
}> = ({ field, form, onSearch, ...props }) => {
  const [searchValue, setSearchValue] = useState('');
  const debouncedSearchVal = useDebounce(searchValue, TIME_CONSTANTS.DEBOUNCE_SEARCH_LIST);
  const onChange = (e: any) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (onSearch) {
      onSearch(debouncedSearchVal);
    }
  }, [debouncedSearchVal]);

  useEffect(() => {
    setSearchValue(field?.value || null);
  }, [field?.value]);
  return (
    <Search
      maxLength={LENGTH_CONSTANTS.MAX_LENGTH_INPUT}
      {...field}
      value={searchValue}
      onChange={onChange}
      onSearch={onSearch}
      {...props}
    />
  );
};

type FormItemType = {
  component?: any;
  type?: string;
  name: string;
  typeInput?: string | null;
  prefix?: any;
  placeholder?: any;
  options?: {
    value: any;
    name: any;
    key?: any;
  }[];
  subLabel?: any;
  dropdownClassName?: string;
  className?: string;
  content?: any;
  label?: any;
  showLevelPassword?: boolean;
  maxLength?: number;
  onChange?: any;
  showSearch?: boolean;
  filterOption?: any;
  dropdownMatchSelectWidth?: any;
  labelClassName?: string;
  containerClassName?: string;
  errorClassName?: string;
  decimalScale?: number;
  autoFocus?: boolean;
  required?: boolean;
  children?: any;
  inputProps?: any;
  mode?: any;
  showArrow?: any;
  maxTagCount?: any;
  maxTagTextLength?: any;
  onSearch?: any;
  onKeyDown?: any;
  tagRender?: any;
  optionLabelProp?: any;
  values?: any;
  optionsType?: any;
  enableAllOption?: any;
  errorField?: string;
  description?: any;
  fetchData?: any;
  renderOption?: any;
  limit?: string | number;
  getPopupContainer?: any;
  value?: any;
  disabled?: boolean;
  unit?: string;
  thousandSeparator?: boolean;
  onValueChange?: any;
  onBlur?: any;
  isAllowed?: any;
  enterButton?: any;
  virtual?: boolean;
  rows?: number;
  validate?: any;
  format?: any;
  disabledDate?: any;
  allowClear?: boolean;
  showTime?: any;
  showNow?: boolean;
  showCount?: boolean;
  feildNameChange?: any;
  onChangeValue?: any;
  defaultValue?: any;
  suffix?: any;
  labelTootip?: any;
  disabledTime?: any;
  autoSize?: any;
  checked?: boolean;
  inputReadOnly?: boolean;
  listFileTypeSupport?: Array<any>;
  appendInput?: ReactNode;
  maxSize?: number;
  optionCustom?: any;
  open?: boolean;
  onDropdownVisibleChange?: any;
};

const FormItem = ({
  component,
  placeholder,
  type,
  name,
  typeInput = TYPE_INPUT.TEXT,
  prefix,
  dropdownClassName,
  className,
  content,
  label,
  labelClassName,
  containerClassName,
  errorClassName,
  required,
  children,
  errorField,
  description,
  disabled,
  unit,
  validate,
  labelTootip,
  subLabel,
  appendInput = null,
  ...props
}: FormItemType) => {
  let componentRender: any = component || TextInput;

  switch (typeInput) {
    case TYPE_INPUT.TEXT:
      componentRender = TextInput;
      break;
    case TYPE_INPUT.TEXTAREA:
      componentRender = InputTextArea;
      break;
    case TYPE_INPUT.DATE:
      componentRender = InputDate;
      break;
    case TYPE_INPUT.PASSWORD:
      componentRender = PasswordInput;
      break;
    case TYPE_INPUT.SELECT:
      componentRender = SelectInput;
      break;
    case TYPE_INPUT.CHECKBOX:
      componentRender = CheckboxInput;
      break;
    case TYPE_INPUT.CHECKBOXGROUP:
      componentRender = CheckboxGroupInput;
      break;
    case TYPE_INPUT.NUMBER:
      componentRender = NumberInput;
      break;
    case TYPE_INPUT.SEARCH:
      componentRender = SearchInput;
      break;
    case TYPE_INPUT.SELECT_INFINITY_SCROLL:
      componentRender = InfinityScrollSelect;
      break;
    case TYPE_INPUT.SWITCH:
      componentRender = SwitchInput;
      break;
    case TYPE_INPUT.RADIO:
      componentRender = RadioInput;
      break;
    case TYPE_INPUT.AUTOCOMPLETE:
      componentRender = AutoCompleteInput;
      break;
    case TYPE_INPUT.RANGE:
      componentRender = RangeInput;
      break;
    case TYPE_INPUT.SEARCH_DEBOUNCE:
      componentRender = SearchDebounceInput;
      break;
  }
  const propsField: any = {
    prefix,
    placeholder,
    className,
    content,
    disabled,
    ...props,
  };
  if (typeInput === TYPE_INPUT.SELECT || typeInput === TYPE_INPUT.SELECT_INFINITY_SCROLL) {
    propsField.dropdownClassName = dropdownClassName;
  }
  if (typeInput === TYPE_INPUT.PASSWORD) {
    propsField.labelClassName = labelClassName;
  }

  return (
    <div className={cx(containerClassName, 'form-item')}>
      {label && (
        <div className={cx(labelClassName, 'form-item__label')}>
          {label}&nbsp;{required ? '*' : ''} {labelTootip ?? ''}
        </div>
      )}
      {subLabel && <p className='text--red'>{subLabel}</p>}
      {description && <div className={cx(labelClassName, 'form-item__description')}>{description}</div>}
      <div className='field'>
        <Field
          type={type}
          name={name}
          placeholder={placeholder}
          label={label}
          component={componentRender}
          unit={unit}
          validate={validate}
          {...propsField}
        />
        {appendInput}
        <ErrorMessage name={errorField || name} component='div' className={cx('error-text', errorClassName)} />
      </div>
      {children}
    </div>
  );
};

export default memo(FormItem);
