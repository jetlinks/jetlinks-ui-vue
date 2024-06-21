export const columnsConfig = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 200,
        fixed: 'left',
        ellipsis: true,
        search: {
            type: 'number',
        },
    },
    // {
    //     title: '公司名称',
    //     dataIndex: 'companyName',
    //     key: 'companyName',
    //     search: {
    //         type: 'string',
    //     },
    //     width: 100,
    //     ellipsis: true,
    //     fixed: 'left',
    // },
    {
        title: '发送地址',
        dataIndex: 'address',
        key: 'address',
        search: {
            type: 'string',
        },
        width: 100,
    },
    {
        title: '设备规则',
        dataIndex: 'deviceRuleCode',
        key: 'deviceRuleCode',
        search: {
            type: 'string',
        },
        width: 100,
    },
    {
        title: '账号',
        dataIndex: 'username',
        key: 'username',
        search: {
            type: 'string',
        },
        width: 100,
    },
    {
        title: '密码',
        dataIndex: 'password',
        key: 'password',
        search: {
            type: 'string',
        },
        width: 120,
    },
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        search: {
            type: 'select',
            options: [
                {
                    label: '启用',
                    value: 1,
                },
                {
                    label: '禁用',
                    value: 0,
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: '加密类型',
        dataIndex: 'encryptType',
        key: 'encryptType',
        search: {
            type: 'select',
            options: [],
        },
        width: 100,
    },
    {
        title: '公钥',
        dataIndex: 'publicKey',
        key: 'publicKey',
        width: 100,
    },
    {
        title: '有效开始时间',
        dataIndex: 'efficaciousStartTime',
        key: 'efficaciousStartTime',
        width: 180,
        scopedSlots: true,
    },
    {
        title: '有效结束时间',
        dataIndex: 'efficaciousEndTime',
        key: 'efficaciousEndTime',
        width: 180,
        scopedSlots: true,
    },
    {
        title: '创建者ID',
        dataIndex: 'publicKey',
        key: 'publicKey',
        width: 100,
        ellipsis: true,
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 180,
        scopedSlots: true,
    },
    {
        title: '修改人ID',
        dataIndex: 'modifierId',
        key: 'modifierId',
        width: 100,
        ellipsis: true,
    },
    {
        title: '修改时间',
        dataIndex: 'modifyTime',
        key: 'modifyTime',
        width: 180,
        scopedSlots: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 170,
        scopedSlots: true,
    },
];
