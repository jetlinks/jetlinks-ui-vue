import { getDicList, vehicleTypeEnum } from '@/api/data-report/commonApi';

export const columnConfig = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleTypeEnum',
        key: 'vehicleTypeEnum',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    vehicleTypeEnum().then((resp: any) => {
                        resolve(
                            resp.result.map((item: any) => ({
                                label: item.text,
                                value: item.value,
                            })),
                        );
                    });
                }),
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
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '型号',
        dataIndex: 'modelNumber',
        key: 'modelNumber',
        ellipsis: true,
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
        title: '告警时间',
        dataIndex: 'alarmTime',
        key: 'alarmTime',
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
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '告警设备',
        dataIndex: 'deviceId',
        key: 'deviceId',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '告警说明',
        dataIndex: 'description',
        key: 'description',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    getDicList({
                        pageSize: 9999,
                        pageNum: 0,
                        sorts: [
                            {
                                name: 'ordinal',
                                order: 'desc',
                            },
                        ],
                        terms: [
                            {
                                column: 'dictId',
                                value: ['aa', 'bb', 'cc'],
                                termType: 'in',
                            },
                        ],
                    }).then((resp) => {
                        const res = resp.result.data.map((item: any) => ({
                            label: item.text,
                            value: `${item.dictId}_${item.value}`,
                        }));
                        resolve(res);
                    });
                }),
        },
    },
];
