export const config = [
    [
        {
            title: '属性名称',
            dataIndex: 'name',
            key: 'name',
            // width: 100,
            // align: 'center',
            // ellipsis: true,
            // scopedSlots: { customRender: 'name' }
            search: {
                type: 'string',
            },
        },
        {
            title: '清洗说明',
            dataIndex: 'desc',
            key: 'desc',
            // width: 100,
            // align: 'center',
            // ellipsis: true,
            // scopedSlots: { customRender: 'desc' },
            search: {
                type: 'string',
            },
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 100,
            align: 'center',
            scopedSlots: { customRender: 'action' },
        },
    ],
    [
        {
            title: '事件名称',
            dataIndex: 'name',
            key: 'name',
            // width: 100,
            // align: 'center',
            // ellipsis: true,
            // scopedSlots: { customRender: 'name' }
        },
        {
            title: '清洗说明',
            dataIndex: 'desc',
            key: 'desc',
            // width: 100,
            // align: 'center',
            // ellipsis: true,
            // scopedSlots: { customRender: 'desc' },
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            width: 100,
            align: 'center',
            scopedSlots: { customRender: 'action' },
        },
    ],
];

export const mockData = [
    {
        name: '温度',
        desc: '温度高于100进行清洗',
    },
    {
        name: '温度',
        desc: '速度大于200km/h进行清洗',
    },
];
