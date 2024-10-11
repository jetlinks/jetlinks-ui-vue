export const ContextName = Symbol('Batch-Task')
export const getContext = () => {
    return inject(ContextName, {})
}

export const BatchOperateOptions = [
    {
        icon: '',
        label: '安装插件',
        tip: '批量安装插件至边缘端',
        value: 'plugin'
    },
    {
        icon: '',
        label: '远程升级',
        tip: '批量升级边缘网关固件',
        value: 'remote'
    },
    {
        icon: '',
        label: '绑定子设备',
        tip: '批量绑定云端子设备',
        value: 'device'
    },
]
