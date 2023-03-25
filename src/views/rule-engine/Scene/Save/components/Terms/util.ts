export const ContextKey = 'columnOptions'

export const handleParamsData = (data: any[], key: string = 'column'): any[] => {
  return data?.map(item => {
    return {
      ...item,
      key: item[key],
      disabled: !!item.children,
      children: handleParamsData(item.children, key)
    }
  }) || []
}

export const thenRules = [{
  validator(_: string, value: any) {
    if (!value || (value && !value.length) || !v.some(item => item.actions && item.actions.length)) {
      return Promise.reject('至少配置一个执行动作')
    }
    return Promise.resolve();
  }
}]