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
                :request="handleQuery"
                model="table"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
                :gridColumn="3"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            :popConfirm="{
                                title: `确认导出？`,
                                onConfirm: () => handleExport(),
                            }"
                        >
                            <template #icon>
                                <ExportOutlined />
                            </template>
                            导出
                        </PermissionButton>
                    </j-space>
                </template>
                <template #cardType="{ cardType }">
                    {{ handleCardType(cardType) }}
                </template>
                <!-- 激活日期插槽 -->
                <template #activationDate="{ activationDate }">
                    {{ dayjs(activationDate).format('YYYY-MM-DD') }}
                </template>
                <!-- 更新时间插槽 -->
                <template #updateTime="{ updateTime }">
                    {{ dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss') }}
                </template>
                <template #cardStateType="{ cardStateType }">
                    <state-tag
                        :text="cardStateType.label"
                        :type="handleTagType(cardStateType.value)"
                    />
                </template>
            </JProTable>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import { querySim } from '@/api/data-report/sim';
import { downloadObject } from '@/utils/utils';
import { handleQuery } from './data';
import StateTag from '@/views/data-report/SimCenter/components/StateTag.vue';
import dayjs from 'dayjs';

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
        dataIndex: 'cardId',
        key: 'cardId',
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
                    label: 'OneLinkPB',
                    value: 'OneLinkPB',
                },
                {
                    label: 'OneLinkCT',
                    value: 'OneLinkCT',
                },
                {
                    label: 'CtwingCmp',
                    value: 'CtwingCmp',
                },
                {
                    label: 'UnicomCmp',
                    value: 'UnicomCmp',
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
                    value: 'year',
                },
                {
                    label: '季卡',
                    value: 'season',
                },
                {
                    label: '月卡',
                    value: 'month',
                },
                {
                    label: '其他',
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
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },

    {
        title: '状态',
        dataIndex: 'cardStateType',
        key: 'cardStateType',
        scopedSlots: true,

        search: {
            type: 'select',
            options: [
                {
                    label: '未激活',
                    value: 'notReady',
                },
                {
                    label: '停机',
                    value: 'error',
                },
                {
                    label: '激活',
                    value: 'success',
                },
                {
                    label: '其他',
                    value: 'processing',
                },
            ],
        },
    },
];

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

const handleTagType = (value: string) => {
    switch (value) {
        case 'notReady':
            return 'warning';
        case 'error':
            return 'error';
        case 'using':
            return 'success';
        case 'activated':
            return 'success';
        case 'other':
            return 'error';
    }
};
/**
 * 导出
 */
const handleExport = () => {
    downloadObject(configRef.value.selectedKeys, `sim卡中心数据`);
};
</script>

<style lang="less" scoped></style>
