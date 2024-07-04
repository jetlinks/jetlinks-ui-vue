<template>
    <j-modal
        visible
        :title="$t('dialogs.DeviceChooseDialog.926510-0')"
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
import moment from 'moment';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const emits = defineEmits(['confirm', 'update:visible']);
const props = defineProps<{
    visible: boolean;
}>();

// 弹窗控制
const confirm = () => {
    if (selectedKeys.value.length < 1) {
        return onlyMessage($t('dialogs.DeviceChooseDialog.926510-1'), 'warning');
    }
    emits('confirm', selectedKeys.value[0]);
    emits('update:visible', false);
};

const columns = [
    {
        title: $t('dialogs.DeviceChooseDialog.926510-2'),
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('dialogs.DeviceChooseDialog.926510-3'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('dialogs.DeviceChooseDialog.926510-4'),
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('dialogs.DeviceChooseDialog.926510-5'),
        dataIndex: 'modifyTime',
        key: 'modifyTime',
        ellipsis: true,
        search: {
            type: 'date',
        },
        scopedSlots: true,
    },
    {
        title: $t('dialogs.DeviceChooseDialog.926510-6'),
        dataIndex: 'state',
        key: 'state',
        ellipsis: true,
        search: {
            rename: 'state',
            type: 'select',
            options: [
                {
                    label: $t('dialogs.DeviceChooseDialog.926510-7'),
                    value: 'online',
                },
                {
                    label: $t('dialogs.DeviceChooseDialog.926510-8'),
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
