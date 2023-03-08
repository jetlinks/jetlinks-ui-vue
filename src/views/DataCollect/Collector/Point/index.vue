<template>
    <div>
        <j-advanced-search
            :columns="columns"
            target="search"
            @search="handleSearch"
        />

        <j-pro-table
            ref="tableRef"
            model="CARD"
            :columns="columns"
            :gridColumn="2"
            :gridColumns="[1, 2]"
            :request="queryPoint"
            :defaultParams="{
                sorts: [{ name: 'id', order: 'desc' }],
            }"
            :params="params"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onChange: onSelectChange,
            }"
            @cancelSelect="cancelSelect"
        >
            <template #headerTitle>
                <j-space>
                    <PermissionButton
                        type="primary"
                        @click="handlAdd"
                        hasPermission="DataCollect/Collector:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        {{ data?.provider === 'OPC_UA' ? '扫描' : '新增点位' }}
                    </PermissionButton>
                    <j-dropdown v-if="data?.provider === 'OPC_UA'">
                        <j-button
                            >批量操作 <AIcon type="DownOutlined"
                        /></j-button>
                        <template #overlay>
                            <j-menu>
                                <j-menu-item>
                                    <PermissionButton
                                        hasPermission="DataCollect/Collector:update"
                                    >
                                        <template #icon
                                            ><AIcon type="FormOutlined"
                                        /></template>
                                        编辑
                                    </PermissionButton>
                                </j-menu-item>
                                <j-menu-item>
                                    <PermissionButton
                                        hasPermission="DataCollect/Collector:delete"
                                    >
                                        <template #icon
                                            ><AIcon type="EditOutlined"
                                        /></template>
                                        删除
                                    </PermissionButton>
                                </j-menu-item>
                            </j-menu>
                        </template>
                    </j-dropdown>
                </j-space>
            </template>
            <template #card="slotProps">
                <PointCardBox
                    :showStatus="true"
                    :value="slotProps"
                    @click="handleClick"
                    :active="_selectedRowKeys.includes(slotProps.id)"
                    class="card-box"
                    :status="getState(slotProps).value"
                    :statusText="getState(slotProps)?.text"
                    :statusNames="Object.fromEntries(colorMap.entries())"
                >
                    <!-- <PointCardBox
                    :showStatus="true"
                    :value="slotProps"
                    :actions="getActions(slotProps)"
                    :active="_selectedRowKeys.includes(slotProps.id)"
                    v-bind="slotProps"
                    class="card-box"
                    :status="getState(slotProps).value"
                    :statusText="slotProps.runningState?.text"
                    :statusNames="Object.fromEntries(colorMap.entries())"
                > -->
                    <template #title>
                        <slot name="title">
                            <div class="card-box-title">
                                {{ slotProps.name }}
                            </div>
                        </slot>
                    </template>
                    <template #action>
                        <div class="card-box-action">
                            <a><AIcon type="DeleteOutlined" /></a>
                            <a><AIcon type="FormOutlined" /></a>
                        </div>
                    </template>
                    <template #img>
                        <img
                            :src="
                                slotProps.provider === 'OPC_UA'
                                    ? opcImage
                                    : modbusImage
                            "
                        />
                    </template>
                    <template #content>
                        <div class="card-box-content">
                            <div class="card-box-content-left">
                                <span>--</span>
                                <a><AIcon type="EditOutlined" /></a>
                                <a><AIcon type="RedoOutlined" /></a>
                            </div>
                            <div class="card-box-content-right">
                                <div
                                    v-if="getRight1(slotProps)"
                                    class="card-box-content-right-1"
                                >
                                    <span>{{ getQuantity(slotProps) }}</span>
                                    <span>{{ getAddress(slotProps) }}</span>
                                    <span>{{ getScaleFactor(slotProps) }}</span>
                                </div>
                                <div class="card-box-content-right-2">
                                    <span>{{ getText(slotProps) }}</span>
                                    <span>{{ getInterval(slotProps) }}</span>
                                </div>
                            </div>
                        </div>
                    </template>
                </PointCardBox>
            </template>
        </j-pro-table>
        <SaveModBus
            v-if="visibleSaveModBus"
            :data="current"
            @change="saveChange"
        />
    </div>
