import { isArray } from 'lodash-es'
import type { OperationTimer } from "@/views/rule-engine/Scene/typings";
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

type TimerOption = {
  when?: string
  time?: string
  extraTime?: string
}

export const handleTimerOptions = (timer: OperationTimer):TimerOption => {
  let when = '每天'
  let time = undefined
  let extraTime = undefined

  if (timer.trigger === 'cron') {
    time = timer.cron
    return { time }
  }

  if (timer.when?.length) {
    when = timer!.trigger === 'week' ? '每周' : '每月';
    const whenStrArr = continuousValue(timer.when! || [], timer!.trigger);
    const whenStrArr3 = whenStrArr.splice(0, 3);
    when += whenStrArr3.join('、');
    when += `等${timer.when!.length}天`;
  }

  if (timer.once) {
    time = timer.once.time + ' 执行1次';
  } else if (timer.period) {
    time = timer.period.from + '-' + timer.period.to;
    extraTime = `每${timer.period.every}${timeUnitEnum[timer.period.unit]}执行1次`;
  }

  return {
    when,
    time,
    extraTime
  }
}