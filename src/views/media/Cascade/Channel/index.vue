<!-- 国标级联-通道列表 -->
<template>
    <page-container>
        <Search
            type="simple"
            :columns="columns"
            target="media"
            @search="handleSearch"
        />

        <JTable
            ref="listRef"
            model="table"
            :columns="columns"
            :request="(e:any) => CascadeApi.queryBindChannel(route?.query.id as string, e)"
            :defaultParams="{
                sorts: [{ name: 'name', order: 'desc' }],
            }"
            :params="params"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onSelect: onSelectChange,
                onSelectAll: onSelectAllChange,
            }"
            @cancelSelect="_selectedRowKeys = []"
        >
            <template #headerTitle>
                <h3>通道列表</h3>
            </template>
            <template #rightExtraRender>
                <a-space>
                    <a-button type="primary" @click="bindVis = true">
                        绑定通道
                    </a-button>
                    <a-popconfirm
                        title="确认解绑?"
                        @confirm="handleMultipleUnbind"
                    >
                        <a-button> 批量解绑 </a-button>
                    </a-popconfirm>
                </a-space>
            </template>
            <template #gbChannelId="slotProps">
                <a-space>
                    <Ellipsis>
                        {{ slotProps.gbChannelId }}
                    </Ellipsis>
                    <a-popover
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
                                <a-input
                                    v-model:value="gbID"
                                    @change="validField(slotProps)"
                                />
                                <div
                                    class="error"
                                    v-if="valid && !valid?.passed"
                                >
                                    <!-- {{ valid?.reason }} -->
                                    该国标ID在同一设备下已存在
                                </div>
                            </div>
                            <a-button
                                type="primary"
                                @click="handleSave(slotProps)"
                                :loading="loading"
                                style="width: 100%"
                            >
                                保存
                            </a-button>
                        </template>
                        <a-button type="link" @click="slotProps.popVis = true">
                            <AIcon type="EditOutlined" />
                        </a-button>
                    </a-popover>
                </a-space>
            </template>
            <template #status="slotProps">
                <a-space>
                    <a-badge
                        :status="
                            slotProps.status.value === 'online'
                                ? 'success'
                                : 'error'
                        "
                        :text="slotProps.status.text"
                    ></a-badge>
                </a-space>
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <a-tooltip
                        v-for="i in getActions(slotProps, 'table')"
                        :key="i.key"
                        v-bind="i.tooltip"
                    >
                        <a-popconfirm
                            v-if="i.popConfirm"
                            v-bind="i.popConfirm"
                            :disabled="i.disabled"
                        >
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
        },
    },
    {
        title: '国标ID',
        dataIndex: 'gbChannelId',
        key: 'gbChannelId',
        scopedSlots: true,
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
        title: '状态',
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
