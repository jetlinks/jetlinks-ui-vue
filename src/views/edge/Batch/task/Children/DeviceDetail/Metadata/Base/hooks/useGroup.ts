import {provide} from "vue";

type GroupOptionsItemType = { label: string, value: string}
import { METADATA_GROUP_OPTIONS } from '@/components/Metadata/Table/consts'
export const useGroup = () => {

    const options = ref<GroupOptionsItemType[]>([])

    const addOptions = (op: GroupOptionsItemType) => {
        if (!options.value.some(item => op.label === item.label)) {
            options.value.push(op)
        }
    }

    const cleanOptions = () => {
        options.value = []
    }

    const initOptions = (dataSource: any[]) => {
        cleanOptions()
        options.value = dataSource.filter(item => item.id && item.extends?.group).map(item => ({
            label: item.group,
            value: item.group
        }))
    }

    provide(METADATA_GROUP_OPTIONS, {
        options,
        addOptions
    })

    return {
        cleanOptions,
        initOptions
    }
}
