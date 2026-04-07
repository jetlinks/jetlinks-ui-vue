<!-- 绑定设备 -->
<template>
    <a-modal
        :maskClosable="false"
        width="1000px"
        :open="true"
        :title="title"
        :okText="$t('Save.index.912481-0')"
        :cancelText="$t('Save.index.912481-1')"
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
                mode="TABLE"
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
                    <a-badge
                        :text="slotProps.state.text"
                        :status="statusMap.get(slotProps.state.value)"
                    />
                </template>
            </JProTable>
        </div>
    </a-modal>
</template>

<script setup lang="ts" name="BindChildDevice">
import {
    query,
    bindDevice,
    queryDeviceMapping,
    saveDeviceMapping,
} from '../../../../../../api/instance';
import {
    queryNoPagingPost,
} from '@device-manager-ui/api/product'
import dayjs from 'dayjs';
import { useInstanceStore } from '../../../../../../store/instance';
import { storeToRefs } from 'pinia';
import { onlyMessage } from '@jetlinks-web/utils';
import i18n from '@jetlinks-web-core/locales';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
    parentIds: {
        type: Array,
        default: () => [],
    },
    title: {
        type: String,
        default: i18n.global.t('BindChildDevice.index.146415-0'),
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
    // {
    //     title: $t('BindChildDevice.index.146415-1'),
    //     dataIndex: 'name',
    //     key: 'name',
    //     ellipsis: true,
    //     search: {
    //         type: 'string',
    //     },
    // },
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
        title: $t('BindChildDevice.index.146415-1'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('BindChildDevice.index.146415-2'),
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
        title: $t('BindChildDevice.index.146415-3'),
        dataIndex: 'registryTime',
        key: 'registryTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('BindChildDevice.index.146415-4'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('BindChildDevice.index.146415-5'), value: 'notActive' },
                { label: $t('BindChildDevice.index.146415-6'), value: 'offline' },
                { label: $t('BindChildDevice.index.146415-7'), value: 'online' },
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
        onlyMessage($t('BindChildDevice.index.146415-8'), 'warning');
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
                onlyMessage($t('BindChildDevice.index.146415-9'));
            })
            .finally(() => {
                btnLoading.value = false;
            });
    } else {
        bindDevice(detail.value.id, _selectedRowKeys.value)
            .then((res) => {
                emit('change', true);
                cancelSelect();
                onlyMessage($t('BindChildDevice.index.146415-9'));
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
