export const inputReg = /^[a-zA-Z0-9_\-]+$/

export const isInput = (value: string) => inputReg.test(value)
