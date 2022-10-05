/**
 * Generic Array sort functions.
 * Can also be used with the <Table> component of antd - you can pass them as the 'sorter' property of column config.
 */

import moment from 'moment';
import get from 'lodash/get';

const compose =
  (...sorters: Function[]) =>
  (a: any, b: any) =>
    sorters.reduce((ret, sorter) => {
      if (ret !== 0) {
        return ret;
      }

      return sorter(a, b);
    }, 0);

const bool =
  (key: string, reverse = false) =>
  (a: any, b: any) => {
    const aVal = get(a, key);
    const bVal = get(b, key);
    const comparison = aVal && !bVal ? -1 : !aVal && bVal ? 1 : 0;

    return reverse ? -comparison : comparison;
  };

const textMulti =
  (...keys: string[]) =>
  (a: any, b: any) =>
    keys.reduce((ret, key) => {
      if (ret !== 0) {
        return ret;
      }

      return text(key)(a, b);
    }, 0);

const text =
  (key: string, reverse = false) =>
  (a: any, b: any) => {
    const aText = get(a, key);
    const bText = get(b, key);

    const comparison = (aText || '').localeCompare(bText || '', undefined, {
      numeric: true,
    });

    return reverse ? -comparison : comparison;
  };

const number =
  (key: string, reverse = false) =>
  (a: any, b: any) => {
    const aNumber = get(a, key);
    const bNumber = get(b, key);

    const comparison = (aNumber || 0) - (bNumber || 0);

    return reverse ? -comparison : comparison;
  };

const date =
  (key: any, reverse = false) =>
  (a: any, b: any) => {
    const valueA = moment(get(a, key));
    const valueB = get(b, key);
    let comparison = 0;

    if (valueA.isBefore(valueB)) {
      comparison = -1;
    } else if (valueA.isAfter(valueB)) {
      comparison = 1;
    }

    return reverse ? -comparison : comparison;
  };

const sorter = { compose, bool, text, textMulti, number, date };

export default sorter;
