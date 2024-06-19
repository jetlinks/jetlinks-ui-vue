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
            params="globParams"
            :gridColumn="3"
        >
            <template #headerTitle>
                <j-space>
                    <PermissionButton type="primary" @click="handleClick">
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        批量操作
                    </PermissionButton>
                </j-space>
            </template>
            <template #state="slotProps">
                <BadgeStatus
                    :text="slotProps.state?.text"
                    :status="slotProps.state?.value"
                    :statusNames="{
                        known: 'processing',
                        unknown: 'error',
                    }"
                />
            </template>
            <template #card="slotProps">
                <CardBox
                    :value="slotProps"
                    :actions="getActions(slotProps, 'card')"
                    v-bind="slotProps"
                    :status="slotProps.state?.value"
                    :statusText="slotProps.state?.text"
                    :statusNames="{
                        known: 'processing',
                        unknown: 'error',
                    }"
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
                        <j-row :gutter="[24, 24]">
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
                        </j-row>
                        <j-row :gutter="[24, 24]">
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
                            :tooltip="{
                                ...item.tooltip,
                            }"
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
                            :tooltip="{
                                ...i.tooltip,
                            }"
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
const tableRef = ref<InstanceType<typeof PTable>>();
import { getImage } from '@/utils/comm';
import PTable from '@/components/PTable/index.vue';
import { ActionsType } from '@/components/Table';
import { useMenuStore } from 'store/menu';
const menuStory = useMenuStore();
// 全局的搜索参数
const globParams = ref<Record<string, any>>({});
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

const handleClick = () => {};

const queryData = async () => {
    const data = [];
    for (let i = 0; i < 12; i++) {
        data.push({
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
    return {
        message: 'success',
        result: {
            pageIndex: 0,
            pageSize: 12,
            total: 12,
            data: data,
        },
        status: 200,
    };
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
                menuStory.jumpPage('vehicle/unknownDevice/AbnormalRecord', {
                    id: '12312',
                });
            },
        },

        {
            key: 'delete',
            text: '移除',
            tooltip: {
                title: '移除',
            },
            popConfirm: {
                title: '确认移除?',
                onConfirm: async () => {},
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};
</script>

<style lang="less" scoped></style>
