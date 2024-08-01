export const columns = [
    {
        title: '设备名称',
        dataIndex: 'factoryNumber',
        key: 'factoryNumber',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属产品',
        dataIndex: 'simpleName',
        key: 'simpleName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '清洗时间',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
        width: 180,
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '清洗字段',
        dataIndex: 'lngLat',
        key: 'lngLat',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '上报值',
        dataIndex: 'deviceId',
        key: 'deviceId',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 120,
        scopedSlots: true,
        ellipsis: true,
    },
];
