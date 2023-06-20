const initData: any[] = [
    {
        provider: 'alarm',
        name: '告警',
        children: [
            {
                provider: 'alarm-product',
                name: '产品告警',
                description:
                    '当产品类型的告警被触发时，你将在已订阅的方式中收到通知',
            },
            {
                provider: 'alarm-device',
                name: '设备告警',
                description:
                    '当设备类型的告警被触发时，你将在已订阅的方式中收到通知',
            },
            {
                provider: 'alarm-org',
                name: '部门告警',
                description:
                    '当部门类型的告警被触发时，你将在已订阅的方式中收到通知',
            },
            {
                provider: 'alarm-other',
                name: '其他告警',
                description:
                    '当其他类型的告警被触发时，你将在已订阅的方式中收到通知',
            },
        ],
    },
    {
        provider: 'system-monitor',
        name: '系统监控',
        children: [
            {
                provider: 'system-event',
                name: '系统运行异常',
            },
        ],
    },
    {
        provider: 'system-business',
        name: '业务监控',
        children: [
            {
                provider: 'device-transparent-codec',
                name: '透传消息解析异常',
            },
        ],
    },
];

export { initData };