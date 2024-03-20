import { SortOrder, Key } from 'antd/lib/table/interface';

export interface ResponseGenerator {
  config?: any;
  data?: any;
  headers?: any;
  request?: any;
  status?: number;
  statusText?: string;
  meta?: any;
}

export interface SorterTable {
  order?: SortOrder;
  field?: Key | readonly Key[];
}
