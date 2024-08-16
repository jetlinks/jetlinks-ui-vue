import i18n from '@/i18n'
const $t = i18n.global.t
import { Rule } from "ant-design-vue/es/form";

export const validateEnum = async (_rule: Rule, val: Record<any, any>[]) => {
  if (val.length === 0) return Promise.reject(new Error($t('Edit.validator.6916020-0')));
  const flag = val.every((item) => {
    return item.value && item.text;
  });
  if (!flag) {
    return Promise.reject(new Error($t('Edit.validator.6916020-0')));
  }
  return Promise.resolve();
}

export const validateArray = async (_rule: Rule, val: Record<any, any>) => {
  if (!val) return Promise.reject(new Error($t('Edit.validator.6916020-1')));
  await validateValueType(_rule, val)
  return Promise.resolve();
}

export const validateJson = async (_rule: Rule, val: Record<any, any>[], title =$t('Edit.validator.6916020-2'), required = true) => {
  if (required && (!val || val.length === 0)) {
    return Promise.reject(new Error($t('Edit.validator.6916020-3', [title])));
  }
  for (let item of val) {
    if (!item) return Promise.reject(new Error($t('Edit.validator.6916020-3', [title])));
    await validateIdName(_rule, item)
    await validateValueType(_rule, item.valueType)
  }
  return Promise.resolve();
}

export const validateIdName = async (_rule: Rule, val: Record<any, any>) => {
  if (!val.id) {
    return Promise.reject(new Error($t('Edit.validator.6916020-4')))
  }
  if (!val.name) {
    return Promise.reject(new Error($t('Edit.validator.6916020-5')))
  }
}

export const validateValueType = async (_rule: Rule, val: Record<any, any>, title =$t('Edit.validator.6916020-6')) => {
  if (!val) return Promise.reject(new Error($t('Edit.validator.6916020-1')));
  if (!val?.type) {
    return Promise.reject(new Error($t('Edit.validator.6916020-7', [title])))
  }
  if (['enum'].includes(val.type)) {
    await validateEnum(_rule, val.elements)
  }
  if (['array'].includes(val.type)) {
    await validateArray(_rule, val.elementType)
  }
  if (['object'].includes(val.type)) {
    await validateJson(_rule, val.properties)
  }
  if (['file'].includes(val.type) && !val.bodyType) {
    return Promise.reject(new Error($t('Edit.validator.6916020-8')))
  }
  return Promise.resolve();
}