import type { FormProps } from 'ant-design-vue/es/form'

export interface OptionsComponent {
  /** FormItem title **/
  title?: string
  /** 组件名称 **/
  component?: string
  /** 组件Props **/
  componentProps?: any
  /** 组件Options **/
  options?: any[]
  name?: any
  [name: string]: any
}

export interface OptionsItem extends OptionsComponent{
  /** 内置查询，会覆盖options **/
  onSearch?: () => Promise<any>
  default?: any
  /** 隐藏Item，值不会进入到FormModel中 **/
  visible?: boolean
  /** 表单隐藏域 **/
  hidden?: boolean,
  span?: number | string
  rules?: FormProps.rules
  required?: boolean
  tooltip?: string
  noStyle?: boolean
}

interface ObjectTypes {
  type: 'Object'
  properties: {
    [name: string]: OptionsItem
  }
}

export interface Options extends FormProps {
  [name: string]: ObjectTypes | OptionsItem
}