<!-- 国标级联-通道列表 -->
<template>
    <page-container>
        <pro-search :columns="columns" target="media" @search="handleSearch" />
        <FullPage>
            <JProTable
                ref="listRef"
                model="table"
                :columns="columns"
                :request="
                    (e) => CascadeApi.queryBindChannel(route?.query.id, e)
                "
                :defaultParams="{
                    sorts: [{ name: 'name', order: 'desc' }],
                }"
                :params="params"
                :rowSelection="{
                    selectedRowKeys: _selectedRowKeys,
                    onSelect: onSelectChange,
                    onSelectAll: selectAll,
                    onSelectNone: cancelSelectAll,
                }"
            >
                <template #headerTitle>
                    <h3>通道列表</h3>
                </template>
                <template #rightExtraRender>
                    <j-space>
                        <j-button type="primary" @click="bindVis = true">
                            绑定通道
                        </j-button>
                        <PermissionButton
                            type="primary"
                            :popConfirm="{
                                title: '确认解绑？',
                                onConfirm: handleMultipleUnbind,
                            }"
                            >批量解绑</PermissionButton
                        >
                    </j-space>
                </template>
                <template #gbChannelIdHeader="title">
                    <j-tooltip
                        title="国标级联有16位、20位两种格式。在当前页面修改不会修改视频设备-通道页面中的国标ID"
                    >
                        <j-space>
                            <span>{{ title }}</span>
                            <AIcon type="InfoCircleOutlined" />
                        </j-space>
                    </j-tooltip>
                </template>
                <template #gbChannelId="slotProps">
                    <div style="display: flex; align-items: center">
                        <Ellipsis style="width: 150px">
                            {{ slotProps.gbChannelId }}
                        </Ellipsis>
                        <j-popover
                            v-model:visible="slotProps.popVis"
                            trigger="click"
                        >
                            <template #title>
                                <div class="header">
                                    <span>编辑国标ID</span>
                                    <AIcon
                                        type="CloseOutlined"
                                        @click="handleClose(slotProps)"
                                    />
                                </div>
                            </template>
                            <template #content>
                                <div class="simple-form">
                                    <j-input
                                        v-model:value="gbID"
                                        @change="validField(slotProps)"
                                        placeholder="请输入国标ID"
                                    />
                                    <div
                                        class="error"
                                        v-if="valid && !valid?.passed"
                                    >
                                        <!-- {{ valid?.reason }} -->
                                        该国标ID在同一设备下已存在
                                    </div>
                                </div>
                                <j-button
                                    type="primary"
                                    @click="handleSave(slotProps)"
                                    :loading="loading"
                                    style="width: 100%"
                                >
                                    保存
                                </j-button>
                            </template>
                            <j-button
                                type="link"
                                @click="slotProps.popVis = true"
                            >
                                <AIcon type="EditOutlined" />
                            </j-button>
                        </j-popover>
                    </div>
                </template>
                <template #status="slotProps">
                    <j-space>
                        <j-badge
                            :status="
                                slotProps.status.value === 'online'
                                    ? 'success'
                                    : 'error'
                            "
                            :text="slotProps.status.text"
                        ></j-badge>
                    </j-space>
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
                                style="padding: 0 5px"
                            >
                                <template #icon
                                    ><AIcon :type="i.icon"
                                /></template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
            </JProTable>
        </FullPage>

        <BindChannel v-model:visible="bindVis" @submit="listRef.reload()" />
    </page-container>
</template>

<script setup lang="ts">
import CascadeApi from '@/api/media/cascade';
import { onlyMessage } from '@/utils/comm';
import type { ActionsType } from '@/views/device/Instance/typings';
import BindChannel from './BindChannel/index.vue';

const route = useRoute();

