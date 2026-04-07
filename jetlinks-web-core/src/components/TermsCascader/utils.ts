export const arrayParamsKey: Array<string | undefined> = ['in', 'nin', 'contains_all', 'contains_any', 'not_contains']
export const doubleParamsKey: Array<string | undefined> = ['nbtw','btw']
export const timeTypeKeys: Array<string | undefined> = ['time_gt_now', 'time_lt_now']
export const nullKeys: Array<string | undefined> = ['notnull', 'isnull']
export const complexKey = 'complex_exists' // 满足

export const initValueByTermType = (termType: string) => {
  if (doubleParamsKey.includes(termType)) {
    return []
  }

  if (nullKeys.includes(termType)) {
    return 1 // 为空会校验不通过，设置为1，使校验通过
  }

  return undefined
}


export const typeOptions = [
  { label: '并且', value: 'and'},
  { label: '或者', value: 'or'},
]
