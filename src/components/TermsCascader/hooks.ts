import {provide, inject} from 'vue'
import { TermsParseConTextType, TermsValueType } from './typing'

const TermsContextValueKey = 'TermsContextValueKey'
const TermsParseKey = 'TermsParseKey'
const ColumnOptionsKey = 'ColumnOptionsKey'
const ValueOptionsKey = 'ValueOptionsKey'
const TermsEventKey = 'TermsEventKey'

export const useTermsValueContext = (data: TermsValueType) => {
  provide(TermsContextValueKey, data)
}

export const useTermsValue = () => {
  return inject<TermsValueType>(TermsContextValueKey, ref({
    column: undefined,
    termType: undefined,
    value: {
      source: 'fixed',
      value: undefined
    }
  }))
}

export const useTermsParseConText = (data: TermsParseConTextType) => {
  provide(TermsParseKey, data)
}

export const useTermsParse = () => {
  return inject<TermsParseConTextType>(TermsParseKey, { options: ref([]), map: ref(new Map()) })
}

export const useColumnOptionsContext = (options: Ref<Array<Record<string, any>>>) => {
  provide(ColumnOptionsKey, options)
}

export const useColumnOptions = () => {
  return inject(ColumnOptionsKey, [])
}

export const useValueOptionsContext = (data) => {
  provide(ValueOptionsKey, data)
}

export const useValueOptions = () => {
  return inject(ValueOptionsKey)
}

export const useTermsEventContext = (data: Record<string, Function>) => {
  provide(TermsEventKey, data)
}

export const useTermsEvent = () => {
  return inject(TermsEventKey)
}
