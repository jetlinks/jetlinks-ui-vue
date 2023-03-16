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