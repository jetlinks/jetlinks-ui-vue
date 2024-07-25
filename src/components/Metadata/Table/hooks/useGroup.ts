import { ref, reactive } from 'vue'

type GroupActiveType = {
    value?: number
    label?: string
    len?: number
}


export const useGroup = (openGroup: boolean = false) => {

    const groupOptions = ref<Array<GroupActiveType>>([])
    const groupActive = reactive<GroupActiveType>({
        value: undefined,
        label: undefined
    })

    /**
     * 更新当前选择的分组id
     * @param key
     * @param name
     */
    const updateGroupActive = (key: number, name: string) => {
        if (openGroup) {
            groupActive.value = key
            groupActive.label = name
        }

    }

    const addGroup = (val: GroupActiveType) => {
        if (openGroup) {
            groupOptions.value.push(val)
        }
    }

    const removeGroup = (index: number) => {
        if (openGroup) {
            groupOptions.value.splice(index, 1)
        }
    }

    const updateGroupOptions = (options: Array<GroupActiveType> = []) => {
        if (openGroup) {
            groupOptions.value = options
        }
    }

    return {
        groupOptions,
        groupActive,
        updateGroupActive,
        addGroup,
        removeGroup,
        updateGroupOptions
    }
}
