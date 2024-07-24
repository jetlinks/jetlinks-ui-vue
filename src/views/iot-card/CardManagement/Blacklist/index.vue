<!-- 物联卡管理 -->
<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="iot-card-management-search"
            @search="handleSearch"
        />
        <FullPage>
            <j-pro-table
                :scroll="{ x: 1366 }"
                ref="cardManageRef"
                :columns="columns"
                :request="query"
                :model="'Table'"
                :defaultParams="defaultParams"
                :rowSelection="{
                    selectedRowKeys: _selectedRowKeys,
                    onChange: onSelectChange,
                }"
                :params="params"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            @click="funExport"
                            :hasPermission="'iot-card/CardManagement:export'"
                            type="primary"
                            >导出
                        </PermissionButton>
                        <PermissionButton
                            @click="handleResumption"
                            :hasPermission="'iot-card/CardManagement:action'"
                            >复机
                        </PermissionButton>
                    </j-space>
                </template>
                <template #deviceId="slotProps">
                    {{ slotProps.deviceName }}
                </template>
                <template #totalFlow="slotProps">
                    <div>
                        {{
                            slotProps.totalFlow
                                ? slotProps.totalFlow.toFixed(2) + ' M'
                                : ''
                        }}
                    </div>
                </template>
                <template #usedFlow="slotProps">
                    <div>
                        {{
                            slotProps.usedFlow
                                ? slotProps.usedFlow.toFixed(2) + ' M'
                                : ''
                        }}
                    </div>
                </template>
                <template #residualFlow="slotProps">
                    <div>
                        {{
                            slotProps.residualFlow
                                ? slotProps.residualFlow.toFixed(2) + ' M'
                                : ''
                        }}
                    </div>
                </template>
                <template #operatorName="slotProps">
                    {{ OperatorMap[slotProps.operatorName] }}
                </template>
                <template #cardType="slotProps">
                    {{ slotProps.cardType.text }}
                </template>
                <template #cardStateType="slotProps">
                    <BadgeStatus
                        :status="slotProps.cardStateType?.value"
                        :text="slotProps.cardStateType?.text"
                        :statusNames="{
                            using: 'processing',
                            toBeActivated: 'default',
                            deactivate: 'error',
                        }"
                    />
                </template>
                <template #activationDate="slotProps">
                    {{
                        slotProps.activationDate
                            ? dayjs(slotProps.activationDate).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : ''
                    }}
                </template>
                <template #updateTime="slotProps">
                    {{
                        slotProps.updateTime
                            ? dayjs(slotProps.updateTime).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : ''
                    }}
                </template>
                <template #action="slotProps">
                    <j-space :size="16">
                        <template
                            v-for="i in getActions(slotProps, 'table')"
                            :key="i.key"
                        >
                            <PermissionButton
                                :disabled="i.disabled"
                                :popConfirm="i.popConfirm"
                                :tooltip="{
                                    ...i.tooltip,
                                }"
                                @click="i.onClick"
                                type="link"
                                style="padding: 0px"
                                :hasPermission="
                                    i.key === 'view'
                                        ? true
                                        : 'iot-card/CardManagement:' + i.key
                                "
                                :danger="i.key === 'delete'"
                            >
                                {{ i.text }}
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
            </j-pro-table>
        </FullPage>
        <!-- 批量导出 -->
        <Export
            v-if="exportVisible"
            @close="exportVisible = false"
            :data="_selectedRowKeys"
        />
    </page-container>
</template>

<script setup lang="ts">
import type { ActionsType } from '@/components/Table';
import dayjs from 'dayjs';
import {
    query,
    queryPlatformNoPage,
    changeDeploy,
    unDeploy,
    resumption,
    exportIOTBlack,
    exportIOTWhite,
} from '@/api/iot-card/cardManagement';
import { getImage, onlyMessage } from '@/utils/comm';
import Export from '../Export.vue';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import { OperatorMap } from '@/views/iot-card/data';

const cardManageRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const _selectedRowKeys = ref<string[]>([]);
const exportVisible = ref<boolean>(false);
const defaultParams = {
    sorts: [{ name: 'createTime', order: 'desc' }],
    terms: [
        {
            terms: [
                {
                    type: 'or',
                    value: 'deactivate',
                    termType: 'eq',
                    column: 'cardStateType',
                },
            ],
        },
    ],
};

