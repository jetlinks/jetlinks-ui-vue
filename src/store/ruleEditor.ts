import { defineStore } from "pinia";

type RuleEditorType = {
  model: 'simple' | 'advance';
  code: string;
  property?: string;
  log: {
    content: string;
    time: number;
  }[];
};

export const useRuleEditorStore = defineStore({
  id: 'ruleEditor',
  state: () => ({ 
    state: {
      model: 'simple',
      code: '',
      log: [],
    } as RuleEditorType 
  }),
  actions: {
    set(key: string, value: any) {
      this.state[key] = value
    }
  }
})