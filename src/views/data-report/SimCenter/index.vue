<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="notice-config"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="configRef"
                :columns="columns"
                :request="querySim"
                model="table"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
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
                <template #totalFlow="{ totalFlow }">
                    {{ formatFlow(totalFlow) }}
                </template>
                <template #usedFlow="{ usedFlow }">
                    {{ formatFlow(usedFlow) }}
                </template>
                <template #residualFlow="{ residualFlow }">
                    {{ formatFlow(residualFlow) }}
                </template>
                <template #cardType="{ cardType }">
                    {{ handleCardType(cardType.value) }}
                </template>
                <!-- 激活日期插槽 -->
                <template #activationDate="{ activationDate }">
                    {{ dayjs(activationDate).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <!-- 更新时间插槽 -->
                <template #updateTime="{ updateTime }">
                    {{ dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template #cardStateType="{ cardStateType }">
                    <state-tag
                        :text="cardStateType.text"
                        :type="handleTagType(cardStateType.value)"
                    />
                </template>
            </JProTable>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import { querySim } from '@/api/data-report/sim';
import { downloadFileByUrl, downloadObject } from '@/utils/utils';
import StateTag from '@/views/data-report/SimCenter/components/StateTag.vue';
import dayjs from 'dayjs';
import { onlyMessage } from '@/utils/comm';
import { _export } from '@/api/data-report/alarmSheet';
import moment from 'moment';

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};

const columns = [
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
        dataIndex: 'productId',
        key: 'productId',
        ellipsis: true,
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
            type: 'string',
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
                    text: '年卡',
                    value: 'year',
                },
                {
                    text: '季卡',
                    value: 'season',
                },
                {
                    text: '月卡',
                    value: 'month',
                },
                {
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
        search: {
            type: 'string',
        },
    },
    {
        title: '使用流量',
        dataIndex: 'usedFlow',
        key: 'usedFlow',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '剩余流量',
        dataIndex: 'residualFlow',
        key: 'residualFlow',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '激活日期',
        dataIndex: 'activationDate',
        key: 'activationDate',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },

    {
        title: '状态',
        dataIndex: 'cardState',
        key: 'cardStateType',
        scopedSlots: true,

        search: {
            type: 'select',
            options: [
                {
                    text: '待激活',
                    value: 'toBeActivated',
                },
                {
                    text: '停机',
                    value: 'deactivate',
                },
                {
                    text: '激活',
                    value: 'using',
                },
                {
                    text: '其他',
                    value: 'other',
                },
                {
                    text: '错误',
                    value: 'error',
                },
            ],
        },
    },
];

/**
 * @function handleCardType 处理卡类型
 * @param value
 */
const handleCardType = (value: string) => {
    switch (value) {
        case 'year':
            return '年卡';
        case 'season':
            return '季卡';
        case 'month':
            return '月卡';
        case 'other':
            return '其他';
    }
};

/**
 * @function handleTagType 处理tag类型
 * @param value
 */
const handleTagType = (value: string) => {
    switch (value) {
        case 'toBeActivated':
            return 'warning';
        case 'error':
        case 'deactivate':
            return 'error';
        case 'using':
            return 'success';
        case 'activated':
            return 'default';
        case 'other':
            return 'processing';
    }
};

/**
 * @function formatFlow 格式化流量
 * @param flow
 */
const formatFlow = (flow: number) => {
    if (flow >= 1024) {
        return `${(flow / 1024).toFixed(2)}MB`;
    } else if (flow >= 1048_576) {
        return `${(flow / 1048_576).toFixed(2)}GB`;
    } else {
        return `${flow}KB`;
    }
};

/**
 * 导出
 */
const type = ref<string>('xlsx');

const handleExport = async (_params: any) => {
    const data = { ..._params };
    _export(type.value, data).then((res: any) => {
        if (res) {
            const blob = new Blob([res.data], { type: type.value });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(
                url,
                `车辆告警数据-${moment(new Date()).format(
                    'YYYY/MM/DD HH:mm:ss',
                )}`,
                type.value,
            );
        }
    });
};

/**
 * 选中行
 */
const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {},
    onSelect: (record: any, selected: boolean, selectedRows: any) => {},
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {},
};
</script>

<style lang="less" scoped></style>
