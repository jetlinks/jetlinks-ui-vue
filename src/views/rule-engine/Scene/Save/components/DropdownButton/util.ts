import { isBoolean, isEqual } from 'lodash-es'

export type DropdownButtonOptions = {
  label: string;
  value: string;
  children?: DropdownButtonOptions[];
  [key: string]: any;
};

export const getComponent = (type: string): string => {
  switch (type) {
    case 'int':
    case 'long':
    case 'float':
    case 'double':
      return type
    case 'metric':
    case 'enum':
    case 'boolean':
      return 'menu'
    case 'date':
      return 'date'
    case 'tree':
      return 'tree'
    case 'file':
      return 'file'
    case 'geoPoint':
      return 'geoPoint'
    default:
      return 'input'
  }
}

export const getOption = (data: any[], value?: string | number | boolean, key: string = 'name'): DropdownButtonOptions | any => {
  let option
  if (value === undefined && value === null) return option
  let _value = isBoolean(value) ? String(value) : value
  for (let i = 0; i < data.length; i++) {
    const item = data[i]
    if (isEqual(item[key], _value)) {
      option = data[i]
      break
    } else if (item.children && item.children.length) {
      option = getOption(item.children, value, key)
      if (option) {
        break
      }
    }
  }
  return option
}