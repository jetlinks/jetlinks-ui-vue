import i18n from "@/locales";
export const typeOptions = [
  { label: i18n.global.t('Search.util.184827-0'), value: 'or' },
  { label: i18n.global.t('Search.util.184827-1'), value: 'and' },
]

export const termType = [
  { label: '=', value: 'eq' },
  { label: '!=', value: 'not' },
  { label: i18n.global.t('Search.util.184827-2'), value: 'like' },
  { label: i18n.global.t('Search.util.184827-3'), value: 'nlike' },
  { label: '>', value: 'gt' },
  { label: '>=', value: 'gte' },
  { label: '<', value: 'lt' },
  { label: '<=', value: 'lte' },
  { label: i18n.global.t('Search.util.184827-4'), value: 'in' },
  { label: i18n.global.t('Search.util.184827-5'), value: 'nin' },
];