</template>
<script lang="ts" setup name="PointPage">
import type { ActionsType } from '@/components/Table/index.vue';
import { getImage } from '@/utils/comm';
import { queryPoint } from '@/api/data-collect/collector';
import { message } from 'ant-design-vue';
import { useMenuStore } from 'store/menu';
import PointCardBox from './components/PointCardBox/index.vue';
import { colorMap, getState } from '../data.ts';
import SaveModBus from './Save/SaveModBus.vue';

const props = defineProps({
    data: {
        type: Object,
        default: {},
    },
});

const menuStory = useMenuStore();
const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const opcImage = getImage('/DataCollect/device-opcua.png');
const modbusImage = getImage('/DataCollect/device-modbus.png');
const visibleSaveModBus = ref(false);
const current = ref({});
const accessModesOption = ref();
const _selectedRowKeys = ref<string[]>([]);

const accessModesMODBUS_TCP = [
    {
        label: '读',
        value: 'read',
    },
    {
        label: '写',
        value: 'write',
    },
];

const accessModesOPC_UA = accessModesMODBUS_TCP.concat({
    label: '订阅',
    value: 'subscribe',
});

const columns = [
    {
        title: '点位名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: '通讯协议',
        dataIndex: 'provider',
        key: 'provider',
        search: {
            type: 'select',
            options: [
                {
                    label: 'OPC_UA',
                    value: 'OPC_UA',
                },
                {
                    label: 'MODBUS_TCP',
                    value: 'MODBUS_TCP',
                },
            ],
        },
    },
    {
        title: '访问类型',
        dataIndex: 'accessModes$in$any',
        key: 'accessModes$in$any',
        search: {
            type: 'select',
            options: accessModesOption,
        },
    },
    {
        title: '运行状态',
        dataIndex: 'runningState',
        key: 'runningState',
        search: {
            type: 'select',
            options: [
                {
                    label: '运行中',
                    value: 'running',
                },
                {
                    label: '部分错误',
                    value: 'partialError',
                },
                {
                    label: '错误',
                    value: 'failed',
                },
                {
                    label: '已停止',
                    value: 'stopped',
                },
            ],
        },
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        search: {
            type: 'string',
        },
    },
];

// const getActions = (data: Partial<Record<string, any>>): ActionsType[] => {
//     if (!data) return [];
//     const state = data.state.value;
//     const stateText = state === 'enabled' ? '禁用' : '启用';
//     const actions = [
//         {
//             key: 'update',
//             text: '编辑',
//             tooltip: {
//                 title: '编辑',
//             },
//             icon: 'EditOutlined',
//             onClick: () => {
//                 handlEdit(data.id);
//             },
//         },
//         {
//             key: 'action',
//             text: stateText,
//             tooltip: {
//                 title: stateText,
//             },
//             icon: state === 'enabled' ? 'StopOutlined' : 'CheckCircleOutlined',
//             popConfirm: {
//                 title: `确认${stateText}?`,
//                 onConfirm: async () => {
//                     let res =
//                         state === 'enabled'
//                             ? await disable(data.id)
//                             : await enalbe(data.id);
//                     if (res.success) {
//                         message.success('操作成功');
//                         tableRef.value?.reload();
//                     } else {
//                         message.error('操作失败！');
//                     }
//                 },
//             },
//         },
//         {
//             key: 'delete',
//             text: '删除',
//             disabled: state === 'enabled',
//             tooltip: {
//                 title: state === 'enabled' ? '正常的流媒体不能删除' : '删除',
//             },
//             popConfirm: {
//                 title: '确认删除?',
//                 onConfirm: async () => {
//                     const res = await remove(data.id);
//                     if (res.success) {
//                         message.success('操作成功');
//                         tableRef.value.reload();
//                     } else {
//                         message.error('操作失败！');
//                     }
//                 },
//             },
//             icon: 'DeleteOutlined',
//         },
//     ];
//     return actions;
// };

