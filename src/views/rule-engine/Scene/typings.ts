import i18n from '@/i18n'

const $t = i18n.global.t
export const keyByLabel = {
  manual: $t('Scene.typings.542571-0'),
  timer: $t('Scene.typings.542571-1'),
  device: $t('Scene.typings.542571-2'),
}

type State = {
  value: string;
  text: string;
};

export type optionItem = {
  label: string
  value: string
}

type Action = {
  executor: string;
  configuration: Record<string, unknown>;
};

type Trigger = {
  type: string;
  device: Record<string, any>;
};

export enum ParallelEnum {
  'parallel' = 'parallel',
  'serial' = 'serial',
}

export type ParallelType = keyof typeof ParallelEnum;

export enum Source {
  'manual' = 'manual',
  'metric' = 'metric',
  'fixed' = 'fixed',
}

export enum ActionDeviceSelector {
  'all' = 'all',
  'fixed' = 'fixed',
  'tag' = 'tag',
  'relation' = 'relation',
  'context' = 'context',
}

export enum ActionDeviceSource {
  'fixed' = 'fixed',
  'upper' = 'upper',
  'relation' = 'relation',
}

export enum OperatorType {
  'online' = 'online',
  'offline' = 'offline',
  'reportEvent' = 'reportEvent',
  'reportProperty' = 'reportProperty',
  'readProperty' = 'readProperty',
  'writeProperty' = 'writeProperty',
  'invokeFunction' = 'invokeFunction',
}

export enum TimerTrigger {
  'week' = 'week',
  'month' = 'month',
  'cron' = 'cron',

  'multi' = 'multi',
}

export enum TimeUnit {
  'seconds' = 'seconds',
  'minutes' = 'minutes',
  'hours' = 'hours',
}

export enum Executor {
  'notify' = 'notify',
  'delay' = 'delay',
  'device' = 'device',
  'alarm' = 'alarm',
}

export enum DeviceMessageType {
  'INVOKE_FUNCTION' = 'INVOKE_FUNCTION',
  'READ_PROPERTY' = 'READ_PROPERTY',
  'WRITE_PROPERTY' = 'WRITE_PROPERTY',
}

export enum ActionAlarmMode {
  'trigger' = 'trigger',
  'relieve' = 'relieve',
}

export interface OperationTimerPeriod {
  from: string;
  to: string;
  every: number;
  unit: keyof typeof TimeUnit;
}

export interface OperationTimer {
  trigger: keyof typeof TimerTrigger;
  mod: string;
  cron?: string;
  when?: string[];
  period?: OperationTimerPeriod;
  once?: Record<string, any>;

  multi?: {
    type: string,
    spec: Array<Record<string, any>>
  };
}

export interface TriggerDeviceOptions {
  operator: keyof typeof OperatorType;
  /** 触发类型为readProperty,writeProperty,invokeFunction时不能为空 */
  timer?: OperationTimer;
  /** 触发类型为reportEvent时不能为空 */
  eventId?: string;
  /** 触发类型为readProperty时不能为空 */
  readProperties?: string[];
  /** 触发类型为writeProperty时不能为空 */
  writeProperties?: Record<string, any>;
  /** 触发类型为invokeFunction时不能为空 */
  functionId?: string;
  /** 触发类型为invokeFunction时不能为空 */
  functionParameters?: Record<string, any>[];
}

export type SelectorValuesItem = {
  name: string
  value: any
}

/**
 * 设备触发配置
 */
export interface TriggerDevice {
  productId: string;
  selector: string;
  selectorValues?: SelectorValuesItem[];
  operation?: TriggerDeviceOptions;
}

export interface ShakeLimitType {
  enabled: boolean;
  groupType?: string; // 执行动作没有该参数
  time: number;
  threshold: number;
  alarmFirst: boolean;
}

export interface BranchesType {
  enabled: boolean;
  groupType?: string; // 执行动作没有该参数
  time: number;
  threshold: number;
  alarmFirst: boolean;
}

export interface SceneItem {
  parallel: boolean;
  state: State;
  actions: Action[];
  trigger: Trigger;
  id: string;
  name: string;
  description: string;
  branches: BranchesType[];
  options: any;
  triggerType: string;
}

