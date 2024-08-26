<template>
    <div>
        <pro-search
            :columns="columns"
            @search="handleSearch"
            style="margin-bottom: 0"
        ></pro-search>
        <j-pro-table
            ref="tableRef"
            :columns="columns"
            :params="params"
            model="table"
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
        <!-- <Logs v-if="logsVisible" @close="logsVisible  = false"/> -->
    </div>
</template>

<script setup name="Log">
// import Logs from '@/views/media/AutoVideo/components/Logs/index.vue';
const params = ref();
const tableRef = ref();
const logsVisible = ref(false);
const columns = [
    {
        title: '时间',
        dataIndex: '',
        key: '',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '通道ID',
        dataIndex: 'channelId',
        key: 'channelId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '通道名称',
        dataIndex: 'channelName',
        key: 'channelName',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: '设备ID',
        dataIndex: 'deviceId',
        key: 'deviceId',
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: '设备名称',
        dataIndex: 'deviceName',
        ellipsis: true,
        key: 'deviceName',
        search: {
            type: 'string',
        },
    },
    {
        title: '执行状态',
        dataIndex: 'status',
        key: 'status',
        scopedSlots: true,
        width: 150,
        search: {
            type: 'select',
            options: [],
        },
    },
    {
        title: '操作',
        key: 'action',
        width: 100,
        scopedSlots: true,
    },
];
/**
 * 搜索
 * @param params
 */
const handleSearch = (e) => {
    params.value = e;
};

const getActions = (data, type) => {
    if (!data) return [];
    const actions = [
        {
            key: 'view',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
            onClick: () => {
                logsVisible.value = true;
            },
        },
    ];
    return actions;
};
</script>

<style lang="less"></style>
