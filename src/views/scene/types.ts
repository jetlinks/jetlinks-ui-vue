
export enum StepStatus {
  PENDING = 'PENDING',
  LOADING = 'LOADING',
  COMPLETED = 'COMPLETED'
}

export interface CreationStep {
  id: number;
  label: string;
  status: StepStatus;
}

export enum ProcessState {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  CANCELLED = 'CANCELLED'
}
