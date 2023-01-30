<template>
    <div ref="modal" class="func-test-dialog-container"></div>
    <a-modal
        v-model:visible="visible"
        title="选择产品"
        style="width: 1000px"
        @ok="handleOk"
        :getContainer="getContainer"
        :maskClosable="false"
    >
        <Search type="simple" :columns="query.columns" @search="query.search" />
        <JTable
            model="TABLE"
            :request="getDeviceList_api"
            :columns="table.columns"
            :params="query.params"
            :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
            :rowSelection="{
                selectedRowKeys: table.selectedKeys,
                onChange: table.onSelect,
                type: 'radio',
            }"
        >
            <template #modifyTime="slotProps">
                <span>{{ dateFormat(slotProps.modifyTime) }}</span>
            </template>
            <template #state="slotProps">
                <StatusLabel
                    :status-value="slotProps.state.value"
                    :status-label="slotProps.state.text"
                />
            </template>
        </JTable>

        <template #footer>
            <a-button key="back" @click="visible = false">取消</a-button>
            <a-button key="submit" type="primary" @click="handleOk"
                >确认</a-button
            >
        </template>
    </a-modal>
</template>

<script setup lang="ts">
import StatusLabel from '../StatusLabel.vue';

import { ComponentInternalInstance } from 'vue';
import { getDeviceList_api } from '@/api/home';
import { dateFormat } from '@/utils/comm';
import { message } from 'ant-design-vue';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const emits = defineEmits(['confirm']);
const props = defineProps({
    openNumber: Number,
});

// 弹窗控制
const visible = ref<boolean>(false);
const getContainer = () => proxy?.$refs.modal as HTMLElement;
const handleOk = () => {
    if (table.selectedKeys.length < 1) return message.warn('请选择设备');
    emits('confirm', table.selectedKeys[0]);
    visible.value = false;
};
watch(
    () => props.openNumber,
    () => {
        visible.value = true;
    },
);

const query = reactive({
    params: {},
    columns: [
        {
            title: '设备ID',
            dataIndex: 'id',
            key: 'id',
            ellipsis: true,
            search: {
                type: 'string',
            },
        },
        {
            title: '设备名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            search: {
                type: 'string',
            },
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            key: 'productName',
            ellipsis: true,
            search: {
                type: 'string',
            },
        },
        {
            title: '注册时间',
            dataIndex: 'modifyTime',
            key: 'modifyTime',
            ellipsis: true,
            search: {
                type: 'date',
            },
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            ellipsis: true,
            search: {
                rename: 'state',
                type: 'select',
                options: [
                    {
                        label: '在线',
                        value: 'online',
                    },
                    {
                        label: '离线',
                        value: 'offline',
                    },
                ],
            },
        },
    ],
    search: (params: object) => {
        query.params = params;
    },
});

const table = reactive({
    columns: [
        {
            title: '设备Id',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '设备名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '产品名称',
            dataIndex: 'productName',
            key: 'productName',
        },
        {
            title: '注册时间',
            dataIndex: 'modifyTime',
            key: 'modifyTime',
            scopedSlots: true,
        },
        {
            title: '状态',
            dataIndex: 'state',
            key: 'state',
            scopedSlots: true,
        },
    ],
    selectedKeys: [] as string[],
    onSelect: (keys: string[]) => {
        table.selectedKeys = [...keys];
    },
});
</script>

<style lang="less" scoped>
.func-test-dialog-container {
    .search {
        display: flex;
    }
}
</style>
