import dayjs from 'dayjs'

const isNullishDateValue = (value: any) => {
  return value === undefined || value === null || value === ''
}

export const toDayjsValue = (value: any) => {
  if (isNullishDateValue(value)) {
    return undefined
  }

  const currentValue = dayjs(value)
  return currentValue.isValid() ? currentValue : undefined
}

export const toTimestampValue = (value: any) => {
  const currentValue = toDayjsValue(value)
  return currentValue ? currentValue.valueOf() : undefined
}

export const toDayjsRangeValue = (value: any) => {
  if (!Array.isArray(value) || value.length === 0) {
    return []
  }
  return value.map(item => toDayjsValue(item))
}

export const toTimestampRangeValue = (value: any) => {
  if (!Array.isArray(value) || value.length === 0) {
    return []
  }
  return value.map(item => toTimestampValue(item))
}
