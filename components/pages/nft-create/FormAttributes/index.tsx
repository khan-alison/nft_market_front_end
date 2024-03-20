import FormItem, { TYPE_INPUT } from "@components//FormItem";
import { Button, Col, Input, Row } from "antd";
import { DEFAULT_INIT } from "constants/nft";
import { useTranslation } from "next-i18next";
import { useState } from "react";
import CloseIcon from 'public/svg/close_icon.svg';

const { TRAIT_TYPE, VALUE } = DEFAULT_INIT;

const FormAttributes = (prop: any) => {
  const { handleCancelAttribute, values, setValues } = prop;
  const { t } = useTranslation();

  const handleChange = (event: any, index: number) => {
    const { name, value } = event.target;

    const attributeValue = values;
    attributeValue[index] = { ...attributeValue[index], [name]: value };

    setValues({
      ...values,
      attributes: attributeValue
    });

  };

  return (
    <div>
      {values?.map((value: any, index: number) => (
        <Row key={index} justify="space-between">
          <Col xs={20} lg={10}>
            <Input
              className="input-attribute"
              name={TRAIT_TYPE}
              onChange={(e: any) => handleChange(e, index)}
              placeholder={t('nft_create.txt_trait_type')}
              value={value?.trait_type}
            />
          </Col>
          <Col xs={20} lg={10}>
            <Input
              className="input-attribute"
              name={VALUE}
              onChange={(e: any) => handleChange(e, index)}
              placeholder={t('nft_create.txt_value')}
              value={value?.value}
            />
          </Col>
          <Button
            style={{ background: "none", color: "red", marginTop: "20px", border: "none" }}
            onClick={() => handleCancelAttribute(index)}
            aria-label="delete"
          >
            <img src={CloseIcon} className="dragger__icon" />
          </Button>
        </Row>
      ))}
    </div>
  );
};

export default FormAttributes;
