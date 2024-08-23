<template>
    <a-modal visible title="绑定通道" @cancel="emit('closeBind')" :width="1200">
        <div class="bindControl">
            <div class="bind_left">
                <div>选择设备及目录查看已绑定的通道：</div>
                <ChannelTree @onSelect="selectDevice" />
            </div>
            <div class="bind_right">
                <pro-search
                    :columns="columns"
                    style="padding-bottom: 0; margin-bottom: 0"
                ></pro-search>
                <j-pro-table
                    style="min-height: calc(100% - 60px)"
                    :columns="columns"
                    ref="tableRef"
                    model="table"
                    :rowSelection="{
                        selectedRowKeys: _selectedRowKeys,
                        onSelect: onSelectChange,
                        onSelectAll: selectAll,
                        onSelectNone: () => (_selectedRowKeys = []),
                    }"
                >
                    <template #action="slotProps">
                        <j-space :size="16">
                            <template
                                v-for="i in getActions(slotProps, 'table')"
                                :key="i.key"
                            >
                                <PermissionButton
                                    :disabled="i.disabled"
                                    :popConfirm="i.popConfirm"
                                    type="link"
                                    :tooltip="{
                                        ...i.tooltip,
                                    }"
                                    @click="i.onClick"
                                >
                                    <AIcon :type="i.icon" />
                                </PermissionButton> </template
                        ></j-space> </template
                ></j-pro-table>
            </div>
        </div>
    </a-modal>
    <Live
        v-model:visible="playerVis"
        :data="playData"
        @refresh="tableRef.reload()"
    />
</template>

<script setup>
import ChannelTree from '@/views/media/AutoVideo/components/ChannelTree/index.vue';
import Live from '@/views/media/Device/Channel/Live/index.vue';
const emit = defineEmits(['closeBind']);
const tableRef = ref()

const _selectedRowKeys = ref();
const playData = ref();
const playerVis = ref(false);

const columns = [
    {
        title: 'ID',
        dataIndex: 'channelId',
        key: 'channelId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: '厂商',
        dataIndex: 'manufacturer',
        key: 'manufacturer',
        ellipsis: true,
    },
    {
        title: '安装地址',
        dataIndex: 'address',
        ellipsis: true,
        key: 'address',
        search: {
            type: 'string',
        },
    },
    {
        title: '状态',
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
        },
    },
    {
        title: '操作',
        key: 'action',
        width: 100,
        scopedSlots: true,
    },
];
const getActions = (data, type) => {
    if (!data) return [];
    const actions = [
        {
            key: 'view',
            text: '播放',
            tooltip: {
                title: '播放',
            },
            icon: 'PlayCircleOutlined',
            onClick: () => {
                playData.value = cloneDeep(data);
                playerVis.value = true;
            },
        },
    ];
    return actions;
};
const onSelectChange = (item, state) => {
    const arr = new Set(_selectedRowKeys.value);
    if (state) {
        arr.add(item.id);
    } else {
        arr.delete(item.id);
    }
    _selectedRowKeys.value = [...arr.values()];
};
const selectAll = (selected, selectedRows, changeRows) => {
    if (selected) {
        changeRows.map((i) => {
            if (!_selectedRowKeys.value.includes(i.id)) {
                _selectedRowKeys.value.push(i.id);
            }
        });
    } else {
        const arr = changeRows.map((item) => item.id);
        const _ids = [];
        _selectedRowKeys.value.map((i) => {
            if (!arr.includes(i)) {
                _ids.push(i);
            }
        });
        _selectedRowKeys.value = _ids;
    }
};

const selectDevice = () => {};
</script>
<style lang="less" scoped>
.bindControl {
    display: flex;
    .bind_left {
        flex: 1;
    }
    .bind_right {
        flex: 3;
    }
}
</style>
