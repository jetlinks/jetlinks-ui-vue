
const MaxLengthStringFn = (len: number = 64) => ({
  max: len,
  message: `最多输入${len}个字符`,
})

export const Max_Length_64 = [MaxLengthStringFn()]
export const Max_Length_200 = [MaxLengthStringFn(200)]

export const RequiredStringFn = (name: string, type: string = 'input') => {
  let typeName = '输入'
  if (['select', 'date'].includes(type)) {
    typeName = '选择'
  }
  return {
    required: true,
    message: `请${typeName}${name}`,
  }
}

export const ID_Rule = [
  {
    pattern: /^[a-zA-Z0-9_\-]+$/,
    message: '请输入英文或者数字或者-或者_',
  },
  Max_Length_64[0]
]