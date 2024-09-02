import { getBuiltinRegionTree } from '@/api/system/region';
import {useRequest} from "@jetlinks-web/hooks";

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

export const REGION_KEY = Symbol('region_key')

export const useRegion = () => {
    return inject(REGION_KEY, {
        edit: false,
        type: undefined, // MAP_TOOL

    })
}

export const useHistory = () => {
    const history = ref([])

    const addRecord = (record: Record<string, any>) => {
        history.value.push(record)
        if (history.value.length > 10) { // 最多记录10条
            history.value = history.value.slice(1)
        }

    }

    /**
     * 撤销
     */
    const revoke = () => {
        if (!hasHistory.value) {
            return
        }

        if (history.value.length) {
            // 删除最后一条
            history.value.pop()
        }

        return getLastHistory()
    }

    const getLastHistory = () => {
        return history.value[history.value.length - 1]
    }

    const hasHistory = computed(() => {
        return history.value.length > 1
    })

    const reset = () => {
        history.value = []
    }

    return {
        revoke,
        getLastHistory,
        addRecord,
        reset,
        hasHistory
    }
}
