
import { CreationStep, StepStatus } from './types';

export const INITIAL_STEPS: CreationStep[] = [
  { id: 1, label: '选择应用场景', status: StepStatus.PENDING },
  { id: 2, label: '选择数据源', status: StepStatus.PENDING },
  { id: 3, label: '选择AI模型', status: StepStatus.PENDING },
  { id: 4, label: '完善配置信息', status: StepStatus.PENDING }
];

export const REDIRECT_TIMEOUT = 10; // 10 seconds
