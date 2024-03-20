import { TFunction } from 'next-i18next';
import { number, object, string } from 'yup';

import { formatCurrency } from 'utils';

import { BUY_FIELD, DEFAULT_INIT, LIST_FOR_SALE_FIELD } from 'constants/nft';

const { QUANTITY: buyQuantity } = BUY_FIELD;
const { QUANTITY: listForSaleQuantity, UNIT_PRICE: listForSaleUnitPrice, PRICE: price } = LIST_FOR_SALE_FIELD;
const { TRAIT_TYPE, VALUE, DESCRIPTION, IPFS_URL, NAME, FILE } = DEFAULT_INIT;


export const getBuySchema = (t: TFunction, maxQuantity: number) => {
  return object().shape({
    [buyQuantity]: number()
      .positive(t('message.E2'))
      .required(t('message.E1', { field: t('nft_detail.txt_quantity') }))
      .max(
        maxQuantity,
        t('message.E17', {
          number: formatCurrency(maxQuantity),
        }),
      ),
  });
};

export const createNftSchema = (t: TFunction, maxQuantity: number) => {
  return object().shape({
    [NAME]: string()
      .required(t('message.E1', { field: t('nft_create.txt_name') }))
      .max(
        maxQuantity,
        t('message.E8', {
          number: formatCurrency(maxQuantity),
        }),
      ),
      [DESCRIPTION]: string()
      .required(t('message.E1', { field: t('nft_create.txt_description') }))
      .max(
        4000,
        t('message.E8', {
          number: formatCurrency(4000),
        }),
      ),
  });
};

export const kycSchema = (t: TFunction, maxQuantity: number) => {
  return object().shape({
    [NAME]: string()
      .required(t('message.E1', { field: t('nft_create.txt_name') }))
      .max(
        maxQuantity,
        t('message.E8', {
          number: formatCurrency(maxQuantity),
        }),
      ),
      [DESCRIPTION]: string()
      .required(t('message.E1', { field: t('nft_create.txt_description') }))
      .max(
        4000,
        t('message.E8', {
          number: formatCurrency(4000),
        }),
      ),
  });
};

export const getListForSaleSchema = (t: TFunction, maxQuantity: number, required: any) => {
  return object().shape({
    [listForSaleQuantity]: number()
      .positive(t('message.E2'))
      .test('required', t('message.E1', { field: t('nft_detail.txt_lfs_quantity') }), (value: string | any) => {
        return required?.requiredQuantity || value;
      })
      .max(
        maxQuantity,
        t('message.E17', {
          number: formatCurrency(maxQuantity),
        }),
      ),
    [listForSaleUnitPrice]: number()
      .positive(t('message.E2'))
      .required(t('message.E1', { field: t('nft_detail.txt_lfs_price') })),
  });
};

export const getPutOnSaleSchema = (t: TFunction) => {
  return object().shape({
    [price]: number()
      .positive(t('message.E2'))
      .required(t('message.E1', { field: t('common.price') }))
  });
};