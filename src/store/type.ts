import { defineStore } from "pinia";

export const useTypeStore = defineStore({
    id: 'type',
    state: () => ({
        configRef: [] as any,
        resourcesClusters: {} as any,
    }),
    actions: {
        setConfigRef(current: any[]) {
            this.configRef = current
        },
        setResourcesClusters(current: any) {
            this.resourcesClusters = current
        }
    }
})