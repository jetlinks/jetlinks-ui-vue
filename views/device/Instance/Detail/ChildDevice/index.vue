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
            type="simple"
        />
        <!-- <a-divider /> -->
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
            mode='TABLE'
        >
            <template #headerRightRender>
                <a-space>
                    <j-permission-button
                        type="primary"
                        v-if="
                            detail?.accessProvider === 'official-edge-gateway'
                        "
                        hasPermission="device/Instance:update"
                        @click="
                            _current = {};
                            childVisible = true;
                        "
                        >{{ $t('ChildDevice.index.370771-0') }}</j-permission-button
                    >
                    <j-permission-button
                        type="primary"
                        @click="visible = true"
                        hasPermission="device/Instance:update"
                    >
                        {{ $t('ChildDevice.index.370771-1') }}</j-permission-button
                    >
                    <j-permission-button
                        type="primary"
                        hasPermission="device/Instance:update"
                        :popConfirm="{
                            title: $t('ChildDevice.index.370771-2'),
                            onConfirm: handleUnBind,
                        }"
                        >{{ $t('ChildDevice.index.370771-3') }}</j-permission-button
                    >
                </a-space>
            </template>
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
            <template #action="slotProps">
                <a-space :size="16">
                    <template
                        v-for="i in getActions(slotProps)"
                        :key="i.key"
                    >
                        <j-permission-button
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
                        </j-permission-button>
                    </template>
                </a-space>
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
import dayjs from 'dayjs';
import {
    query,
    unbindDevice,
    unbindBatchDevice,
    deleteDeviceMapping,
} from '../../../../../api/instance';
import { useInstanceStore } from '../../../../../store/instance';
import { storeToRefs } from 'pinia';
import BindChildDevice from './BindChildDevice/index.vue';
import SaveChild from './SaveChild/index.vue';
import { onlyMessage } from '@jetlinks-web-core/utils/comm';
import { useI18n } from 'vue-i18n';
import {useMenuStore} from "@jetlinks-web-core/store";

const { t: $t } = useI18n();

const instanceStore = useInstanceStore();
const { detail } = storeToRefs(instanceStore);
const menuStore = useMenuStore();
const childVisible = ref(false);

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
        title: $t('ChildDevice.index.370771-4'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('ChildDevice.index.370771-5'),
        dataIndex: 'productName',
        key: 'productName',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('ChildDevice.index.370771-6'),
        dataIndex: 'registryTime',
        key: 'registryTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('ChildDevice.index.370771-7'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('ChildDevice.index.370771-8'), value: 'notActive' },
                { label: $t('ChildDevice.index.370771-9'), value: 'offline' },
                { label: $t('ChildDevice.index.370771-10'), value: 'online' },
            ],
        },
    },
    {
        title: $t('ChildDevice.index.370771-11'),
        dataIndex: 'describe',
        key: 'describe',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('ChildDevice.index.370771-12'),
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];

const getActions = (data: Partial<Record<string, any>>): any[] => {
    if (!data) return [];
    return [
        {
            key: 'view',
            text: $t('ChildDevice.index.370771-13'),
            tooltip: {
                title: $t('ChildDevice.index.370771-13'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
              menuStore.jumpPage('device/Instance/Detail', { params: { id: data.id } });
            },
        },
        {
            key: 'action',
            text: $t('ChildDevice.index.370771-14'),
            tooltip: {
                title: $t('ChildDevice.index.370771-14'),
            },
            icon: 'DisconnectOutlined',
            popConfirm: {
                title: $t('ChildDevice.index.370771-2'),
                okText: $t('ChildDevice.index.370771-15'),
                cancelText: $t('ChildDevice.index.370771-16'),
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
                            onlyMessage($t('ChildDevice.index.370771-17'));
                        }
                    });
                    return response
                },
            },
        },
        {
            key: 'update',
            text: $t('ChildDevice.index.370771-18'),
            tooltip: {
                title: $t('ChildDevice.index.370771-18'),
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
                onlyMessage($t('ChildDevice.index.370771-17'));
                cancelSelect();
                childDeviceRef.value?.reload();
            }
        });
        return response;
    } else {
        onlyMessage($t('ChildDevice.index.370771-19'), 'warning');
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
