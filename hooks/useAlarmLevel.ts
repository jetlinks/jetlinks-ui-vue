import { useRequest } from '@jetlinks-web/hooks'
import { queryLevel } from '../api/rule-engine/config';

type LevelListType = Array<{ label: number, value: string}>
export const useAlarmLevel = () => {
    const levelMap = ref({})
    const levelList =  ref<LevelListType>([])
    const  handleValue = (result:any) =>{
        const arr: LevelListType = []
        const map = result.levels.reduce((prev: Record<string, string>, next: Record<string, any>) => {
            prev[next.level] = next.title
            arr.push({
                label: next.title,
                value: next.level
            })
            return prev
        }, {})
        return {
            arr,
            map
        }
    }
    useRequest(queryLevel, {
        onSuccess(res) {
            if (res.result?.levels?.length) {
                const { arr , map } = handleValue(res.result);
                levelList.value = arr;
                levelMap.value = map;
            }
        },
    })
    const getLevelList = () =>{
        return queryLevel().then((res)=>{
           const { arr } = handleValue(res.result);
           return arr;
        })
    }

    return {
        getLevelList,
        levelMap,
        levelList
    }
}
