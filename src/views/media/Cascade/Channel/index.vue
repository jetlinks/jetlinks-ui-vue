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
                    <h3>{{ $t('Channel.index.755831-0') }}</h3>
                </template>
                <template #rightExtraRender>
                    <j-space>
                        <j-button type="primary" @click="bindVis = true">
                            {{ $t('Channel.index.755831-1') }}
                        </j-button>
                        <PermissionButton
                            type="primary"
                            :popConfirm="{
                                title: $t('Channel.index.755831-2'),
                                onConfirm: handleMultipleUnbind,
                            }"
                            >{{ $t('Channel.index.755831-3') }}</PermissionButton
                        >
                    </j-space>
                </template>
                <template #gbChannelIdHeader="title">
                    <j-tooltip
                        :title="$t('Channel.index.755831-4')"
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
                                    <span>{{ $t('Channel.index.755831-5') }}</span>
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
                                        :placeholder="$t('Channel.index.755831-6')"
                                    />
                                    <div
                                        class="error"
                                        v-if="valid && !valid?.passed"
                                    >
                                        <!-- {{ valid?.reason }} -->
                                        {{ $t('Channel.index.755831-7') }}
                                    </div>
                                </div>
                                <j-button
                                    type="primary"
                                    @click="handleSave(slotProps)"
                                    :loading="loading"
                                    style="width: 100%"
                                >
                                    {{ $t('Channel.index.755831-8') }}
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const route = useRoute();

const columns = [
    {
        title: $t('Channel.index.755831-9'),
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
        title: $t('Channel.index.755831-10'),
        dataIndex: 'name',
        ellipsis: true,
        key: 'name',
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: $t('Channel.index.755831-11'),
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
        title: $t('Channel.index.755831-12'),
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Channel.index.755831-13'),
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Channel.index.755831-14'),
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
        width: 150,
        search: {
            type: 'select',
            options: [
                { label: $t('Channel.index.755831-15'), value: 'online' },
                { label: $t('Channel.index.755831-16'), value: 'offline' },
            ],
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: $t('Channel.index.755831-17'),
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
            text: $t('Channel.index.755831-18'),
            tooltip: {
                title: $t('Channel.index.755831-18'),
            },
            icon: 'DisconnectOutlined',
            popConfirm: {
                title: $t('Channel.index.755831-19'),
                onConfirm: () => {
                    const response = CascadeApi.unbindChannel(
                        route.query.id as string,
                        [data.channelId],
                    );
                    response.then((resp) => {
                        if (resp.success) {
                            onlyMessage($t('Channel.index.755831-20'));
                            listRef.value?.reload();
                        } else {
                            onlyMessage($t('Channel.index.755831-21'), 'error');
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
        onlyMessage($t('Channel.index.755831-22'), 'error');
        return;
    }
    const resp = await CascadeApi.unbindChannel(route.query.id as string, [
        ...channelIdMap.values(),
    ]);
    if (resp.success) {
        onlyMessage($t('Channel.index.755831-20'));
        _selectedRowKeys.value = [];
        channelIdMap.clear();
        listRef.value?.reload();
    } else {
        onlyMessage($t('Channel.index.755831-21'), 'error');
    }
};

/**
 * 编辑国标ID
 */
const gbID = ref('');
const loading = ref(false);
const handleSave = async (data: any) => {
    if (!gbID.value) onlyMessage($t('Channel.index.755831-6'), 'error');
    if (!valid.value?.passed) return;

    loading.value = true;
    const resp = await CascadeApi.updateGbChannelId(data.id, {
        gbChannelId: gbID.value,
    });
    loading.value = false;
    if (resp.success) {
        onlyMessage($t('Channel.index.755831-20'));
        listRef.value?.reload();
        valid.value = undefined;
        gbID.value = '';
    } else {
        onlyMessage($t('Channel.index.755831-21'), 'error');
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
