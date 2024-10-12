import { defineStore } from "pinia";

export const useResourceStore = defineStore('alarm', () => {
    const resource = ref({})
    return {
        resource
    }
})