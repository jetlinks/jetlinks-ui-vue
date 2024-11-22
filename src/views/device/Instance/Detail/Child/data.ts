export const stateMap = new Map();
stateMap.set('success', {
    text: '已映射',
    status: 'success',
});
stateMap.set('error', {
    text: '失败',
    status: 'error',
});
stateMap.set('warning', {
    text: '待保存',
    status: 'warning',
});
stateMap.set('none', {
    text: '未映射',
    status: 'default',
});

export const statusMap = new Map()
statusMap.set('notActive','warning')
statusMap.set('offline','error')
statusMap.set('online','success')


export const columns = [
    {
        title: '平台设备ID',
        dataIndex: 'id',
        key: 'id',
        scopedSlots: true,
        search: {
            type: 'string',
            defaultTermType: 'eq',
        },
    },
    {
        title: '平台设备名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属产品',
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '注册时间',
        dataIndex: 'registryTime',
        key: 'registryTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
  
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe',
        scopedSlots: true,
        search: {
            type: 'string',
        },
        width: 100,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        width: 70,
        search: {
            type: 'select',
            options: [
                { label: '禁用', value: 'notActive' },
                { label: '离线', value: 'offline' },
                { label: '在线', value: 'online' },
            ],
        },
    },
    {
        title: '已映射边端设备',
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];
