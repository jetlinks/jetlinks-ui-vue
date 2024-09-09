import { defineStore } from "pinia"
import { onlyMessage } from "@/utils/comm"
import { queryList } from '@/api/media/auto';

export const useMediaStore = defineStore({
  id: 'media',
  state: () => ({
    detail: {},
    tabActiveKey: 'Rule'
  }),
  actions: {
    setCurrent(current:any) {
      this.detail = current
    },
    async refresh(id: string) {
      const resp:any = await queryList({
        terms: [
            {
                column: 'id',
                termType: 'eq',
                value: id,
            },
        ],
    });
      if(resp.status === 200){
        this.detail = resp.result.data?.[0]
      }
    },
    setTabActiveKey(key: string) {
      this.tabActiveKey = key
    },
  }
})