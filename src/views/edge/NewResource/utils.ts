export const TargetTypeOptions = [
    {
        label: 'AI模型',
        value: 'AiModel'
    },
    {
        label: '插件',
        value: 'PluginDriver'
    },
    {
        label: '协议',
        value: 'ProtocolDriver'
    },
    {
        label: '采集器模板',
        value: 'entityTemplate:Collector'
    }
]

export const ServiceIdEnum = {
    'AiModel': 'aiService:modelManager',
    'PluginDriver': 'pluginService:driver',
    'ProtocolDriver': 'protocolService:driver',
    'entityTemplate:Collector': 'commonService:entityTemplate'
}

export const JobTypeEnum = {
    'AiModel': 'AiModel',
    'PluginDriver': 'plugin',
    'ProtocolDriver': 'protocol',
    'entityTemplate:Collector': 'CollectorTemplate'
}
