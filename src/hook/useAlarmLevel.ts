import { useRequest } from './useRequest'
import { queryLevel } from '@/api/rule-engine/config';

type LevelListType = Array<{ label: number, value: string}>
export const useAlarmLevel = () => {
    const levelMap = ref({})
    const levelList =  ref<LevelListType>([])

    useRequest(queryLevel, {
        onSuccess(res) {
            if (res.result?.levels?.length) {
                const arr: LevelListType = []
                levelMap.value = res.result.levels.reduce((prev: Record<string, string>, next: Record<string, any>) => {
                    prev[next.level] = next.title
                    arr.push({
                        label: next.title,
                        value: next.level
                    })
                    return prev
                }, {})
                levelList.value = arr
            }
        }
    })

    return {
        levelMap,
        levelList
    }
}
