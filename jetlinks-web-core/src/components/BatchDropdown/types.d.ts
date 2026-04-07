import type { ButtonProps } from "ant-design-vue/es/button";
import type { PopconfirmProps } from "ant-design-vue/es/popconfirm";

export interface BatchActionsType extends ButtonProps {
  key: string;
  text?: string;
  permission?: string;
  onClick?: (data: any) => void;
  style?: CSSProperties;
  popConfirm?: PopconfirmProps;
  icon?: string;
  selected?: {// 需要选择表格数据，后触发的事件
    popConfirm?: PopconfirmProps;
    onClick?: (data: any) => void
  }
}