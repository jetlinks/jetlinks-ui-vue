<!-- 绑定设备 -->
<template>
    <j-modal
        :maskClosable="false"
        width="1000px"
        :visible="true"
        title="绑定子设备"
        okText="确定"
        cancelText="取消"
        @ok="handleOk"
        @cancel="handleCancel"
        :confirmLoading="btnLoading"
    >
        <div style="margin-top: 10px">
            <pro-search
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
                :defaultParams="{
                    terms: [
                        {
                            terms: [
                                {
                                    column: 'parentId$isnull',
                                    value: '',
                                    type: 'or',
                                },
                                //     {
                                //         column: 'parentId$not',
                                //         value: detail.id,
                                //         type: 'or',
                                //     },
                            ],
                        },
                        {
                            terms: [
                                {
                                    column: 'id$not',
                                    value: parentIds.join(','),
                                    type: 'and',
                                },
                            ],
                            type: 'and',
                        },
                        {
                            terms: [
                                {
                                    termType: 'eq',
                                    column: 'deviceType',
                                    value: 'childrenDevice',
                                },
                            ],
                            type: 'and',
                        },
                    ],
                }"
                :rowSelection="{
                    selectedRowKeys: _selectedRowKeys,
                    onChange: onSelectChange,
                }"
                :params="params"
            >
                <template #registryTime="slotProps">
                    {{
                        slotProps.registryTime
                            ? moment(slotProps.registryTime).format(
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
        </div>
    </j-modal>
</template>

<script setup lang="ts" name="BindChildDevice">
import {
    query,
    queryByParent,
    bindDevice,
    queryDeviceMapping,
    saveDeviceMapping,
} from '@/api/device/instance';
import moment from 'moment';
import { useInstanceStore } from '@/store/instance';
import { storeToRefs } from 'pinia';
import { onlyMessage } from '@/utils/comm';

const props = defineProps({
    parentIds: {
        type: Array,
        default: () => [],
    },
});

const instanceStore = useInstanceStore();
const { detail } = storeToRefs(instanceStore);

const emit = defineEmits(['change']);

const bindDeviceRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const _selectedRowKeys = ref<string[]>([]);
const _selectedRowMap = ref<any[]>([]);
const btnLoading = ref<boolean>(false);

const statusMap = new Map();
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

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

const onSelectChange = (keys: string[], rows: string[]) => {
    _selectedRowKeys.value = [...keys];
    console.log(rows);
    _selectedRowMap.value = rows.map((item) => ({
        deviceId: item.id,
        deviceName: item.name,
    }));
};

const cancelSelect = () => {
    _selectedRowKeys.value = [];
    _selectedRowMap.value = [];
};

const handleOk = () => {
    if (_selectedRowKeys.value.length === 0) {
        onlyMessage('请选择需要绑定的设备', 'warning');
        return;
    }
    btnLoading.value = true;
    if (instanceStore.current.accessProvider === 'official-edge-gateway') {
        // 网关设备
        queryDeviceMapping(instanceStore.current.id)
            .then((res) => {
                const arr = bindDeviceRef.value?._dataSource
                    .filter((item) => {
                        return (
                            !res.result?.[0]?.find(
                                (val) => val.deviceId === item.id,
                            ) && _selectedRowKeys.value.includes(item.id)
                        );
                    })
                    .map((item) => {
                        return {
                            deviceId: item.id,
                            deviceName: item.name,
                        };
                    });
                if(arr.length){
                    return saveDeviceMapping(instanceStore.current.id, {
                        info: arr,
                    });
                }
            })
            .then((res) => {
                return bindDevice(detail.value.id, _selectedRowKeys.value);
            })
            .then((res) => {
                emit('change', true);
                cancelSelect();
                onlyMessage('操作成功');
            })
            .finally(() => {
                btnLoading.value = false;
            });
    } else {
        bindDevice(detail.value.id, _selectedRowKeys.value)
            .then((res) => {
                emit('change', true);
                cancelSelect();
                onlyMessage('操作成功');
            })
            .finally(() => {
                btnLoading.value = false;
            });
    }
};

const handleCancel = () => {
    emit('change', false);
};
</script>

<style scoped lang="less"></style>
