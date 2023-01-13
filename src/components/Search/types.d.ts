export interface SearchProps {
  rename?: string
  type?: 'select' | 'number' | 'string' | 'treeSelect' | 'date' | 'time'
  format?: string
  options?: any[] | Function
  first?: boolean
  defaultTermType?: string // 默认 eq
  title?: ColumnType.title
  sortIndex?: number
}

export interface SearchItemData {
  column: ColumnType.dataIndex
  rename?: string
  value: any
  termType: string
  type?: string
  title: string
}

export interface SearchItemProps extends SearchProps, SearchItemData {}
