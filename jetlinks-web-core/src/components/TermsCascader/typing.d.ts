import type { Ref } from 'vue';

type ColumnTermTypes = Array<{ id:string, name:string}>
type ColumnFunction = Array<{
  id: string;
  name: string;
  output: {
    round:string
    name: string
    id: string
    type: string
    i18nName: string
  }
}>

type ColumnTree = {
  id: string
  dataType: string
  name: string
  fullName: string
  termTypes: ColumnTermTypes
  functions: ColumnFunction
  others: {
    bool?: Record<string, any>
    elements: Record<string, any>
  }
  children: Array<ColumnTree>
}

export type TermsParseConTextType = {
  options: Ref<Array<ColumnTree>>
  map: Ref<Map<string, ColumnTree>>
}

export type TermsValueType = Ref<{
  column?: string,
  termType?: string,
  value: {
    source: string
    value: string | Record<string, any> | Array<any> | number
  }
}>
