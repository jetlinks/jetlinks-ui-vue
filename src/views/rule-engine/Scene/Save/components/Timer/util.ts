import i18n from '@/i18n'

const $t = i18n.global.t
import { isArray } from 'lodash-es'
import type { OperationTimer } from "@/views/rule-engine/Scene/typings";
export const numberToString = {
  1: $t('Timer.util.5425718-0'),
  2: $t('Timer.util.5425718-1'),
  3: $t('Timer.util.5425718-2'),
  4: $t('Timer.util.5425718-3'),
  5: $t('Timer.util.5425718-4'),
  6: $t('Timer.util.5425718-5'),
  7: $t('Timer.util.5425718-6'),
};

export const timeUnitEnum = {
  seconds: $t('Timer.util.5425718-7'),
  minutes: $t('Timer.util.5425718-8'),
  hours: $t('Timer.util.5425718-9'),
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
              : $t('Timer.util.5425718-10', [start,_item]),
          );
        } else {
          newArray.push(isWeek ? numberToString[start] : $t('Timer.util.5425718-11', [start]));
          newArray.push(isWeek ? numberToString[_item] : $t('Timer.util.5425718-12', [_item]));
        }
      } else if (previousItemValue !== previousValue && nextItemValue !== nextValue) {
        newArray.push(isWeek ? numberToString[_item] : $t('Timer.util.5425718-12', [_item]));
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
  let when = $t('Timer.util.5425718-13')
  let time = undefined
  let extraTime = undefined

  if (timer.trigger === 'cron') {
    time = timer.cron
    return { time }
  }

  if (timer.when?.length) {
    when = timer!.trigger === 'week' ? $t('Timer.util.5425718-14') : $t('Timer.util.5425718-15');
    const whenStrArr = continuousValue(timer.when! || [], timer!.trigger);
    const whenStrArr3 = whenStrArr.splice(0, 3);
    when += whenStrArr3.join('、');
    when += $t('Timer.util.5425718-16', [timer.when!.length]);
  }

  if (timer.once) {
    time = timer.once.time + ' 执行1次';
  } else if (timer.period) {
    time = timer.period.from + '-' + timer.period.to;
    extraTime = $t('Timer.util.5425718-18', [timer.period.every,timeUnitEnum[timer.period.unit]]);
  }

  if (timer.trigger === 'multi') {
    const len = timer.multi!.spec.length
    when = ''
    extraTime = $t('Timer.util.5425718-19', [len])
  }

  return {
    when,
    time,
    extraTime
  }
}
