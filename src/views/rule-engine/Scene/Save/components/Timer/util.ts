import { isArray } from 'lodash-es'
export const numberToString = {
  1: '星期一',
  2: '星期二',
  3: '星期三',
  4: '星期四',
  5: '星期五',
  6: '星期六',
  7: '星期日',
};

export const timeUnitEnum = {
  seconds: '秒',
  minutes: '分',
  hours: '小时',
};

type continuousValueFn = (data: (string | number)[], type: string) => (number | string)[];

export const continuousValue: continuousValueFn = (data, type) => {
  let start = 0;
  const newArray: (number | string)[] = [];
  const isWeek = type === 'week';
  if (isArray(data)) {
    data.forEach((item, index) => {
      const _item = Number(item);
      const nextValue = data[index + 1];
      const previousValue = data[index - 1];
      const nextItemValue = _item + 1;
      const previousItemValue = _item - 1;
      if (nextItemValue === nextValue && previousItemValue !== previousValue) {
        start = _item;
      } else if (previousItemValue === previousValue && nextItemValue !== nextValue) {
        // 表示前start和item连续，并且item与nextValue不连续
        if (_item - start >= 2) {
          // 至少三位连续
          newArray.push(
            isWeek
              ? `${numberToString[start]} - ${numberToString[_item]}`
              : `${start} - ${_item}号`,
          );
        } else {
          newArray.push(isWeek ? numberToString[start] : `${start}号`);
          newArray.push(isWeek ? numberToString[_item] : `${_item}号`);
        }
      } else if (previousItemValue !== previousValue && nextItemValue !== nextValue) {
        newArray.push(isWeek ? numberToString[_item] : `${_item}号`);
      }
    });
  }
  return newArray;
};