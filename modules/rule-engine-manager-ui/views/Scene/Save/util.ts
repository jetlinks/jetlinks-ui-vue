import {queryBuiltInParams} from '../../../api/scene'
import {handleParamsData} from './components/Terms/util'
import {useSceneStore} from '../../../store/scene'
import {storeToRefs} from 'pinia'
import type { FormModelType } from '../typings'
import { ActionBranchesProps } from '../typings'

interface Params {
    branch: number
    branchGroup: number
    action: number
}

export const ACTION_DATA = Symbol('action_data')

export const getParams = (params: Params, sceneModel: FormModelType): Promise<any[]> => {
    return new Promise(res => {
        const data = sceneModel.branches!.filter(item => !!item)
        queryBuiltInParams({
            ...sceneModel,
            branches: data
        }, params).then(resp => {
            if (resp.success) {
                res(resp.result as any[])
            }
        }).catch(() => res([]))
    })
}

/**
 * @param params
 */
export const useParams = (params: Params) => {
    const sceneStore = useSceneStore()
    const {data: formModel} = storeToRefs(sceneStore)
    const columnOptions = ref<any[]>([])

    const handleParams = async () => {
        const _data = await getParams(params, formModel.value)
        columnOptions.value = handleParamsData(_data, 'id')
    }

    watchEffect(() => {
        if (formModel.value.branches![params.branch].then[params.branchGroup].actions[params.action]) {
            handleParams()
        }
    })

    return {
        columnOptions
    }
}

export const DeviceEmitterKey = 'device_rules'

/**
 * 发布keys
 * @param params
 * @constructor
 */
export const EventEmitterKeys = (params: Params): string => {
    const _b = `branches_${params.branch}` // branchesName
    const _t = `then_${params.branchGroup}` // thenName
    const _a = `then_${params.action}` // actionName
    return `${_b}_${_t}_${_a}`
}

/**
 * 订阅keys
 * @param params
 * @constructor
 */
export const EventSubscribeKeys = (params: Params): string[] => {
    const sceneStore = useSceneStore()

    let keys: string[] = []

    if (params.action === 0) {
        keys.push(DeviceEmitterKey)
    }

    for (let i = 0; i <= params.action - 1; i++) {
        let key = sceneStore.data.branches?.[params.branch].then[params.branchGroup].actions[i]?.key
        if (!key) {
            const _b = `branches_${params.branch}` // branchesName
            const _t = `then_${params.branchGroup}` // thenName
            const _a = `then_${i}` // actionName
            key = `${_b}_${_t}_${_a}`
        }
        keys.push(key)
    }

    return keys
}

export const EventEmitter = {
    list: {},
    subscribe: function (events: string[], fn: Function) {
        const list = this.list
        events.forEach(event => {
            (list[event] || (list[event] = [])).push(fn)
        })
        return this
    },
    emit: function (events: string, data?: any) {
        const list = this.list
        const fns: Function[] = list[events] ? [...list[events]] : []

        if (!fns.length) return false;

        fns.forEach(fn => {
            fn(data)
        })

        return this
    },
    unSubscribe: function (events: string[], fn: Function) {
        const list = this.list
        events.forEach(key => {
            if (key in list) {
                const fns = list[key]
                for (let i = 0; i < fns.length; i++) {
                    if (fns[i] === fn) {
                        fns.splice(i, 1)
                        break;
                    }
                }
            }
        })
        return this
    }
}

export const isActionChange = (_metadata: Record<string, any[]>, _message: any) => {
    if (!_message) return false

    const { properties = [], functions = [] } = _metadata
    const { messageType, properties: msgProperties, functionId } = _message

    switch (messageType) {
        case "READ_PROPERTY": {
            const propertyId = msgProperties?.[0];
            if (!propertyId) return false;

            const item = properties.find(
              (p: any) => p.id === propertyId && p.expands?.type?.includes('read'),
            );
            return item?.id || false;
        }

        case "INVOKE_FUNCTION": {
            // 确保 functionId 存在
            if (!functionId) return false;

            const item = functions.find((f: any) => f.id === functionId);
            return item?.id || false;
        }

        case "WRITE_PROPERTY": {
            // 使用 Object.keys 获取属性，并确保 msgProperties 存在
            const propertyId = msgProperties && Object.keys(msgProperties)[0];
            if (!propertyId) return false;

            const item = properties.find(
              (p: any) => p.id === propertyId && p.expands?.type?.includes('write'),
            );
            return item?.id || false;
        }

        default: {
            return false
        }
    }
};

export const handleFeatures = (branches: ActionBranchesProps[]): string[] => {
    let features = new Set<string>()
    branches.forEach(branchesItem => {
        if (branchesItem?.then) {
            branchesItem.then.forEach(thenItem => {
                thenItem.actions.forEach(actionItem => {
                    if (actionItem.executor === 'alarm') {
                        features.add(actionItem.alarm?.mode === 'trigger' ? 'alarmTrigger' : 'alarmReliever')
                    }
                    // 处理options中的column、columnMap
                    const _options = actionItem.options || {}
                    const columnMapKeys = Object.values(_options.columnMap || {})
                    const columns = new Set([...(_options.columns || []), ...columnMapKeys]) // 去重
                    actionItem.options.columns = [...columns.values()]
                })
            })
        }
    })

    return features.size === 0 ? ['none'] : [...features.values()]
}


export const actionIconMap = {
    'device': 'icon-shebeishuchu',
    'notify': 'icon-xiaoxitongzhi',
    'delay': 'icon-yanchizhihang',
    'trigger': 'icon-chufagaojing',
    'relieve': 'icon-jiechugaojing',
    'device-data': 'icon-shebeixinxi',
    'collector': 'icon-collector-output'
}
