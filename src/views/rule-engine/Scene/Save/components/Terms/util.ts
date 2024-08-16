import i18n from '@/i18n'

const $t = i18n.global.t
import { BranchesThen } from '@/views/rule-engine/Scene/typings'

export const ContextKey = 'columnOptions'
export const arrayParamsKey = ['nbtw', 'btw', 'in', 'nin', 'contains_all', 'contains_any', 'not_contains']
export const doubleParamsKey= ['nbtw','btw']
export const timeTypeKeys = ['time_gt_now', 'time_lt_now']


export const handleParamsData = (data: any[], key: string = 'column', parentId?: string): any[] => {
  return data?.map((item, index) => {
    const hasChildren = !!item.children?.length

    let keyValue = item[key]

    if (hasChildren && key === 'column') {
      keyValue = item[key] + index
    }

    return {
      ...item,
      key: keyValue,
      disabled: hasChildren,
      children: handleParamsData(item.children, key, item[key])
    }
  }) || []
}

export const thenRules = [{
  validator(_: string, value: BranchesThen[]) {
    if (!value || (value && !value.length) || !value.some(item => item.actions && item.actions.length)) {
      return Promise.reject($t('Terms.util.5425723-0'))
    }
    return Promise.resolve();
  }
}]

