<!-- 绑定设备 -->
<template>
    <j-modal
        :maskClosable="false"
        width="1000px"
        :visible="true"
        :title="title"
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
                    sorts: [{ name: 'createTime', order: 'desc' }],
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
                    // selectedRowKeys: _selectedRowKeys,
                    // onChange: onSelectChange,
                    selectedRowKeys: _selectedRowKeys,
                    onSelect: onSelectChange,
                    onSelectAll: selectAll,
                    onSelectNone: () => (_selectedRowKeys = []),
                }"
                :params="params"
            >
                <template #registryTime="slotProps">
                    {{
                        slotProps.registryTime
                            ? dayjs(slotProps.registryTime).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : '--'
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
    bindDevice,
    queryDeviceMapping,
    saveDeviceMapping,
} from '@/api/device/instance';
import {
  queryNoPagingPost,
} from '@/api/device/product';
import dayjs from 'dayjs';
import { useInstanceStore } from '@/store/instance';
import { storeToRefs } from 'pinia';
import { onlyMessage } from '@/utils/comm';

const props = defineProps({
    parentIds: {
        type: Array,
        default: () => [],
    },
    title: {
        type: String,
        default: '绑定子设备',
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
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
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
        title: '所属产品',
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
        search: {
            type: 'select',
            rename: 'productId',
            options: () =>
                new Promise((resolve) => {
                    queryNoPagingPost({
                        paging: false,
                        terms: [
                            {
                                termType: 'eq',
                                column: 'deviceType',
                                value: 'childrenDevice',
                            },
                        ],
                    }).then((resp: any) => {
                        resolve(
                            resp.result.map((item: any) => ({
                                label: item.name,
                                value: item.id,
                            })),
                        );
                    });
                }),
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

// const onSelectChange = (keys: string[], rows: string[]) => {
//     _selectedRowKeys.value = [...keys];
//     console.log(rows);
//     _selectedRowMap.value = rows.map((item) => ({
//         deviceId: item.id,
//         deviceName: item.name,
//     }));
// };

const onSelectChange = (item: any, state: boolean) => {
    const arr = new Set(_selectedRowKeys.value);
    if (state) {
        arr.add(item.id);
    } else {
        arr.delete(item.id);
    }
    _selectedRowKeys.value = [...arr.values()];
};

const selectAll = (selected: Boolean, selectedRows: any, changeRows: any) => {
    if (selected) {
        changeRows.map((i: any) => {
            if (!_selectedRowKeys.value.includes(i.id)) {
                _selectedRowKeys.value.push(i.id);
            }
        });
    } else {
        const arr = changeRows.map((item: any) => item.id);
        const _ids: string[] = [];
        _selectedRowKeys.value.map((i: any) => {
            if (!arr.includes(i)) {
                _ids.push(i);
            }
        });
        _selectedRowKeys.value = _ids;
    }
};

const cancelSelect = () => {
    _selectedRowKeys.value = [];
    // _selectedRowMap.value = [];
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
                if (arr.length) {
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
