import { getBuiltinRegionTree } from '@/api/system/region';
import {useRequest} from "@/hook";

export const useArea = () => {
    const areaMap = ref(new Map())


    const handleAreaMap = (data: any[] = [], parentCode?: string) => {
        for (let i = 0;i < data.length; i++) {
            const _data = data[i]
            areaMap.value.set(_data.code, {
                parentId: parentCode,
                name: _data.name
            })
            if (_data.children?.length) {
                handleAreaMap(_data.children, _data.code)
            }
        }
    }

    const { data: areaTree } = useRequest(getBuiltinRegionTree, {
        onSuccess(resp) {
            handleAreaMap(resp?.result)
        },
        defaultParams: [{
            paging: false,
            sorts: [{ name: 'sortIndex', order: 'asc' }],
        }]
    })

    const getParentNameById = (id?: string) => {
        let _id = id
        const name = []

        while (!!_id) {
            const item = areaMap.value.get(_id)
            if (item) { // 不添加本身
                name.unshift(item.name)
            }
            _id = item?.parentId
        }

        return name
    }

    return {
        areaTree,
        areaMap,
        getParentNameById
    }
}
