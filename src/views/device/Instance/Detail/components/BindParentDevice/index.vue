<!-- 绑定设备 -->
<template>
    <j-modal
        :maskClosable="false"
        width="1000px"
        :visible="true"
        title="绑定父设备"
        okText="确定"
        cancelText="取消"
        @ok="handleOk"
        @cancel="handleCancel"
        :confirmLoading="btnLoading"
    >
        <j-advanced-search
            :columns="columns"
            target="child-device-bind"
            @search="handleSearch"
            type="simple"
        />
        <JProTable
            ref="bindDeviceRef"
            :columns="columns"
            :request="query"
            model="TABLE"
            :bodyStyle="{ padding: '0 0 0 24px' }"
            :defaultParams="defaultParams"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onChange: onSelectChange,
            }"
            :params="params"
        >
            <template #registryTime="slotProps">
                {{
                    slotProps.registryTime
                        ? dayjs(slotProps.registryTime).format(
                              'YYYY-MM-DD HH:mm:ss',
                          )
                        : ''
                }}
            </template>
            <template #state="slotProps">
                <j-badge
                    :text="slotProps.state.text"
                    :status="statusMap.get(slotProps.state.value)"
                />
            </template>
        </JProTable>
    </j-modal>
</template>

<script setup lang="ts">
import { query, bindDevice } from '@/api/device/instance';
import { onlyMessage } from '@/utils/comm';
import dayjs from 'dayjs';

const emit = defineEmits(['cancel', 'ok']);

const bindDeviceRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const _selectedRowKeys = ref<string[]>([]);
const btnLoading = ref<boolean>(false);

const props = defineProps({
    data: {
        type: Object,
        default: () => {}
    }
})

const statusMap = new Map();
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

const defaultParams = {
    terms: [
        {
            column: 'productId$product-info',
            value: [
                {
                    column: 'deviceType',
                    termType: 'eq',
                    value: 'gateway',
                },
            ],
        },
    ],
};

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        fixed: 'left',
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
        title: '所属产品',
        dataIndex: 'productName',
        key: 'productName',
        search: {
            type: 'string',
        },
    },
    {
        title: '注册时间',
        dataIndex: 'registryTime',
        key: 'registryTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '禁用', value: 'notActive' },
                { label: '离线', value: 'offline' },
                { label: '在线', value: 'online' },
            ],
        },
    },
];

const handleSearch = (e: any) => {
    params.value = e;
};

const onSelectChange = (keys: string[]) => {
    _selectedRowKeys.value = [...keys];
};

const handleOk = () => {
    if (_selectedRowKeys.value.length === 0) {
        onlyMessage('请选择需要绑定的设备', 'warning');
        return;
    }
    btnLoading.value = true;
    bindDevice(_selectedRowKeys.value[0], props.data.id, )
        .then((resp) => {
            if(resp.status === 200){
                emit('ok', _selectedRowKeys.value[0]);
                onlyMessage('操作成功');
            }
        })
        .finally(() => {
            btnLoading.value = false;
        });
};

const handleCancel = () => {
    emit('cancel', false);
};
</script>

<style scoped lang="less"></style>
