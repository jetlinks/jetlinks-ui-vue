import type { PropType } from 'vue'

export type LabelType = string | number | undefined

export type DropdownButtonOptions = {
  label: string;
  value: string;
  children?: DropdownButtonOptions[];
  [key: string]: any;
};

export type TabsOption = {
  label: string;
  key: string;
  component: string
}
type ValueArrayType = [string, number, undefined]
export type ValueType = string | number | undefined | ValueArrayType

export const defaultSetting = {
  icon: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: undefined
  },
  value: {
    type: [String, Number, Array] as PropType<ValueType>,
    default: undefined
  },
  valueName: {
    type: String,
    default: 'value'
  },
  labelName: {
    type: String,
    default: 'label'
  },
  source: {
    type: String,
    default: 'fixed'
  },
  options: {
    type: Array as PropType<Array<DropdownButtonOptions>>,
    default: () => []
  },
  metricOptions: { // 指标值
    type: Array as PropType<Array<DropdownButtonOptions>>,
    default: () => []
  },
  tabsOptions: {
    type: Array as PropType<Array<TabsOption>>,
    default: () => []
  }
}
