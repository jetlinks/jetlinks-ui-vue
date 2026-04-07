import { provide, inject} from 'vue'
import type { Ref } from 'vue'

const useSearchOptionsKey = 'useSearchOptionsKey';
const columnsKey = 'columnsKey';

export const useColumnsContext = (data: Ref<any[]>) => {
  provide(columnsKey, data)
}

export const useColumns = () => {
  return inject(columnsKey)
}

export const useSearchOptionsContent = (data: Ref<Map<string, any>>) => {
  provide(useSearchOptionsKey, data)
}

export const useSearchOptions = () => {
  return inject(useSearchOptionsKey)
}