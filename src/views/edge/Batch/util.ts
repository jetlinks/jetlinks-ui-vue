import {useMenuStore} from "store/menu";

export const ContextName = Symbol('Batch-Task')
export const getContext = () => {
    return inject(ContextName, {})
}

export const BatchOperateOptions = [
    {
        icon: 'icon-anzhuangchajian',
        label: '安装插件',
        tip: '批量安装插件至边缘端',
        value: 'plugin'
    },
    {
        icon: 'icon-bangdingzishebei',
        label: '绑定子设备',
        tip: '批量绑定云端子设备',
        value: 'device'
    },
    {
        icon: 'icon-rongqi',
        label: '下发AI模型',
        tip: '批量下发AI模型至边缘网关',
        value: 'ai-module'
    },
    {
        icon: 'icon-rongqi1',
        label: '下发AI底库',
        tip: '批量下发AI底库至边缘网关',
        value: 'device'
    },
    {
        icon: 'icon-xiafacaijiqimoban',
        label: '下发采集器模版',
        tip: '批量下发AI采集器模版至边缘网关',
        value: 'device'
    },
]

export const batchOperateValueMap = {
    'AiModel': 'resourceIssue',
    'AiResource': 'resourceIssue',
    'CollectorTemplate': 'resourceIssue',
}
export const useBatchOperateOptions = () => {
    const menuStore = useMenuStore()
    const batchOperateOptions = ref([
        {
            icon: 'icon-anzhuangchajian',
            label: '安装插件',
            tip: '批量安装插件至边缘端',
            value: 'plugin',
            key: 'resourceIssue',
        },
        {
            icon: 'icon-bangdingzishebei',
            label: '绑定子设备',
            tip: '批量绑定云端子设备',
            value: 'device',
            key: 'bindDevice',
        },
    ])

    if (menuStore.hasMenu('EdgeResource/AiModel')) {
        batchOperateOptions.value.push({
            icon: 'icon-rongqi',
            label: '下发AI模型',
            tip: '批量下发AI模型至边缘网关',
            value: 'AiModel',
            key: 'resourceIssue',
        })
    }

    if (menuStore.hasMenu('EdgeResource/AiResource')) {
        batchOperateOptions.value.push({
            icon: 'icon-rongqi1',
            label: '下发AI底库',
            tip: '批量下发AI底库至边缘网关',
            value: 'AiResource',
            key: 'resourceIssue',
        })
    }

    if (menuStore.hasMenu('EdgeResource/CollectorTemplate')) {
        batchOperateOptions.value.push({
            icon: 'icon-xiafacaijiqimoban',
            label: '下发采集器模版',
            tip: '批量下发AI采集器模版至边缘网关',
            value: 'CollectorTemplate',
            key: 'resourceIssue',
        })
    }

    return {
        batchOperateOptions
    }

}