const columns = [
    {
        title: '卡号',
        dataIndex: 'id',
        key: 'id',
        width: 200,
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: 'ICCID',
        dataIndex: 'iccId',
        key: 'iccId',
        ellipsis: true,
        width: 200,
        search: {
            type: 'string',
            termOptions: ['eq'],
        },
    },
    {
        title: '绑定设备',
        dataIndex: 'deviceId',
        key: 'deviceId',
        ellipsis: true,
        scopedSlots: true,
        width: 200,
        search: {
            type: 'string',
            rename: 'deviceName',
        },
    },
    {
        title: '平台对接',
        dataIndex: 'platformConfigName',
        key: 'platformConfigName',
        width: 200,
        search: {
            rename: 'platformConfigId',
            type: 'select',
            options: async () => {
                return new Promise((resolve) => {
                    queryPlatformNoPage({
                        sorts: [{ name: 'createTime', order: 'desc' }],
                        terms: [{ column: 'state', value: 'enabled' }],
                    }).then((resp: any) => {
                        const list = resp.result.map((item: any) => ({
                            label: item.name,
                            value: item.id,
                        }));
                        resolve(list);
                    });
                });
            },
        },
    },
    {
        title: '运营商',
        dataIndex: 'operatorName',
        key: 'operatorName',
        width: 120,
        search: {
            type: 'select',
            options: async () => {
                return [
                    {
                        label: '移动',
                        value: '移动',
                    },
                    {
                        label: '电信',
                        value: '电信',
                    },
                    {
                        label: '联通',
                        value: '联通',
                    },
                ];
            },
        },
    },
    {
        title: '类型',
        dataIndex: 'cardType',
        key: 'cardType',
        scopedSlots: true,
        width: 120,
        search: {
            type: 'select',
            options: [
                { label: '年卡', value: 'year' },
                { label: '季卡', value: 'season' },
                { label: '月卡', value: 'month' },
                { label: '其他', value: 'other' },
            ],
        },
    },
    {
        title: '总流量',
        key: 'totalFlow',
        dataIndex: 'totalFlow',
        width: 120,
        scopedSlots: true,
    },
    {
        title: '使用流量',
        dataIndex: 'usedFlow',
        width: 120,
        scopedSlots: true,
    },
    {
        title: '剩余流量',
        dataIndex: 'residualFlow',
        width: 120,
        scopedSlots: true,
    },
    {
        title: '激活日期',
        dataIndex: 'activationDate',
        key: 'activationDate',
        scopedSlots: true,
        width: 200,
        search: {
            type: 'date',
        },
    },
    {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        scopedSlots: true,
        width: 200,
        search: {
            type: 'date',
        },
    },
    {
        title: '状态',
        dataIndex: 'cardStateType',
        key: 'cardStateType',
        width: 180,
        scopedSlots: true,
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 100,
        scopedSlots: true,
    },
];

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const arr = [
        {
            key:
                data.cardStateType?.value === 'toBeActivated'
                    ? 'active'
                    : 'action',
            text:
                data.cardStateType?.value === 'toBeActivated'
                    ? '激活'
                    : data.cardStateType?.value === 'deactivate'
                    ? '复机'
                    : '停用',
            tooltip: {
                title:
                    data.cardStateType?.value === 'toBeActivated'
                        ? '激活'
                        : data.cardStateType?.value === 'deactivate'
                        ? '复机'
                        : '停用',
            },
            icon:
                data.cardStateType?.value === 'toBeActivated'
                    ? 'CheckCircleOutlined'
                    : data.cardStateType?.value === 'deactivate'
                    ? 'PoweroffOutlined'
                    : 'StopOutlined',
            popConfirm: {
                title:
                    data.cardStateType?.value === 'toBeActivated'
                        ? '确认激活？'
                        : data.cardStateType?.value === 'deactivate'
                        ? '确认复机？'
                        : '确认停用?',
                okText: '确定',
                cancelText: '取消',
                onConfirm: async () => {
                    if (data.cardStateType?.value === 'toBeActivated') {
                        changeDeploy(data.id).then((resp) => {
                            if (resp.status === 200) {
                                onlyMessage('操作成功');
                                cardManageRef.value?.reload();
                            }
                        });
                    } else if (data.cardStateType?.value === 'deactivate') {
                        resumption(data.id).then((resp) => {
                            if (resp.status === 200) {
                                onlyMessage('操作成功');
                                cardManageRef.value?.reload();
                            }
                        });
                    } else {
                        unDeploy(data.id).then((resp) => {
                            if (resp.status === 200) {
                                onlyMessage('操作成功');
                                cardManageRef.value?.reload();
                            }
                        });
                    }
                },
            },
        },
    ];
    return arr;
};

const handleSearch = (e: any) => {
    params.value = { terms: e?.terms || [] };
};

const onSelectChange = (keys: string[], rows: []) => {
    _selectedRowKeys.value = [...keys];
    // _selectedRow.value = [...rows];
};

/**
 * 批量导出
 */
const funExport = () => {
    exportVisible.value = true;
};

// onMounted(() => {
// });
</script>

<style scoped lang="less">
.content-bottom {
    height: 38px;
}
.flow-text {
    font-size: 20px;
    font-weight: 600;
}

.progress-text {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

:deep(.ant-progress-inner) {
    border-radius: 0px;
}

:deep(.ant-progress-bg) {
    border-radius: 0px;
}
</style>
