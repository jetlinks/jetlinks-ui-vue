<!-- 国标级联-通道列表 -->
<template>
    <page-container>
        <pro-search :columns="columns" target="media" @search="handleSearch" />

        <JProTable
            ref="listRef"
            model="table"
            :columns="columns"
            :request="(e:any) => CascadeApi.queryBindChannel(route?.query.id as string, e)"
            :defaultParams="{
                pageSize: 10,
                sorts: [{ name: 'name', order: 'desc' }],
            }"
            :params="params"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onSelect: onSelectChange,
                onSelectAll: onSelectAllChange,
            }"
            @cancelSelect="_selectedRowKeys = []"
            :pagination="{
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50', '100'],
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
                    <j-popconfirm
                        title="确认解绑?"
                        @confirm="handleMultipleUnbind"
                    >
                        <j-button> 批量解绑 </j-button>
                    </j-popconfirm>
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
            <template #channelId="slotProps">
                <j-space>
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
                        <j-button type="link" @click="slotProps.popVis = true">
                            <AIcon type="EditOutlined" />
                        </j-button>
                    </j-popover>
                </j-space>
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
                    <j-tooltip
                        v-for="i in getActions(slotProps, 'table')"
                        :key="i.key"
                        v-bind="i.tooltip"
                    >
                        <j-popconfirm
                            v-if="i.popConfirm"
                            v-bind="i.popConfirm"
                            :disabled="i.disabled"
                        >
                            <j-button
                                :disabled="i.disabled"
                                style="padding: 0"
                                type="link"
                                ><AIcon :type="i.icon"
                            /></j-button>
                        </j-popconfirm>
                        <j-button
                            style="padding: 0"
                            type="link"
                            v-else
                            @click="i.onClick && i.onClick(slotProps)"
                        >
                            <j-button
                                :disabled="i.disabled"
                                style="padding: 0"
                                type="link"
                                ><AIcon :type="i.icon"
                            /></j-button>
                        </j-button>
                    </j-tooltip>
                </j-space>
            </template>
        </JProTable>

        <BindChannel v-model:visible="bindVis" @submit="listRef.reload()" />
    </page-container>
</template>

<script setup lang="ts">
import CascadeApi from '@/api/media/cascade';
import type { ActionsType } from '@/components/Table/index.vue';
import { message } from 'ant-design-vue';
import BindChannel from './BindChannel/index.vue';

const route = useRoute();

const columns = [
    {
        title: '设备名称',
        dataIndex: 'deviceName',
        key: 'deviceName',
        // width: 200,
        // fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: '通道名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: '国标ID',
        dataIndex: 'channelId',
        key: 'channelId',
        scopedSlots: true,
        headerCell: 'gbChannelIdHeader', // 表头单元格插槽
        search: {
            type: 'string',
        },
    },
    {
        title: '安装地址',
        dataIndex: 'address',
        key: 'address',
        search: {
            type: 'string',
        },
    },
    {
        title: '厂商',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        search: {
            type: 'string',
        },
    },
    {
        title: '在线状态',
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
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
        scopedSlots: true,
    },
];

const params = ref<Record<string, any>>({});

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};

const listRef = ref();
const _selectedRowKeys = ref<string[]>([]);
const bindVis = ref(false);

const onSelectChange = (
    record: any[],
    selected: boolean,
    selectedRows: any[],
) => {
    _selectedRowKeys.value = selected
        ? [...getSetRowKey(selectedRows)]
        : _selectedRowKeys.value.filter((item: any) => item !== record?.id);
};
const onSelectAllChange = (
    selected: boolean,
    selectedRows: any[],
    changeRows: any[],
) => {
    const unRowsKeys = getSelectedRowsKey(changeRows);
    _selectedRowKeys.value = selected
        ? [...getSetRowKey(selectedRows)]
        : _selectedRowKeys.value
              .concat(unRowsKeys)
              .filter((item) => !unRowsKeys.includes(item));
};
const getSelectedRowsKey = (selectedRows: any[]) =>
    selectedRows.map((item) => item?.id).filter((i) => !!i);

const getSetRowKey = (selectedRows: any[]) =>
    new Set([..._selectedRowKeys.value, ...getSelectedRowsKey(selectedRows)]);

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
                onConfirm: async () => {
                    const resp = await CascadeApi.unbindChannel(
                        route.query.id as string,
                        [data.channelId],
                    );
                    if (resp.success) {
                        message.success('操作成功！');
                        listRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
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
        message.error('请先选择需要解绑的通道列表');
        return;
    }
    const channelIds = listRef.value?._dataSource
        .filter((f: any) => _selectedRowKeys.value.includes(f.id))
        .map((m: any) => m.channelId);
    const resp = await CascadeApi.unbindChannel(
        route.query.id as string,
        channelIds,
    );
    if (resp.success) {
        message.success('操作成功！');
        listRef.value?.reload();
    } else {
        message.error('操作失败！');
    }
};

/**
 * 编辑国标ID
 */
const gbID = ref('');
const loading = ref(false);
const handleSave = async (data: any) => {
    if (!gbID.value) message.error('请输入国标ID');
    if (!valid.value?.passed) return;

    loading.value = true;
    const resp = await CascadeApi.updateGbChannelId(data.id, {
        gbChannelId: gbID.value,
    });
    loading.value = false;
    if (resp.success) {
        message.success('操作成功！');
        listRef.value?.reload();
        valid.value = undefined;
        gbID.value = '';
    } else {
        message.error('操作失败！');
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
