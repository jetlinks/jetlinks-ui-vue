export const columns = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleTypeEnum',
        key: 'vehicleTypeEnum',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '出厂编号',
        dataIndex: 'factoryNumber',
        key: 'factoryNumber',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '车辆简称',
        dataIndex: 'simpleName',
        key: 'simpleName',
        search: {
            type: 'string',
        },
    },
    {
        title: '故障设备',
        dataIndex: 'alarmDeviceName',
        key: 'alarmDeviceName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '故障码',
        dataIndex: 'faultCode',
        key: 'faultCode',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '故障说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        search: {
            type: 'select',
            options: [],
        },
    },
    {
        title: '型号',
        dataIndex: 'modelNumber',
        key: 'modelNumber',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属组织',
        dataIndex: 'orgName',
        key: 'orgName',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '故障时间 ',
        dataIndex: 'faultTime',
        key: 'faultTime',
        width: 180,
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '车辆位置',
        dataIndex: 'lngLat',
        key: 'lngLat',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
];
