<!-- 绑定设备 -->
<template>
    <a-modal
        :maskClosable="false"
        width="1000px"
        :open="true"
        :title="$t('BindParentDevice.index.692574-0')"
        :okText="$t('Save.index.912481-0')"
        :cancelText="$t('Save.index.912481-1')"
        @ok="handleOk"
        @cancel="handleCancel"
        :confirmLoading="btnLoading"
    >
        <pro-search
            :columns="columns"
            target="child-device-bind"
            type="simple"
            @search="handleSearch"
        />
        <JProTable
            ref="bindDeviceRef"
            :columns="columns"
            :request="query"
            mode="TABLE"
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
                <a-badge
                    :text="slotProps.state.text"
                    :status="statusMap.get(slotProps.state.value)"
                />
            </template>
        </JProTable>
    </a-modal>
</template>

<script setup lang="ts">
import { query, bindDevice } from '../../../../../../api/instance';
import { onlyMessage } from '@jetlinks-web-core/utils/comm';
import dayjs from 'dayjs';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

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
        title: $t('BindParentDevice.index.692574-1'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('BindParentDevice.index.692574-2'),
        dataIndex: 'productName',
        key: 'productName',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('BindParentDevice.index.692574-3'),
        dataIndex: 'registryTime',
        key: 'registryTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('BindParentDevice.index.692574-4'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('BindParentDevice.index.692574-5'), value: 'notActive' },
                { label: $t('BindParentDevice.index.692574-6'), value: 'offline' },
                { label: $t('BindParentDevice.index.692574-7'), value: 'online' },
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
        onlyMessage($t('BindParentDevice.index.692574-8'), 'warning');
        return;
    }
    btnLoading.value = true;
    bindDevice(_selectedRowKeys.value[0], [props.data.id])
        .then((resp) => {
            if(resp.status === 200){
                emit('ok', _selectedRowKeys.value[0]);
                onlyMessage($t('BindParentDevice.index.692574-9'));
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
