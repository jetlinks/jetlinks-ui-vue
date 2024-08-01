import { useSceneStore } from '@/store/scene'
import {storeToRefs} from "pinia";
import type {BranchesGroup} from "@/views/rule-engine/Scene/typings";
export const useTrigger = () => {
    const sceneStore = useSceneStore()
    const { data } = storeToRefs(sceneStore)
    const open = ref(false)


    watchEffect(() => {
        const group = data.value.branches as BranchesGroup
        open.value = !!group?.filter(item => item.filter(b => b)?.length).length
    })

    return {
        open
    }
}
