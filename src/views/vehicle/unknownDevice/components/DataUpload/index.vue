<template>
    <div>
        <pro-search
            :columns="columns"
            target="dataUpload-config"
            @search="handleSearch"
        ></pro-search>
        <JProTable
            ref="tableRef"
            :columns="columns"
            :request="queryData"
            :defaultParams="{
                sorts: [{ name: 'reportTime', order: 'desc' }],
            }"
            :rowSelection="
                isCheck
                    ? {
                          selectedRowKeys: _selectedRowKeys,
                          onChange: onSelectChange,
                      }
                    : false
            "
            params="globParams"
            :gridColumn="3"
        >
            <template #headerTitle>
                <j-space>
                    <BatchDropdown
                        v-model:isCheck="isCheck"
                        :actions="batchActions"
                        @change="onCheckChange"
                    />
                </j-space>
            </template>
            <template #state="slotProps">
                <BadgeStatus
                    :text="slotProps.state?.text"
                    :status="slotProps.state?.value"
                    :statusNames="statusType"
                />
            </template>
            <template #card="slotProps">
                <CardBox
                    :value="slotProps"
                    :actions="getActions(slotProps, 'card')"
                    @click="handleClick"
                    v-bind="slotProps"
                    :status="slotProps.state?.value"
                    :active="_selectedRowKeys.includes(slotProps.id)"
                    :statusText="slotProps.state?.text"
                    :statusNames="statusType"
                >
                    <template #img>
                        <slot name="img">
                            <img
                                :src="getImage('/scene/trigger-type/scene.png')"
                            />
                        </slot>
                    </template>
                    <template #content>
                        <Ellipsis
                            style="
                                width: calc(100% - 100px);
                                margin-bottom: 18px;
                            "
                        >
                            <span style="font-weight: 600; font-size: 16px">
                                {{ slotProps.title }}
                            </span>
                        </Ellipsis>
                        <j-row :gutter="[24, 12]">
                            <j-col :span="6">
                                <Ellipsis>
                                    <div>设备id</div>
                                </Ellipsis>
                            </j-col>
                            <j-col :span="18">
                                <Ellipsis>
                                    <div>
                                        {{ slotProps.deviceId }}
                                    </div>
                                </Ellipsis>
                            </j-col>
                            <j-col :span="6">
                                <Ellipsis>
                                    <div>所属车辆</div>
                                </Ellipsis>
                            </j-col>
                            <j-col :span="18">
                                <Ellipsis>
                                    <div>
                                        {{ slotProps.vehicleId }}
                                    </div>
                                </Ellipsis>
                            </j-col>
                        </j-row>
                    </template>
                    <template #actions="item">
                        <PermissionButton
                            :popConfirm="item.popConfirm"
                            :tooltip="{ ...item.tooltip }"
                            @click="item.onClick"
                        >
                            <AIcon
                                type="DeleteOutlined"
                                v-if="item.key === 'delete'"
                            />
                            <template v-else>
                                <AIcon :type="item.icon" />
                                <span>{{ item?.text }}</span>
                            </template>
                        </PermissionButton>
                    </template>
                </CardBox>
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
                            :tooltip="{ ...i.tooltip }"
                            @click="i.onClick"
                            type="link"
                            style="padding: 0px"
                            :danger="i.key === 'delete'"
                        >
                            <template #icon><AIcon :type="i.icon" /></template>
                        </PermissionButton>
                    </template>
                </j-space>
            </template>
        </JProTable>
    </div>
</template>

<script setup lang="ts">
import { getImage, onlyMessage } from '@/utils/comm';
import { ActionsType } from '@/components/Table';
import { useMenuStore } from 'store/menu';
import BatchDropdown from '@/components/BatchDropdown/index.vue';
import { BatchActionsType } from '@/components/BatchDropdown/types';

const menuStory = useMenuStore();

const tableRef = ref<Record<string, any>>({});

const isCheck = ref<boolean>(false);

// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

const statusType = {
    known: 'processing',
    unknown: 'error',
};

const _selectedRowKeys = ref<string[]>([]);

const onSelectChange = (keys: string[], rows: []) => {
    _selectedRowKeys.value = [...keys];
};

const onCheckChange = () => {
    _selectedRowKeys.value = [];
};

const columns = [
    {
        title: '名称',
        dataIndex: 'title',
        key: 'title',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '设备id',
        dataIndex: 'deviceId',
        key: 'deviceId',
        ellipsis: true,
        search: {
            type: 'string',
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
                {
                    label: '已知',
                    value: 'known',
                },
                {
                    label: '未知',
                    value: 'unknown',
                },
            ],
        },
    },
    {
        title: '所属车辆',
        dataIndex: 'vehicleId',
        key: 'vehicleId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
    },
];

const handleClick = (dt: any) => {
    if (isCheck.value) {
        if (_selectedRowKeys.value.includes(dt.id)) {
            const _index = _selectedRowKeys.value.findIndex((i) => i === dt.id);
            _selectedRowKeys.value.splice(_index, 1);
        } else {
            _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id];
        }
    }
};

const queryData = async () => {
    const data: any[] = [];
    for (let i = 0; i < 12; i++) {
        data.push({
            id: `${i}`,
            title: `边缘网关${i}`,
            deviceId: `0000${i}`,
            state:
                i / 2 == 0
                    ? {
                          text: '已知',
                          value: 'known',
                      }
                    : {
                          text: '未知',
                          value: 'unknown',
                      },
            vehicleId: `所属车辆${i}`,
        });
    }

    return new Promise((resolve, reject) => {
        resolve({
            message: 'success',
            result: {
                pageIndex: 0,
                pageSize: 12,
                total: 12,
                data: data,
            },
            status: 200,
        });
    });
};

const handleSearch = (params: any) => {
    globParams.value = params;
};
const getActions = (
    data: Partial<Record<string, any>>,
    type?: 'card' | 'table',
): ActionsType[] => {
    if (!data) {
        return [];
    }
    const actions = [
        {
            key: 'update',
            text: '不接收数据',
            tooltip: {
                title: '不接收数据',
            },

            icon: 'ShareAltOutlined',
            onClick: () => {},
        },
        {
            key: 'Record',
            text: '异常记录',
            tooltip: {
                title: '异常记录',
            },
            icon: 'MonitorOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'vehicle/unknownDevice/AbnormalRecord',
                    {},
                    {
                        id: data.id,
                    },
                );
            },
        },

        {
            key: 'delete',
            text: '删除',
            tooltip: {
                title: '删除',
            },
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {},
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};

const handelRemove = async () => {
    if (!_selectedRowKeys.value.length) {
        onlyMessage('请选择数据', 'error');
        return;
    }
    //删除

    onlyMessage('操作成功');
    //清空已选择
    _selectedRowKeys.value = [];
    //恢复状态
    isCheck.value = false;
    tableRef.value?.reload();
};

const batchActions: BatchActionsType[] = [
    {
        key: 'export',
        text: '批量删除',
        icon: 'ExportOutlined',
        selected: {
            popConfirm: {
                title: '确认删除吗？',
                onConfirm: handelRemove,
            },
        },
    },
];
</script>

<style lang="less" scoped></style>
