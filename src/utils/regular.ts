// 用于校验 url
export const urlReg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => urlReg.test(path)

// 用于校验只允许输入英文或者数字或者-或者_

export const inputReg = /^[a-zA-Z0-9_\-]+$/

export const isInput = (value: string) => inputReg.test(value)