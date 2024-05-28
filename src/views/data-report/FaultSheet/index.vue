<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="fault-config"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="configRef"
                :columns="columns"
                :request="queryData"
                model="table"
                :params="params"
                :gridColumn="3"
                :row-selection="rowSelection"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            :popConfirm="{
                                title: `确认导出？`,
                                onConfirm: () => handleExport(),
                            }"
                        >
                            <AIcon type="ExportOutlined" />
                            导出
                        </PermissionButton>
                    </j-space>
                </template>
                <template #faultTime="{ faultTime }">
                    <span>
                        {{ dayjs(faultTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </span>
                </template>
            </JProTable>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { downloadObject } from '@/utils/utils';
import { PageIndex, query } from '@/api/data-report/commonApi';
import { getDicList } from '@/api/data-report/alarmSheet';

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

// 存储告警信息
const dicMap = new Map<string, any>();
// 处理告警信息
(async () => {
    const res: any = await getDicList({
        sorts: [
            {
                name: 'ordinal',
                order: 'desc',
            },
        ],
    });
    if (res.status === 200) {
        const data = res.result.data;
        data &&
            data.forEach((dic: any) => {
                dicMap.set(dic.dictId, {
                    id: dic.dictId,
                    value: dic.value,
                    desc: dic.text,
                });
            });
    }
})();

/**
 * @function queryData 请求数据
 * @param _params
 */
const queryData = async (_params: any) => {
    // 1.处理表格组件传递的参数
    const data = { ..._params };
    const resp: any = await query(PageIndex.FaultSheet, data);
    if (resp.status === 200) {
        const records = resp.result.data;
        // 为表格记录对象添加描述字段
        records.forEach((record: any) => {
            if (record.alarmDictionaryKey) {
                record['description'] = dicMap.get(
                    record.alarmDictionaryKey,
                )?.desc;
            }
        });
        return {
            // 仿造请求结果返回给表格
            code: resp.status,
            result: resp.result,
            status: resp.status,
        };
    } else {
        return {
            code: 200,
            result: {
                data: [],
                pageIndex: 0,
                pageSize: 0,
                total: 0,
            },
            status: 200,
        };
    }
};

const columns = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleTypeEnum',
        key: 'vehicleTypeEnum',
        scopedSlots: true,
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
            type: 'string',
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
        scopedSlots: true,
        ellipsis: true,
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

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};

const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
        // console.log(
        //     `selectedRowKeys: ${selectedRowKeys}`,
        //     'selectedRows: ',
        //     selectedRows,
        // );
        console.log('rowSelectionChange');
    },
    onSelect: (record: any, selected: boolean, selectedRows: any) => {
        console.log(toRaw(record), toRaw(selected), toRaw(selectedRows));
    },
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {
        console.log(selected, selectedRows, changeRows);
    },
};

/**
 * 导出
 */
const handleExport = () => {
    downloadObject(configRef.value._dataSource, `通知模板数据`);
};
</script>

<style lang="less" scoped></style>