const handlAdd = () => {
    visibleSaveModBus.value = true;
    current.value = {
        treeId: props.data.id,
    };
};
const handlEdit = (id: string) => {
    // menuStory.jumpPage(`media/Stream/Detail`, { id }, { view: false });
};
const handlEye = (id: string) => {
    // menuStory.jumpPage(`media/Stream/Detail`, { id }, { view: true });
};

const getQuantity = (item: Partial<Record<string, any>>) => {
    const { quantity } = item.configuration?.parameter || '';
    return !!quantity ? quantity + '(读取寄存器)' : '';
};
const getAddress = (item: Partial<Record<string, any>>) => {
    const { address } = item.configuration?.parameter || '';
    return !!address ? address + '(地址)' : '';
};
const getScaleFactor = (item: Partial<Record<string, any>>) => {
    const { scaleFactor } = item.configuration?.codec?.configuration || '';
    return !!scaleFactor ? scaleFactor + '(缩放因子)' : '';
};

const getRight1 = (item: Partial<Record<string, any>>) => {
    return !!getQuantity(item) || getAddress(item) || getScaleFactor(item);
};

const getText = (item: Partial<Record<string, any>>) => {
    return (item?.accessModes || []).map((i) => i?.text).join(',');
};
const getInterval = (item: Partial<Record<string, any>>) => {
    const { interval } = item.configuration || '';
    return !!interval ? '采集频率' + interval + 'ms' : '';
};

const getaccessModesOption = () => {
    return props.data?.provider !== 'MODBUS_TCP'
        ? accessModesMODBUS_TCP.concat({
              label: '订阅',
              value: 'subscribe',
          })
        : accessModesMODBUS_TCP;
};

const saveChange = (value: object) => {
    visibleSaveModBus.value = false;
    current.value = {};
    if (value) {
        handleSearch(params.value);
        // message.success('操作成功');
    }
};

const onSelectChange = (keys: string[]) => {
    _selectedRowKeys.value = [...keys];
};

const cancelSelect = () => {
    _selectedRowKeys.value = [];
};

const handleClick = (dt: any) => {
    if (_selectedRowKeys.value.includes(dt.id)) {
        const _index = _selectedRowKeys.value.findIndex((i) => i === dt.id);
        _selectedRowKeys.value.splice(_index, 1);
    } else {
        _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id];
    }
};

watch(
    () => props.data,
    (value) => {
        if (!!value) {
            accessModesOption.value =
                value.provider === 'MODBUS_TCP'
                    ? accessModesMODBUS_TCP
                    : accessModesMODBUS_TCP.concat({
                          label: '订阅',
                          value: 'subscribe',
                      });

            params.value = {
                terms: [
                    {
                        terms: [
                            {
                                column: 'collectorId',
                                value: value.id,
                            },
                        ],
                    },
                ],
            };
        }
    },
    { deep: true, immediate: true },
);

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};
</script>
<style lang="less" scoped>
.card-box {
    min-width: 480px;
    a {
        color: #474747;
    }
    a:hover {
        color: #315efb;
    }
    .card-box-title {
        font-size: 18px;
        color: #474747;
    }
    .card-box-action {
        width: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 20px;
    }
    .card-box-content {
        margin-top: 10px;
        display: flex;
        .card-box-content-left {
            flex: 0.2;
            border-right: 1px solid #e0e4e8;
            height: 68px;
            padding-right: 20px;
            display: flex;
            justify-content: space-between;
        }
        .card-box-content-right {
            flex: 0.8;
            margin-left: 20px;
            .card-box-content-right-1 {
                span {
                    margin: 0 5px 0 0;
                }
                margin-bottom: 10px;
            }
            .card-box-content-right-2 {
                span {
                    margin: 0 5px 0 0;
                    padding: 3px 12px;
                    background: #f3f3f3;
                    color: #616161;
                }
            }
        }
    }
}
</style>
