import { Rule } from "ant-design-vue/es/form";

export const validateEnum = async (_rule: Rule, val: Record<any, any>[]) => {
  if (val.length === 0) return Promise.reject(new Error('请配置枚举项'));
  const flag = val.every((item) => {
    return item.value && item.text;
  });
  if (!flag) {
    return Promise.reject(new Error('请配置枚举项'));
  }
  return Promise.resolve();
}

export const validateArray = async (_rule: Rule, val: Record<any, any>) => {
  if (!val) return Promise.reject(new Error(`请输入元素配置`));
  await validateValueType(_rule, val)
  return Promise.resolve();
}

export const validateJson = async (_rule: Rule, val: Record<any, any>[], title = '配置参数') => {
  if (!val || val.length === 0) {
    return Promise.reject(new Error(`请输入${title}`));
  }
  for (let item of val) {
    if (!item) return Promise.reject(new Error(`请输入${title}`));
    await validateIdName(_rule, item)
    await validateValueType(_rule, item.valueType)
  }
  return Promise.resolve();
}

export const validateIdName = async (_rule: Rule, val: Record<any, any>) => {
  if (!val.id) {
    return Promise.reject(new Error('请输入标识'))
  }
  if (!val.name) {
    return Promise.reject(new Error('请输入名称'))
  }
}

export const validateValueType = async (_rule: Rule, val: Record<any, any>, title = '数据类型') => {
  if (!val) return Promise.reject(new Error('请输入元素配置'));
  if (!val?.type) {
    return Promise.reject(new Error(`请选择${title}`))
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
  if (['file'].includes(val.type) && !val.fileType) {
    return Promise.reject(new Error('请选择文件类型'))
  }
  return Promise.resolve();
}