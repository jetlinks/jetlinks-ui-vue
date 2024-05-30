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
                <template #operatorName="{ operatorName }">
                    {{ handleOperatorName(operatorName) }}
                </template>
                <template #cardType="{ cardType }">
                    {{ cardType ? handleCardType(cardType.value) : ' ' }}
                </template>
                <template #deviceId="{ deviceId }">
                    {{ deviceId || '' }}
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
                <!-- 激活日期插槽 -->
                <template #activationDate="{ activationDate }">
                    {{
                        activationDate
                            ? dayjs(activationDate).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : '暂未激活'
                    }}
                </template>
                <!-- 更新时间插槽 -->
                <template #updateTime="{ updateTime }">
                    {{
                        updateTime
                            ? dayjs(updateTime).format('YYYY-MM-DD HH:mm:ss')
                            : '无更新信息'
                    }}
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
import { querySim, simDataExport } from '@/api/data-report/sim';
import { downloadFileByUrl } from '@/utils/utils';
import StateTag from '@/views/data-report/SimCenter/components/StateTag.vue';
import dayjs from 'dayjs';
import { _export } from '@/api/data-report/alarmSheet';
import moment from 'moment';
import { onlyMessage } from '@/utils/comm';
import { faultDataExport } from '@/api/data-report/faultSheet';

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const queryData = (_params: any) => {
    return querySim({
        ..._params,
        // sorts: [{ name: 'updateTime', order: 'desc' }],
    });
};

/**
 * 搜索
 * @param param
 */
const handleSearch = (param: any) => {
    params.value = param;
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
        dataIndex: 'deviceId',
        key: 'deviceId',
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
                    value: 'OneLink',
                },
                {
                    label: '电信',
                    value: 'CtwingCmp',
                },
                {
                    label: '联通',
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
        width: 180,
        search: {
            type: 'string',
        },
    },
    {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
        scopedSlots: true,
        width: 180,
        search: {
            type: 'string',
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
        case 'notReady':
            return 'error';
        case 'using':
            return 'success';
        case 'activated':
        case 'deactivate':
            return 'default';
        case 'other':
            return 'processing';
    }
};

/**
 * @function handleOperatorName 处理运营商
 * @param value
 */
const handleOperatorName = (value: string) => {
    value = value.toLocaleLowerCase();
    switch (value) {
        case 'onelink':
            return '移动';
        case 'ctwing':
            return '电信';
        case 'unicom':
            return '联通';
    }
};

/**
 * @function formatFlow 格式化流量
 * @param flow
 */
const formatFlow = (flow: number | undefined) => {
    if (flow === undefined || flow === 0) {
        return '0M';
    } else if (flow >= 1024 || flow <= -1024) {
        return `${(flow / 1024).toFixed(2)}G`;
    } else if ((flow > 0 && flow < 1) || (flow < 0 && flow > -1)) {
        return `${flow.toFixed(2)}M`;
    } else {
        return `${flow.toFixed(2)}M`;
    }
};

// 选中的数据的id
const selectIds = ref<Array<number | string>>([]);
const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
        selectIds.value = selectedRowKeys;
    },
    onSelect: (record: any, selected: boolean, selectedRows: any) => {},
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {},
};

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
    simDataExport(type.value, _params).then((res: any) => {
        if (res) {
            const blob = new Blob([res.data], { type: type.value });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(
                url,
                `sim卡数据-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
                type.value,
            );
        }
    });
};
</script>

<style lang="less" scoped></style>
