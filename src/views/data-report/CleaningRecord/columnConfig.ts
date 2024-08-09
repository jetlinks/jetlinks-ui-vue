export const columns = [
    {
        title: '设备ID',
        dataIndex: 'deviceId',
        key: 'deviceId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '物模型ID',
        dataIndex: 'productId',
        key: 'productId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '清洗时间',
        dataIndex: 'cleanTime',
        key: 'cleanTime',
        width: 180,
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '清洗字段',
        dataIndex: 'cleanField',
        key: 'cleanField',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '上报值',
        dataIndex: 'reportValue',
        key: 'reportValue',
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
