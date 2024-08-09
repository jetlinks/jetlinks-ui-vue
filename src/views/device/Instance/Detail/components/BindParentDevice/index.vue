<!-- 绑定设备 -->
<template>
    <j-modal
        :maskClosable="false"
        width="1000px"
        :visible="true"
        :title="$t('BindParentDevice.index.920633-0')"
        :okText="$t('BindParentDevice.index.920633-1')"
        :cancelText="$t('BindParentDevice.index.920633-2')"
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
        title: $t('BindParentDevice.index.920633-3'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('BindParentDevice.index.920633-4'),
        dataIndex: 'productName',
        key: 'productName',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('BindParentDevice.index.920633-5'),
        dataIndex: 'registryTime',
        key: 'registryTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('BindParentDevice.index.920633-6'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('BindParentDevice.index.920633-7'), value: 'notActive' },
                { label: $t('BindParentDevice.index.920633-8'), value: 'offline' },
                { label: $t('BindParentDevice.index.920633-9'), value: 'online' },
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
        onlyMessage($t('BindParentDevice.index.920633-10'), 'warning');
        return;
    }
    btnLoading.value = true;
    bindDevice(_selectedRowKeys.value[0], [props.data.id])
        .then((resp) => {
            if(resp.status === 200){
                emit('ok', _selectedRowKeys.value[0]);
                onlyMessage($t('BindParentDevice.index.920633-11'));
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
