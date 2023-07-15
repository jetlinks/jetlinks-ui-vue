import type {Ref} from "vue";
import {watch} from "vue";

const handlePermissionsMap = (data: any, map: Map<string, any>, parentId: string[] = []) => {
    data.forEach((item: any) => {
        if (item.children) {
            handlePermissionsMap(item.children,map, parentId.concat(item.id) )
        } else {
            map.set(item.id, {
                parentIds: parentId,
                name: item.name
            })
        }
    })
}

export const useIndirectMenusMap = (tableData: Ref<any[]>) => {
    const PermissionsMap = ref<Map<string, any>>(new Map())

    watch(() => tableData.value, () => {
        PermissionsMap.value.clear()
        if (tableData.value?.length) {
            handlePermissionsMap(tableData.value, PermissionsMap.value)
        }
    }, { immediate: true})

    return {
        PermissionsMap
    }
}