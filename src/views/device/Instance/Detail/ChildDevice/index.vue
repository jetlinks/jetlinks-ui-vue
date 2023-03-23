<template>
    <j-card>
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
                class="child-device-search"
            />
            <JProTable
                ref="childDeviceRef"
                :columns="columns"
                :request="query"
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
                @cancelSelect="cancelSelect"
                :params="params"
                :model="'TABLE'"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            type="primary"
                            v-if="
                                detail?.accessProvider ===
                                'official-edge-gateway'
                            "
                            hasPermission="device/Instance:update"
                            @click="
                                _current = {};
                                childVisible = true;
                            "
                            >新增并绑定</PermissionButton
                        >
                        <PermissionButton
                            type="primary"
                            @click="visible = true"
                            hasPermission="device/Instance:update"
                        >
                            绑定</PermissionButton
                        >
                        <PermissionButton
                            type="primary"
                            hasPermission="device/Instance:update"
                            :popConfirm="{
                                title: '确定解绑吗？',
                                onConfirm: handleUnBind,
                            }"
                            >批量解除</PermissionButton
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
                                <template #icon
                                    ><AIcon :type="i.icon"
                                /></template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
            </JProTable>
            <BindChildDevice v-if="visible" @change="closeBindDevice" />
        </div>
    </j-card>
</template>

<script setup lang="ts">
import moment from 'moment';
import type { ActionsType } from '@/components/Table';
import { query, unbindDevice, unbindBatchDevice } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import { storeToRefs } from 'pinia';
import { message } from 'ant-design-vue';
import BindChildDevice from './BindChildDevice/index.vue';
import { usePermissionStore } from '@/store/permission';
import SaveChild from './SaveChild/index.vue';

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

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        ellipsis: true,
        search:{
            type:'string',
            defaultTermType: 'eq'
        }
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
    {
        title: '说明',
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '操作',
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
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
            onClick: () => {
                router.push('/iot/device/instance/detail/' + data.id);
            },
        },
        {
            key: 'action',
            text: '解绑',
            tooltip: {
                title: '解绑',
            },
            icon: 'DisconnectOutlined',
            popConfirm: {
                title: '确认解绑吗？',
                okText: '确定',
                cancelText: '取消',
                onConfirm: async () => {
                    const resp = await unbindDevice(
                        detail.value.id,
                        data.id,
                        {},
                    );
                    if (resp.status === 200) {
                        childDeviceRef.value?.reload();
                        message.success('操作成功！');
                    }
                },
            },
        },
        {
            key: 'update',
            text: '编辑',
            tooltip: {
                title: '编辑',
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
        const resp = await unbindBatchDevice(
            detail.value.id,
            _selectedRowKeys.value,
        );
        if (resp.status === 200) {
            message.success('操作成功！');
            cancelSelect();
            childDeviceRef.value?.reload();
        }
    } else {
        message.warning('请勾选需要解绑的数据');
    }
};

const closeBindDevice = (val: boolean) => {
    visible.value = false;
    if (val) {
        childDeviceRef.value?.reload();
    }
};

const closeChildSave = () => {
    childVisible.value = false;
};
</script>

<style scoped lang="less">
.child-device-search {
    border-bottom: 1px solid #f0f0f0;
}

:deep(._jtable-body_1eyxz_1 ._jtable-body-header_1eyxz_6) {
    justify-content: flex-end;
}
</style>