const columns = [
    {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        // width: 200,
        // fixed: 'left',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '通道名称',
        dataIndex: 'name',
        ellipsis: true,
        key: 'name',
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: '国标ID',
        dataIndex: 'gbChannelId',
        key: 'gbChannelId',
        scopedSlots: true,
        width: 200,
        headerCell: 'gbChannelIdHeader', // 表头单元格插槽
        search: {
            type: 'string',
        },
    },
    {
        title: '安装地址',
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '厂商',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '在线状态',
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
        width: 150,
        search: {
            type: 'select',
            options: [
                { label: '已连接', value: 'online' },
                { label: '未连接', value: 'offline' },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: '操作',
        key: 'action',
        width: 100,
        scopedSlots: true,
    },
];

const params = ref<Record<string, any>>({});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    if (e.terms[0]?.terms[0]?.column === 'gbChannelId') {
        params.value = {
            terms: [
                {
                    column: 'id$gb28181-cascade-channel',
                    value: [
                        {
                            column: 'gb_channel_id',
                            termType: e.terms[0]?.terms[0]?.termType,
                            value: e.terms[0]?.terms[0]?.value,
                        },
                    ],
                },
                {
                    terms: [
                        {
                            column: 'id$gb28181-cascade-channel',
                            value: [
                                {
                                    column: 'gb_channel_id',
                                    termType: 'isnull',
                                    value: '1',
                                },
                            ],
                        },
                        {
                            column: 'channelId',
                            termType: e.terms[0]?.terms[0]?.termType,
                            value: e.terms[0]?.terms[0]?.value,
                        },
                    ],
                    type: 'or',
                },
            ],
        };
    } else {
        params.value = e;
    }
};

const listRef = ref();
const _selectedRowKeys = ref<string[]>([]);
const bindVis = ref(false);

const channelIdMap = new Map();
const onSelectChange = (row: any, selected: Boolean) => {
    const arr = new Set(_selectedRowKeys.value);
    if (selected) {
        arr.add(row.id);
        channelIdMap.set(row.id, row.channelId);
    } else {
        arr.delete(row.id);
        channelIdMap.delete(row.id);
    }
    _selectedRowKeys.value = [...arr.values()];
};
const selectAll = (selected: Boolean, selectedRows: any, changeRows: any) => {
    if (selected) {
        changeRows.map((i: any) => {
            if (!_selectedRowKeys.value.includes(i.id)) {
                _selectedRowKeys.value.push(i.id);
                channelIdMap.set(i.id, i.channelId);
            }
        });
    } else {
        const arr = changeRows.map((item: any) => item.id);
        const _ids: string[] = [];
        _selectedRowKeys.value.map((i: any) => {
            if (!arr.includes(i)) {
                _ids.push(i);
            } else {
                channelIdMap.delete(i);
            }
        });
        _selectedRowKeys.value = _ids;
    }
};

const cancelSelectAll = () => {
    _selectedRowKeys.value = [];
    channelIdMap.clear();
};
/**
 * 表格操作按钮
 * @param data 表格数据项
 * @param type 表格展示类型
 */
const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'delete',
            text: '解绑',
            tooltip: {
                title: '解绑',
            },
            icon: 'DisconnectOutlined',
            popConfirm: {
                title: '确认解绑?',
                onConfirm: () => {
                    const response = CascadeApi.unbindChannel(
                        route.query.id as string,
                        [data.channelId],
                    );
                    response.then((resp) => {
                        if (resp.success) {
                            onlyMessage('操作成功！');
                            listRef.value?.reload();
                        } else {
                            onlyMessage('操作失败！', 'error');
                        }
                    });
                    return response
                },
            },
        },
    ];
    return actions;
};

/**
 * 批量解绑
 */
const handleMultipleUnbind = async () => {
    if (!_selectedRowKeys.value.length) {
        onlyMessage('请先选择需要解绑的通道列表', 'error');
        return;
    }
    const resp = await CascadeApi.unbindChannel(route.query.id as string, [
        ...channelIdMap.values(),
    ]);
    if (resp.success) {
        onlyMessage('操作成功！');
        _selectedRowKeys.value = [];
        channelIdMap.clear();
        listRef.value?.reload();
    } else {
        onlyMessage('操作失败！', 'error');
    }
};

/**
 * 编辑国标ID
 */
const gbID = ref('');
const loading = ref(false);
const handleSave = async (data: any) => {
    if (!gbID.value) onlyMessage('请输入国标ID', 'error');
    if (!valid.value?.passed) return;

    loading.value = true;
    const resp = await CascadeApi.updateGbChannelId(data.id, {
        gbChannelId: gbID.value,
    });
    loading.value = false;
    if (resp.success) {
        onlyMessage('操作成功！');
        listRef.value?.reload();
        valid.value = undefined;
        gbID.value = '';
    } else {
        onlyMessage('操作失败！', 'error');
    }
};

/**
 * 验证ID是否存在
 */
const valid = ref<{ passed: string; reason: string }>();
const validField = async (data: any) => {
    const { result } = await CascadeApi.validateField(data.cascadeId, [
        gbID.value,
    ]);
    valid.value = result;
};

/**
 * 取消
 */
const handleClose = (data: any) => {
    data.popVis = false;
    valid.value = undefined;
    gbID.value = '';
};
</script>
<style lang="less" scoped>
.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.simple-form {
    margin-bottom: 10px;
    .error {
        color: red;
    }
}
</style>
