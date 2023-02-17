import { SearchProps } from 'components/Search/types'
import { ColumnType } from 'ant-design-vue/es/table'

export interface JColumnsProps extends ColumnType{
  scopedSlots?: boolean;
  search: SearchProps;
  hideInTable?: boolean;
}