export type TriggerType = {
  type: string;
  /**
   * 防抖配置
   */
  shakeLimit?: ShakeLimitType;
  /**
   * 拓展信息
   */
  options?: Record<string, any>;
  /**
   * 设备触发配置
   */
  device?: TriggerDevice;
  /**
   * 定时触发配置
   */
  timer?: OperationTimer;
};

export interface TermsVale {
  source: string;
  /** 手动输入值,source为 manual 时不能为空 */
  value?: Record<string, any> | any[];
  /** 指标值,source为 metric 时不能为空 */
  metric?: Record<string, any>;
}

export type TermsType = {
  column?: string;
  value?: TermsVale;
  type?: string;
  termType?: string;
  options?: any[];
  terms?: TermsType[];
  key?: string;
  error?: boolean
  metric?: string

  alarm?: string
};

export type PlatformRelation = {
  objectType: string;
  objectId: string;
};

export type Relationship = {
  objectType: string;
  objectSource: {
    source: string;
    upperKey: string;
  };
  related: {
    objectType: string;
    relation: string;
  };
};

export interface NotifyVariablesType {
  source: string;
  value?: Record<string, any>;
  upperKey?: string;
  relation?: PlatformRelation | Relationship;
}

export interface NotifyProps {
  notifyType: string;
  notifierId: string;
  templateId: string;
  variables: Record<string, NotifyVariablesType>;
  options?: Record<string, any>;
  changeData?: Boolean
}

export type SelectorValuesType =
  | { value: string; name: string }
  | { value: { column: string; value: any }[]; name: string }
  | { value: { objectType: string; relation: any }[] };

export type ActionDeviceMessageType = {
  deviceId: string;
  messageType: keyof typeof DeviceMessageType;
  /** 功能调用时使用 */
  functionId?: string;
  /** 功能调用时使用 */
  inputs?: Record<string, any>[];
  /** 读取属性时使用, 读取属性时为String数组，设置属性时为 Object */
  properties?: string[] | Record<string, any>;
};

export interface ActionsDeviceProps {
  selector: keyof typeof ActionDeviceSelector;
  source: keyof typeof ActionDeviceSource;
  productId?: string;
  message?: ActionDeviceMessageType;
  selectorValues?: SelectorValuesType[];
  /** 来源为upper时不能为空 */
  upperKey?: string;
  /** 来源为relation时不能为空 */
  relation?: any;
  changeData?: boolean
}

export interface BranchesThen {
  parallel: boolean;
  actions: ActionsType[];
  key?: string;
}

export interface ActionBranchesProps {
  when: TermsType[];
  shakeLimit: ShakeLimitType;
  then: BranchesThen[];
  key?: string;

  executeAnyway?: boolean
}

export interface ActionsType {
  executor: keyof typeof Executor;
  /** 执行器类型为notify时不能为空 */
  notify?: NotifyProps;
  /** 执行器类型为delay时不能为空 */
  delay?: {
    time?: number;
    unit?: keyof typeof TimeUnit;
  };
  device?: ActionsDeviceProps;
  alarm?: {
    mode: keyof typeof ActionAlarmMode;
  };
  terms?: TermsType[];
  /** map中的key，用于删除 */
  key?: string;

  actionId?: number
  options?: Record<string, any>;
}

export type BranchesGroup = Array<ActionBranchesProps[]>

export interface FormModelType {
  id?: string;
  name?: string;
  /**
   * 触发方式
   */
  trigger?: TriggerType;
  /**
   * 触发条件,结构与通用查询条件相同。条件数据来自接口：根据触发器解析出支持的条件列
   */
  terms?: TermsType[];
  /**
   * 执行动作
   */
  actions?: ActionsType[];
  /**
   * 动作分支
   */
  branches?: ActionBranchesProps[] | Array<ActionBranchesProps[]>;
  /**
   * 拓展信息,用于前端存储一些渲染数据
   */
  options?: Record<string, any>;
  triggerType?: 'device' | 'manual' | 'timer'
  description?: string;
}

export type metadataType = {
  properties?: any[]
  functions?: any[]
  events?: any[]
}
