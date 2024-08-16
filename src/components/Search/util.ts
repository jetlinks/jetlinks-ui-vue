import i18n from '@/i18n'
const $t = i18n.global.t

export const typeOptions = [
  { label: $t('Search.util.4348411-0'), value: 'or' },
  { label: $t('Search.util.4348411-1'), value: 'and' },
]

export const termType = [
  { label: '=', value: 'eq' },
  { label: '!=', value: 'not' },
  { label: $t('Search.util.4348411-2'), value: 'like' },
  { label: $t('Search.util.4348411-3'), value: 'nlike' },
  { label: '>', value: 'gt' },
  { label: '>=', value: 'gte' },
  { label: '<', value: 'lt' },
  { label: '<=', value: 'lte' },
  { label: $t('Search.util.4348411-4'), value: 'in' },
  { label: $t('Search.util.4348411-5'), value: 'nin' },
];