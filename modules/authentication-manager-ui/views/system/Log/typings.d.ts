import type { PopconfirmProps } from "ant-design-vue/es/popconfirm";
export type AccessLogItem = {
  id: string;
  context: any;
  describe: string;
  exception: string;
  httpHeaders: any;
  httpMethod: string;
  ip: string;
  method: string;
  parameters: any;
  requestTime: number;
  responseTime: number;
  target: string;
  url: string;
  action: string;
};

export type SystemLogItem = {
  id: string;
  className: string;
  context: any;
  createTime: number;
  exceptionStack: string;
  level: string;
  lineNumber: number;
  message: string;
  methodName: string;
  name: string;
  threadId: string;
  threadName: string;
};

export interface ActionsType {
  key: string;
  text?: string;
  disabled?: boolean;
  permission?: boolean;
  onClick?: (data: any) => void;
  style?: CSSProperties;
  tooltip?: TooltipProps;
  popConfirm?: PopconfirmProps;
  icon?: string;
  children?: ActionsType[];
}
