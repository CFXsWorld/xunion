import { isNumber } from 'lodash';

export const isNumeric = (value: string) =>
  value !== 'NaN' && isNumber(Number(value)) && Number(value) > 0;
