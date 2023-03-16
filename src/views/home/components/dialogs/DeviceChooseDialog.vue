<template>
    <j-modal
        visible
        title="选择设备"
        style="width: 1000px"
        @ok="confirm"
        @cancel="emits('update:visible', false)"
        :maskClosable="false"
    >
        <j-advanced-search
            type="simple"
            :columns="columns"
            @search="(params:any)=>queryParams = {...params}"
        />
        <j-pro-table
            model="TABLE"
            :request="getDeviceList_api"
            :columns="columns"
            :params="queryParams"
            :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
            :rowSelection="{
                selectedRowKeys: selectedKeys,
                onChange: (keys:string[])=>selectedKeys = keys,
                type: 'radio',
            }"
        >
            <template #modifyTime="slotProps">
                <span>{{
                    moment(slotProps.modifyTime).format('HHHH-MM-DD HH:mm:ss')
                }}</span>
            </template>
            <template #state="slotProps">
                <StatusLabel
                    :status-value="slotProps.state.value"
                    :status-label="slotProps.state.text"
                />
            </template>
        </j-pro-table>
    </j-modal>
</template>

<script setup lang="ts">
import StatusLabel from '../StatusLabel.vue';
import { getDeviceList_api } from '@/api/home';
import { message } from 'ant-design-vue';
import moment from 'moment';

const emits = defineEmits(['confirm', 'update:visible']);
const props = defineProps<{
    visible: boolean;
}>();

// 弹窗控制
const confirm = () => {
    if (selectedKeys.value.length < 1) {
        return message.warn('请选择设备');
    }
    emits('confirm', selectedKeys.value[0]);
    emits('update:visible', false);
};

const columns = [
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
        scopedSlots: true,
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
        scopedSlots: true,
    },
];

const queryParams = ref({});

const selectedKeys = ref<string[]>([]);
</script>
