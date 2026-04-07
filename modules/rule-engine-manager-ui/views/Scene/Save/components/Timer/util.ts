import i18n from '@jetlinks-web-core/locales/index'
import { isArray } from 'lodash-es'
import type { OperationTimer } from '../../../typings';

const $t = i18n.global.t
export const numberToString = {
  1: $t('Timer.util.803811-0'),
  2: $t('Timer.util.803811-1'),
  3: $t('Timer.util.803811-2'),
  4: $t('Timer.util.803811-3'),
  5: $t('Timer.util.803811-4'),
  6: $t('Timer.util.803811-5'),
  7: $t('Timer.util.803811-6'),
};

export const timeUnitEnum = {
  seconds: $t('Timer.util.803811-7'),
  minutes: $t('Timer.util.803811-8'),
  hours: $t('Timer.util.803811-9'),
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
              : $t('Timer.util.803811-10', [start,_item]),
          );
        } else {
          newArray.push(isWeek ? numberToString[start] : $t('Timer.util.803811-11', [start]));
          newArray.push(isWeek ? numberToString[_item] : $t('Timer.util.803811-12', [_item]));
        }
      } else if (previousItemValue !== previousValue && nextItemValue !== nextValue) {
        newArray.push(isWeek ? numberToString[_item] : $t('Timer.util.803811-12', [_item]));
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
  let when = $t('Timer.util.803811-13')
  let time = undefined
  let extraTime = undefined

  if (timer.trigger === 'cron') {
    time = timer.cron
    return { time }
  }

  if (timer.when?.length) {
    when = timer!.trigger === 'week' ? $t('Timer.util.803811-14') : $t('Timer.util.803811-15');
    const whenStrArr = continuousValue(timer.when! || [], timer!.trigger);
    const whenStrArr3 = whenStrArr.splice(0, 3);
    when += whenStrArr3.join('、');
    when += $t('Timer.util.803811-16', [timer.when!.length]);
  }

  if (timer.once) {
    time = timer.once.time + ` ${$t('Timer.util.803811-17')}`;
  } else if (timer.period) {
    time = timer.period.from + '-' + timer.period.to;
    extraTime = $t('Timer.util.803811-18', [timer.period.every,timeUnitEnum[timer.period.unit]]);
  }

  if (timer.trigger === 'multi') {
    const len = timer.multi!.spec.length
    when = ''
    extraTime = $t('Timer.util.803811-19', [len])
  }

  return {
    when,
    time,
    extraTime
  }
}
