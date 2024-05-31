<template>
    <div>
        <pro-search
            :columns="columns"
            target="overload-target"
            @search="handleSearch"
        ></pro-search>
        <full-page>
            <JProTable
                ref="configRef"
                :columns="columns"
                :request="queryOverLoad"
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
                <template #duration="{ duration }">
                    {{ formatMillisecondsToHourMinute(duration) }}
                </template>
                <template #overLoadInfoLoadRating="{ overLoadInfoLoadRating }">
                    {{ `${overLoadInfoLoadRating}t` }}
                </template>
                <template
                    #overLoadInfoOverloadValue="{ overLoadInfoOverloadValue }"
                >
                    {{ `${overLoadInfoOverloadValue}t` }}
                </template>
            </JProTable>
        </full-page>
    </div>
</template>

<script setup lang="ts">
import { onlyMessage } from '@/utils/comm';
import { downloadFileByUrl } from '@/utils/utils';
import {
    queryOverLoad,
    overLoadExport,
} from '@/api/data-report/IrregularDriving';
import moment from 'moment';

const configRef = ref<Record<string, any>>({});
const selectIds = ref<Array<number | string>>([]);
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
    overLoadExport(type.value, _params).then((res: any) => {
        if (res) {
            const blob = new Blob([res.data], { type: type.value });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(
                url,
                `超载异常数据-${moment(new Date()).format(
                    'YYYY/MM/DD HH:mm:ss',
                )}`,
                type.value,
            );
        }
    });
};

const formatMillisecondsToHourMinute = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    if (
        typeof milliseconds === 'number' &&
        isFinite(milliseconds) &&
        milliseconds > 0
    ) {
        return hours > 0
            ? `${
                  hours > 10
                      ? hours.toString().padStart(2, '0')
                      : hours.toString().padStart(1, '0')
              }小时${
                  minutes > 9
                      ? minutes.toString().padStart(2, '0')
                      : minutes.toString().padStart(1, '0')
              }分`
            : `${
                  minutes > 9
                      ? minutes.toString().padStart(2, '0')
                      : minutes.toString().padStart(1, '0')
              }分`;
    } else {
        return '0分';
    }
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
        title: '载荷',
        dataIndex: 'overLoadInfoLoadRating',
        key: 'overLoadInfoLoadRating',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '当前实际吊重',
        dataIndex: 'overLoadInfoOverloadValue',
        key: 'overLoadInfoOverloadValue',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '持续时间',
        dataIndex: 'duration',
        key: 'duration',
        ellipsis: true,
        scopedSlots: true,
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
 * @param param
 */
const handleSearch = (param: any) => {
    console.log(param, 'param');
    params.value = param;
};
</script>

<style lang="less" scoped></style>
