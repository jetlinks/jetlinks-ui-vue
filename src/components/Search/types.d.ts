export interface SearchBaseProps {
  rename?: string
  type?: 'select' | 'number' | 'string' | 'treeSelect' | 'date' | 'time'
  format?: string
  options?: any[] | Function
  first?: boolean
  defaultTermType?: string // 默认 eq
  title?: ColumnType.title
  sortIndex?: number
  handleValue?: (value: SearchItemData) => any
}

export interface SearchItemProps {
  rename?: SearchBaseProps['rename']
  title: string
  column: ColumnType.dataIndex
}

export interface SearchItemData {
  column: ColumnType.dataIndex
  value: any
  termType: string
  type?: string
}

export interface TermsItem {
  terms: SearchItemData[]
}

export interface Terms {
  terms: TermsItem[]
}

export interface SortItem {
  name: string
  order?: 'desc' | 'asc'
  value?: any
}

export interface SearchHistoryList {
  content?: string
  name: string
  id: string
  key: string
}

export interface SearchProps extends SearchBaseProps, SearchItemProps {

}
