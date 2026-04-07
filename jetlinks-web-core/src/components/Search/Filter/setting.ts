export const TermTypeOptions = [
   { label: '=', value: 'eq' },
   { label: '!=', value: 'not' },
   { label: '包含', value: 'like' },
   { label: '不包含', value: 'nlike' },
   { label: '>', value: 'gt' },
   { label: '>=', value: 'gte' },
   { label: '<', value: 'lt' },
   { label: '<=', value: 'lte' },
   { label: "在...之中", value: 'in', isArray: true },
   { label: "不在...之中", value: 'nin', isArray: true },
   { label: "在...之间", value: 'btw', isArray: true },
   { label: "不在...之间", value: 'nbtw', isArray: true },
]

export const getDefaultTermType = (type: string) => {
   switch (type) {
      case 'select':
      case 'treeSelect':
         return ['eq', 'not', 'in', 'nin'];
      case 'time':
      case 'date':
         return ['gt', 'lt', 'gte', 'lte', 'btw'];
      case 'timeRange':
      case 'rangePicker':
         return ['btw', 'nbtw'];
      case 'number':
         return ['eq', 'not', 'gt', 'lt', 'gte', 'lte'];
      default:
         return ['like', 'nlike', 'eq', 'not']
   }
}

export const isArrayTermType = (termType: string): boolean => {
  const option = TermTypeOptions.find(opt => opt.value === termType)
  return option?.isArray ?? false
}