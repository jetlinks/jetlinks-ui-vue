<template>
    <div>
        <pro-search
            :columns="columns"
            target="abnormal-config"
            @search="handleSearch"
        ></pro-search>
        <full-page>
            <JProTable
                ref="configRef"
                :columns="columns"
                :request="queryAbnormal"
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

                <template #collisionAngle="{ collisionAngle }">
                    {{ `${collisionAngle}&deg;` }}
                </template>
                <template #collisionThreshold="{ collisionThreshold }">
                    {{ `${collisionThreshold}G` }}
                </template>
                <template #collisionActual="{ collisionActual }">
                    {{ `${collisionActual}G` }}
                </template>
            </JProTable>
        </full-page>
    </div>
</template>

<script setup lang="ts">
import { onlyMessage } from '@/utils/comm';
import { downloadFileByUrl } from '@/utils/utils';
import {
    queryAbnormal,
    abnormalExport,
} from '@/api/data-report/IrregularDriving';
import moment from 'moment';

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
    abnormalExport(type.value, _params).then((res: any) => {
        if (res) {
            const blob = new Blob([res.data], { type: type.value });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(
                url,
                `震动异常数据-${moment(new Date()).format(
                    'YYYY/MM/DD HH:mm:ss',
                )}`,
                type.value,
            );
        }
    });
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
        title: '等级',
        dataIndex: 'collisionLevel',
        key: 'collisionLevel',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '碰撞阈值',
        dataIndex: 'collisionThreshold',
        key: 'collisionThreshold',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '碰撞实际值',
        dataIndex: 'collisionActual',
        key: 'collisionActual',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '碰撞角度 ',
        dataIndex: 'collisionAngle',
        key: 'collisionAngle',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
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
 * @param params
 */
const handleSearch = (param: any) => {
    params.value = param;
};

// const request = (params: Record<string, any>) =>
//     new Promise((resolve) => {
//         console.log('params',params)
//         queryAbnormal({
//             firstPageIndex: params.pageIndex,
//             pageIndex: params.pageIndex,
//             pageSize: params.pageSize,
//             sorts: params.sorts,
//             terms: params.terms,
//         })
//             .then((response: any) => {
//                 console.log(response, 'response');
//                 resolve({
//                     result: {
//                         data: response.result?.data,
//                         pageIndex: params.pageIndex || 0,
//                         pageSize: params.pageSize || 20,
//                         total: response.result?.total,
//                     },
//                     status: response.status,
//                 });
//             })
//             .catch((error: any) => {
//                 console.log(error);
//             });
//     });
</script>

<style lang="less " scoped></style>
