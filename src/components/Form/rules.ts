import i18n from '@/i18n'
const $t = i18n.global.t


const MaxLengthStringFn = (len: number = 64) => ({
  max: len,
  message: $t('Form.rules.4348696-0', [len]),
})

export const Max_Length_64 = [MaxLengthStringFn()]
export const Max_Length_200 = [MaxLengthStringFn(200)]

export const RequiredStringFn = (name: string, type: string = 'input') => {
  let typeName = $t('Form.rules.4348696-1')
  if (['select', 'date'].includes(type)) {
    typeName = $t('Form.rules.4348696-2')
  }
  return {
    required: true,
    message: $t('Form.rules.4348696-3', [typeName,name]),
  }
}

export const ID_Rule = [
  {
    pattern: /^[a-zA-Z0-9_\-]+$/,
    message: $t('Form.rules.4348696-4'),
  },
  Max_Length_64[0]
]

export const CreteRuleByType = (type: string) => {
  switch (type){
      case 'int':
        return [
          {
            validator: (_: any, value: number) => {
              const baseNumber = 2147483648
              if (value < -baseNumber) {
                return Promise.reject($t('Form.rules.4348696-5', [baseNumber]));
              }
              if (value > baseNumber) {
                return Promise.reject($t('Form.rules.4348696-6', [baseNumber]));
              }
              return Promise.resolve();
            }
          }
        ]
      case'long':
        return [
          {
            validator: (_: any, value: number) => {
              const baseNumber = 340282346638528860000000000000000000000
              if (value < -baseNumber) {
                return Promise.reject($t('Form.rules.4348696-5', [baseNumber]));
              }
              if (value > baseNumber) {
                return Promise.reject($t('Form.rules.4348696-6', [baseNumber]));
              }
              return Promise.resolve();
            }
          }
        ]
      case'float':
        return [
          {
            validator: (_: any, value: number) => {
              const baseNumber = 9223372036854775807
              if (value < -baseNumber) {
                return Promise.reject($t('Form.rules.4348696-5', [baseNumber]));
              }
              if (value > baseNumber) {
                return Promise.reject($t('Form.rules.4348696-6', [baseNumber]));
              }
              return Promise.resolve();
            }
          }
        ]
      // case'double':
      //   return [
      //     {
      //       max: 1.7976931348623157,
      //       message: '最大可输入64位字符'
      //     }
      //   ]
      case 'string':
        return [MaxLengthStringFn()];
      case 'description':
        return [MaxLengthStringFn(200)]
    default:
      return []
  }
}