import type { VNode } from 'vue'


export type TermsItem = {
  column?: string
  termType?: string
  terms?: TermsItem[]
  value?: any | any[]
  type?: string
  key?: string
}

export interface SearchItem {
  dataIndex: string
  title: string
  search?: {
    type: string
    fixed?: boolean
    rename?: string
    defaultTermType?: string
    defaultValue?: any
    first?: boolean
    termTypeOptions?: string[]
    termOptions?: Array<{ label: string, value: string }>
    termFilter?: string[]
    components?: VNode
    componentProps?: Record<string, any>
    options?:
      | any[]
      | Ref<any[]>
      | (() => Promise<any[]>)
    handleValue?: (value: any) => any
    handleParamsItem?: (record: Record<string, any>, params: Array<Record<string, any>>) => TermsItem
  }
}
