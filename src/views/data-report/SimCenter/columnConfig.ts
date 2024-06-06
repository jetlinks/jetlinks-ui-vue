export const columns = [
    {
        title: '卡号',
        dataIndex: 'id',
        key: 'id',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: 'ICCID',
        dataIndex: 'iccId',
        key: 'iccId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '绑定车辆编号',
        dataIndex: 'factoryNumber',
        key: 'factoryNumber',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '平台对接 ',
        dataIndex: 'platformConfigName',
        key: 'platformConfigName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '运营商',
        dataIndex: 'operatorName',
        key: 'operatorName',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                {
                    label: '移动',
                    value: 'onelink',
                },
                {
                    label: '电信',
                    value: 'ctwing',
                },
                {
                    label: '联通',
                    value: 'unicom',
                },
            ],
        },
    },
    {
        title: '类型',
        dataIndex: 'cardType',
        key: 'cardType',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'select',
            options: [
                {
                    label: '年卡',
                    text: '年卡',
                    value: 'year',
                },
                {
                    label: '季卡',
                    text: '季卡',
                    value: 'season',
                },
                {
                    label: '月卡',
                    text: '月卡',
                    value: 'month',
                },
                {
                    label: '其他',
                    text: '其他',
                    value: 'other',
                },
            ],
        },
    },
    {
        title: '总流量  ',
        dataIndex: 'totalFlow',
        key: 'totalFlow',
        ellipsis: true,
        scopedSlots: true,
    },
    {
        title: '使用流量',
        dataIndex: 'usedFlow',
        key: 'usedFlow',
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '剩余流量',
        dataIndex: 'residualFlow',
        key: 'residualFlow',
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '激活日期',
        dataIndex: 'activationDate',
        key: 'activationDate',
        scopedSlots: true,
        width: 180,
        search: {
            type: 'date',
        },
    },
    {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        scopedSlots: true,
        width: 180,
        search: {
            type: 'date',
        },
    },
    {
        title: '状态',
        dataIndex: 'cardStateType',
        key: 'cardStateType',
        scopedSlots: true,
        width: 100,
        search: {
            type: 'select',
            options: [
                {
                    label: '待激活',
                    text: '待激活',
                    value: 'toBeActivated',
                },
                {
                    label: '停机',
                    text: '停机',
                    value: 'deactivate',
                },
                {
                    label: '激活',
                    text: '激活',
                    value: 'using',
                },
                {
                    label: '其他',
                    text: '其他',
                    value: 'other',
                },
                {
                    label: '同步失败',
                    text: '同步失败',
                    value: 'error',
                },
                {
                    label: '未同步',
                    text: '未同步',
                    value: 'notReady',
                },
            ],
        },
    },
];
