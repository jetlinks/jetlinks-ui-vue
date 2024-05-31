<template>
    <div>
        <pro-search
            :columns="columns"
            target="ADAS-config"
            @search="handleSearch"
        ></pro-search>
        <full-page>
            <JProTable
                ref="configRef"
                :columns="columns"
                :request="queryADAS"
                :defaultParams="{
                    sorts: [{ name: 'reportTime', order: 'desc' }],
                }"
                model="table"
                :params="params"
                :gridColumn="3"
                :row-selection="rowSelection"
            >
                <template #headerTitle>
                    <j-space>
                        <j-popconfirm
                            title="确认导出？"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="handleExport"
                        >
                            <PermissionButton>
                                <AIcon type="ExportOutlined" />
                                导出
                            </PermissionButton>
                        </j-popconfirm>
                    </j-space>
                </template>
                <template #action="slotProps">
                    <a-button danger type="text" @click="onDetail(slotProps)">
                        查看</a-button
                    >
                </template>

                <template #reportTime="{ reportTime }">
                    {{ dayjs(reportTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template #orgName="{ orgName }">
                    {{ orgName || '暂未标记组织' }}
                </template>
            </JProTable>
        </full-page>
    </div>

    <Details v-if="visible" v-model:visible="visible" :data="dataInfo" />
</template>

<script setup lang="ts">
import Details from './Detail.vue';
import dayjs from 'dayjs';
import { onlyMessage } from '@/utils/comm';
import { queryADAS, adasExport } from '@/api/data-report/IrregularDriving';
import { downloadFileByUrl } from '@/utils/utils';
import moment from 'moment';

const visible = ref(false);

const dataInfo = ref<Record<string, any>>();

const selectIds = ref<Array<number | string>>([]);

const configRef = ref<Record<string, any>>({});
/**
 * 导出
 */
const type = ref<string>('xlsx');
const handleExport = async () => {
    if (!selectIds.value?.length) {
        onlyMessage('请勾选需要导出的数据', 'error');
        return;
    }
    const _params = {
        terms: [
            {
                column: 'id',
                value: selectIds.value,
                termType: 'in',
            },
        ],
    };
    adasExport(type.value, _params).then((res: any) => {
        if (res) {
            const blob = new Blob([res.data], { type: type.value });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(
                url,
                `ADAS异常数据-${moment(new Date()).format(
                    'YYYY/MM/DD HH:mm:ss',
                )}`,
                type.value,
            );
        }
    });
};
const onDetail = (data: Record<string, any>) => {
    dataInfo.value = data;
    visible.value = true;
};

const params = ref<Record<string, any>>({});
const columns = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleTypeEnum',
        key: 'vehicleTypeEnum',
        scopedSlots: true,
        search: {
            type: 'string',
            // options: [
            //     {
            //         label: '内燃柴油机',
            //         value: 'ICDieselEngine',
            //     },
            //     {
            //         label: '内燃汽油机',
            //         value: 'ICGasolineEngine',
            //     },
            //     {
            //         label: '机械柴油机',
            //         value: 'MachineDieselEngine',
            //     },
            //     {
            //         label: '内燃牵引车',
            //         value: 'ICTractor',
            //     },
            // ],
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
        title: '报警类型',
        dataIndex: 'reportType',
        key: 'reportType',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '报警信息',
        dataIndex: 'reportInfo',
        key: 'reportInfo',
        scopedSlots: true,
    },

    {
        title: '型号',
        dataIndex: 'modelNumber',
        key: 'modelNumber',
        scopedSlots: true,
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
        title: '告警时间 ',
        dataIndex: 'reportTime',
        key: 'reportTime',
        width: 180,
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '报警附件',
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
    },
];

const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
        console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows,
        );
        selectIds.value = selectedRowKeys;
    },
    onSelect: (record: any, selected: boolean, selectedRows: any) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {
        console.log(selected, selectedRows, changeRows);
    },
};

/**
 * 搜索
 * @param param
 */
const handleSearch = (param: any) => {
    params.value = param;
};
</script>

<style lang="less" scoped></style>
