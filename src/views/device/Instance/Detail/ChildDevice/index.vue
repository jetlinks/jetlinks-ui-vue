<template>
    <SaveChild
        v-if="childVisible"
        @close-child-save="closeChildSave"
        :childData="_current"
    />
    <div v-else>
        <pro-search
            :columns="columns"
            target="child-device"
            @search="handleSearch"
            class="device-child-device-search"
        />
        <!-- <j-divider /> -->
        <JProTable
            ref="childDeviceRef"
            :columns="columns"
            :request="query"
            :bodyStyle="{
                padding: 0,
            }"
            :defaultParams="{
                terms: [
                    {
                        column: 'parentId',
                        value: detail?.id || '',
                        termType: 'eq',
                    },
                ],
            }"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onChange: onSelectChange,
            }"
            :params="params"
            :model="'TABLE'"
        >
            <template #rightExtraRender>
                <j-space>
                    <PermissionButton
                        type="primary"
                        v-if="
                            detail?.accessProvider === 'official-edge-gateway'
                        "
                        hasPermission="device/Instance:update"
                        @click="
                            _current = {};
                            childVisible = true;
                        "
                        >{{ $t('ChildDevice.index.423130-0') }}</PermissionButton
                    >
                    <PermissionButton
                        type="primary"
                        @click="visible = true"
                        hasPermission="device/Instance:update"
                    >
                        {{ $t('ChildDevice.index.423130-1') }}</PermissionButton
                    >
                    <PermissionButton
                        type="primary"
                        hasPermission="device/Instance:update"
                        :popConfirm="{
                            title: $t('ChildDevice.index.423130-2'),
                            onConfirm: handleUnBind,
                        }"
                        >{{ $t('ChildDevice.index.423130-3') }}</PermissionButton
                    >
                </j-space>
            </template>
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
            <template #action="slotProps">
                <j-space :size="16">
                    <template
                        v-for="i in getActions(slotProps, 'table')"
                        :key="i.key"
                    >
                        <PermissionButton
                            v-if="
                                i.key !== 'update' ||
                                detail.accessProvider ===
                                    'official-edge-gateway'
                            "
                            :disabled="i.disabled"
                            :popConfirm="i.popConfirm"
                            :tooltip="{
                                ...i.tooltip,
                            }"
                            @click="i.onClick"
                            type="link"
                            style="padding: 0px"
                            :hasPermission="'device/Instance:' + i.key"
                        >
                            <template #icon>
                                <AIcon :type="i.icon" />
                            </template>
                        </PermissionButton>
                    </template>
                </j-space>
            </template>
        </JProTable>
        <BindChildDevice
            v-if="visible"
            :parentIds="parentIds"
            @change="closeBindDevice"
        />
    </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import type { ActionsType } from '@/components/Table';
import {
    query,
    unbindDevice,
    unbindBatchDevice,
    queryByParent,
    deleteDeviceMapping,
} from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import { storeToRefs } from 'pinia';
import BindChildDevice from './BindChildDevice/index.vue';
import { usePermissionStore } from '@/store/permission';
import SaveChild from './SaveChild/index.vue';
import { onlyMessage } from '@/utils/comm';
import { cloneDeep } from 'lodash-es';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const instanceStore = useInstanceStore();
const { detail } = storeToRefs(instanceStore);
const router = useRouter();
const childVisible = ref(false);
const permissionStore = usePermissionStore();
// watchEffect(() => {
//     console.log(detail.value);
// });
const statusMap = new Map();
statusMap.set('online', 'success');
statusMap.set('offline', 'error');
statusMap.set('notActive', 'warning');

const childDeviceRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const _selectedRowKeys = ref<string[]>([]);
const visible = ref<boolean>(false);
const _current = ref({});
const parentIds = ref<any[]>([instanceStore.detail.id]);

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        search: {
            type: 'string',
            defaultTermType: 'eq',
        },
    },
    {
        title: $t('ChildDevice.index.423130-4'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('ChildDevice.index.423130-5'),
        dataIndex: 'productName',
        key: 'productName',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('ChildDevice.index.423130-6'),
        dataIndex: 'registryTime',
        key: 'registryTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('ChildDevice.index.423130-7'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('ChildDevice.index.423130-8'), value: 'notActive' },
                { label: $t('ChildDevice.index.423130-9'), value: 'offline' },
                { label: $t('ChildDevice.index.423130-10'), value: 'online' },
            ],
        },
    },
    {
        title: $t('ChildDevice.index.423130-11'),
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('ChildDevice.index.423130-12'),
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];

const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
    if (!data) return [];
    return [
        {
            key: 'view',
            text: $t('ChildDevice.index.423130-13'),
            tooltip: {
                title: $t('ChildDevice.index.423130-13'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                router.push('/iot/device/instance/detail/' + data.id);
            },
        },
        {
            key: 'action',
            text: $t('ChildDevice.index.423130-14'),
            tooltip: {
                title: $t('ChildDevice.index.423130-14'),
            },
            icon: 'DisconnectOutlined',
            popConfirm: {
                title: $t('ChildDevice.index.423130-2'),
                okText: $t('ChildDevice.index.423130-15'),
                cancelText: $t('ChildDevice.index.423130-16'),
                onConfirm: async() => {
                    const response = unbindDevice(detail.value.id, data.id, {});
                    if (
                        instanceStore.current.accessProvider ===
                        'official-edge-gateway'
                    ) {
                        const res = await deleteDeviceMapping(detail.value.id, {
                            ids: [data.id],
                        });
                    }
                    response.then((resp) => {
                        if (resp.status === 200) {
                            _selectedRowKeys.value.find(
                                (i: any, index: number) => {
                                    if (i === data.id) {
                                        _selectedRowKeys.value.splice(index, 1);
                                    }
                                    return i === data.id;
                                },
                            );
                            childDeviceRef.value?.reload();
                            onlyMessage($t('ChildDevice.index.423130-17'));
                        }
                    });
                    return response
                },
            },
        },
        {
            key: 'update',
            text: $t('ChildDevice.index.423130-18'),
            tooltip: {
                title: $t('ChildDevice.index.423130-18'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                _current.value = data;
                childVisible.value = true;
            },
        },
    ];
};

const handleSearch = (e: any) => {
    params.value = e;
};

const onSelectChange = (keys: string[]) => {
    _selectedRowKeys.value = [...keys];
};

const cancelSelect = () => {
    _selectedRowKeys.value = [];
};

const handleUnBind = async () => {
    if (_selectedRowKeys.value.length) {
        const response = unbindBatchDevice(
            detail.value.id,
            _selectedRowKeys.value,
        );
        if (instanceStore.current.accessProvider === 'official-edge-gateway') {
            const res = await deleteDeviceMapping(detail.value.id, {
                ids: [_selectedRowKeys.value],
            });
        }
        response.then((resp) => {
            if (resp.status === 200) {
                onlyMessage($t('ChildDevice.index.423130-17'));
                cancelSelect();
                childDeviceRef.value?.reload();
            }
        });
        return response;
    } else {
        onlyMessage($t('ChildDevice.index.423130-19'), 'warning');
    }
};

const closeBindDevice = (val: boolean) => {
    visible.value = false;
    if (val) {
        childDeviceRef.value?.reload();
    }
};

// const getChildren = async () => {
//   const { id} = instanceStore.detail
//   const data = await queryByParent(id)
//   if (data.success) {
//     parentIds.value.concat(data.result)
//   }
// }
const closeChildSave = () => {
    childVisible.value = false;
};
onMounted(() => {
    console.log(detail.value.accessProvider);
});
</script>

<style lang="less">
.device-child-device-search {
    padding: 0px;
}
</style>
