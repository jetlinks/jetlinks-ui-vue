<!-- 物联卡管理 -->
<template>
    <div class="page-container">
        <Search
            :columns="columns"
            target="iot-card-management-search"
            @search="handleSearch"
        />
        <JTable
            ref="cardManageRef"
            :columns="columns"
            :request="query"
            :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onChange: onSelectChange,
            }"
            @cancelSelect="cancelSelect"
            :params="params"
        >
            <template #headerTitle>
                <a-space>
                    <a-button type="primary" @click="handleAdd">
                        <AIcon type="PlusOutlined" />新增
                    </a-button>
                    <a-dropdown>
                        <a-button>
                            批量操作
                            <AIcon type="DownOutlined" />
                        </a-button>
                        <template #overlay>
                            <a-menu>
                                <a-menu-item>
                                    <a-button @click="exportVisible = true">
                                        <AIcon type="ExportOutlined" />
                                        批量导出
                                    </a-button>
                                </a-menu-item>
                                <a-menu-item>
                                    <a-button @click="importVisible = true"
                                        ><AIcon
                                            type="ImportOutlined"
                                        />批量导入</a-button
                                    >
                                </a-menu-item>
                                <a-menu-item>
                                    <a-popconfirm
                                        @confirm="handleActive"
                                        title="确认激活吗？"
                                    >
                                        <a-button>
                                            <AIcon type="CheckCircleOutlined" />
                                            批量激活
                                        </a-button>
                                    </a-popconfirm>
                                </a-menu-item>
                                <a-menu-item>
                                    <a-popconfirm
                                        @confirm="handleStop"
                                        title="确认停用吗？"
                                    >
                                        <a-button type="primary" ghost>
                                            <AIcon type="StopOutlined" />
                                            批量停用
                                        </a-button>
                                    </a-popconfirm>
                                </a-menu-item>
                                <a-menu-item>
                                    <a-popconfirm
                                        @confirm="handleResumption"
                                        title="确认复机吗？"
                                    >
                                        <a-button type="primary" ghost>
                                            <AIcon type="PoweroffOutlined" />
                                            批量复机
                                        </a-button>
                                    </a-popconfirm>
                                </a-menu-item>
                                <a-menu-item>
                                    <a-popconfirm
                                        @confirm="handleSync"
                                        title="确认同步状态吗？"
                                    >
                                        <a-button type="primary" ghost>
                                            <AIcon type="SwapOutlined" />
                                            同步状态
                                        </a-button>
                                    </a-popconfirm>
                                </a-menu-item>
                                <a-menu-item v-if="_selectedRowKeys.length > 0">
                                    <a-popconfirm
                                        @confirm="handelRemove"
                                        title="确认删除吗？"
                                    >
                                        <a-button>
                                            <AIcon type="DeleteOutlined" />
                                            批量删除
                                        </a-button>
                                    </a-popconfirm>
                                </a-menu-item>
                            </a-menu>
                        </template>
                    </a-dropdown>
                </a-space>
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
            <template #cardType="slotProps">
                {{ slotProps.cardType.text }}
            </template>
            <template #cardStateType="slotProps">
                {{ slotProps.cardStateType.text }}
            </template>
            <template #activationDate="slotProps">
                {{
                    slotProps.activationDate
                        ? moment(slotProps.activationDate).format(
                              'YYYY-MM-DD HH:mm:ss',
                          )
                        : ''
                }}
            </template>
            <template #updateTime="slotProps">
                {{
                    slotProps.updateTime
                        ? moment(slotProps.updateTime).format(
                              'YYYY-MM-DD HH:mm:ss',
                          )
                        : ''
                }}
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <a-tooltip
                        v-for="i in getActions(slotProps)"
                        :key="i.key"
                        v-bind="i.tooltip"
                    >
                        <a-popconfirm v-if="i.popConfirm" v-bind="i.popConfirm">
                            <a-button
                                :disabled="i.disabled"
                                style="padding: 0"
                                type="link"
                                ><AIcon :type="i.icon"
                            /></a-button>
                        </a-popconfirm>
                        <a-button
                            style="padding: 0"
                            type="link"
                            v-else
                            @click="i.onClick && i.onClick(slotProps)"
                        >
                            <a-button
                                :disabled="i.disabled"
                                style="padding: 0"
                                type="link"
                                ><AIcon :type="i.icon"
                            /></a-button>
                        </a-button>
                    </a-tooltip>
                </a-space>
            </template>
        </JTable>
    </div>
</template>

<script setup lang="ts">
import type { ActionsType } from '@/components/Table';
import moment from 'moment';
import {
    query,
    queryPlatformNoPage,
    changeDeploy,
    unDeploy,
    resumption,
    del,
    changeDeployBatch,
    unDeployBatch,
    resumptionBatch,
    sync,
    removeCards,
} from '@/api/iot-card/cardManagement';
import { message } from 'ant-design-vue';

const cardManageRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const _selectedRowKeys = ref<string[]>([]);
const _selectedRow = ref<any[]>([]);
const visible = ref<boolean>(false);
const exportVisible = ref<boolean>(false);
const importVisible = ref<boolean>(false);

const columns = [
    {
        title: '卡号',
        dataIndex: 'id',
        key: 'id',
        width: 300,
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
        },
    },
    {
        title: '绑定设备',
        dataIndex: 'deviceName',
        key: 'deviceName',
        ellipsis: true,
        width: 200,
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
            options: [
                { label: '移动', value: '移动' },
                { label: '电信', value: '电信' },
                { label: '联通', value: '联通' },
            ],
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
        search: {
            type: 'select',
            options: [
                { label: '正常', value: 'using' },
                { label: '未激活', value: 'toBeActivated' },
                { label: '停机', value: 'deactivate' },
            ],
        },
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
    },
];

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) return [];
    return [
        {
            key: 'edit',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
        },
        {
            key: 'view',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
        },
        {
            key: 'bindDevice',
            text: data.deviceId ? '解绑设备' : '绑定设备',
            tooltip: {
                title: data.deviceId ? '解绑设备' : '绑定设备',
            },
            icon: data.deviceId ? 'DisconnectOutlined' : 'LinkOutlined',
        },
        {
            key: 'activation',
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
                onConfirm: async () => {
                    if (data.cardStateType?.value === 'toBeActivated') {
                        changeDeploy(data.id).then((resp) => {
                            if (resp.status === 200) {
                                message.success('操作成功');
                                cardManageRef.value?.reload();
                            }
                        });
                    } else if (data.cardStateType?.value === 'deactivate') {
                        resumption(data.id).then((resp) => {
                            if (resp.status === 200) {
                                message.success('操作成功');
                                cardManageRef.value?.reload();
                            }
                        });
                    } else {
                        unDeploy(data.id).then((resp) => {
                            if (resp.status === 200) {
                                message.success('操作成功');
                                cardManageRef.value?.reload();
                            }
                        });
                    }
                },
            },
        },
        {
            key: 'delete',
            text: '删除',
            tooltip: {
                title: '删除',
            },
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    const resp: any = await del(data.id);
                    if (resp.status === 200) {
                        message.success('操作成功！');
                        cardManageRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
};

const handleSearch = (params: any) => {
    console.log(params);
    params.value = params;
};

const onSelectChange = (keys: string[], rows: []) => {
    _selectedRowKeys.value = [...keys];
    _selectedRow.value = [...rows];
};

const cancelSelect = () => {
    _selectedRowKeys.value = [];
};

/**
 * 新增
 */
const handleAdd = () => {};

/**
 * 批量激活
 */
const handleActive = () => {
    if (
        _selectedRowKeys.value.length >= 10 &&
        _selectedRowKeys.value.length <= 100
    ) {
        changeDeployBatch(_selectedRowKeys.value).then((res: any) => {
            if (res.status === 200) {
                message.success('操作成功');
            }
        });
    } else {
        message.warn('仅支持同一个运营商下且最少10条数据,最多100条数据');
    }
};

/**
 * 批量停用
 */
const handleStop = () => {
    if (
        _selectedRowKeys.value.length >= 10 &&
        _selectedRowKeys.value.length <= 100
    ) {
        unDeployBatch(_selectedRowKeys.value).then((res: any) => {
            if (res.status === 200) {
                message.success('操作成功');
            }
        });
    } else {
        message.warn('仅支持同一个运营商下且最少10条数据,最多100条数据');
    }
};

/**
 * 批量复机
 */
const handleResumption = () => {
    if (
        _selectedRowKeys.value.length >= 10 &&
        _selectedRowKeys.value.length <= 100
    ) {
        resumptionBatch(_selectedRowKeys.value).then((res: any) => {
            if (res.status === 200) {
                message.success('操作成功');
            }
        });
    } else {
        message.warn('仅支持同一个运营商下且最少10条数据,最多100条数据');
    }
};

/**
 * 同步状态
 */
const handleSync = () => {
    sync().then((res: any) => {
        if (res.status === 200) {
            cardManageRef.value?.reload();
            message.success('同步状态成功');
        }
    });
};

/**
 * 批量删除
 */
const handelRemove = async () => {
    const resp = await removeCards(_selectedRow.value);
    if (resp.status === 200) {
        message.success('操作成功！');
        _selectedRowKeys.value = [];
        _selectedRow.value = [];
        cardManageRef.value?.reload();
    }
};
</script>

<style scoped lang="less">
.search {
    width: calc(100% - 330px);
}
</style>
