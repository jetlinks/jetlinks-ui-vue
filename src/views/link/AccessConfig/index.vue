<template>
    <page-container>
        <div>
            <pro-search
                :columns="columns"
                target="search"
                @search="handleSearch"
            />
            <j-pro-table
                ref="tableRef"
                model="CARD"
                :columns="columns"
                :request="list"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                gridColumn="2"
                :gridColumns="[1, 2]"
                :params="params"
            >
                <template #headerTitle>
                    <PermissionButton
                        type="primary"
                        @click="handlAdd"
                        hasPermission="link/AccessConfig:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        新增
                    </PermissionButton>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :showStatus="true"
                        :value="slotProps"
                        :actions="getActions(slotProps)"
                        v-bind="slotProps"
                        :class="
                            slotProps.state.value === 'disabled'
                                ? 'tableCardDisabled'
                                : 'tableCardEnabled'
                        "
                        :status="slotProps.state.value"
                        :statusText="slotProps.state.text"
                        :statusNames="{
                            enabled: 'success',
                            disabled: 'error',
                        }"
                    >
                        <template #img>
                            <slot name="img">
                                <img :src="getImage('/device-access.png')" />
                            </slot>
                        </template>
                        <template #content>
                            <div class="card-item-content">
                                <PermissionButton
                                    type="link"
                                    @click="handlEye(slotProps.id)"
                                    hasPermission="link/AccessConfig:view"
                                    :style="TiTlePermissionButtonStyle"
                                >
                                    {{ slotProps.name }}
                                </PermissionButton>

                                <j-row class="card-item-content-box">
                                    <j-col
                                        :span="12"
                                        v-if="slotProps.channelInfo"
                                        class="card-item-content-text"
                                    >
                                        <div class="card-item-content-text">
                                            {{ slotProps.channelInfo.name }}
                                        </div>
                                        <div
                                            class="card-item-content-text"
                                            v-if="
                                                slotProps.channelInfo.addresses
                                            "
                                        >
                                            <j-badge
                                                :status="getStatus(slotProps)"
                                            />
                                            <j-tooltip>
                                                <template #title>{{
                                                    slotProps.channelInfo
                                                        .addresses[0].address
                                                }}</template>
                                                {{
                                                    slotProps.channelInfo
                                                        .addresses[0].address
                                                }}
                                            </j-tooltip>
                                        </div>
                                    </j-col>
                                    <j-col
                                        :span="12"
                                        v-if="slotProps.protocolDetail"
                                    >
                                        <div class="card-item-content-text">
                                            协议
                                        </div>
                                        <div class="card-item-content-text">
                                            <j-tooltip>
                                                <template #title>{{
                                                    slotProps.protocolDetail
                                                        .name
                                                }}</template>
                                                {{
                                                    slotProps.protocolDetail
                                                        .name
                                                }}
                                            </j-tooltip>
                                        </div>
                                    </j-col>
                                </j-row>
                                <j-row>
                                    <j-col :span="24">
                                        <div class="card-item-content-text">
                                            <j-tooltip>
                                                <template #title>
                                                    {{
                                                        getDescription(
                                                            slotProps,
                                                        )
                                                    }}
                                                </template>
                                                {{ getDescription(slotProps) }}
                                            </j-tooltip>
                                        </div>
                                    </j-col>
                                </j-row>
                            </div>
                        </template>

                        <template #actions="item">
                            <PermissionButton
                                :disabled="item.disabled"
                                :popConfirm="item.popConfirm"
                                :tooltip="{
                                    ...item.tooltip,
                                }"
                                @click="item.onClick"
                                :hasPermission="'link/AccessConfig:' + item.key"
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
                <template #state="slotProps">
                    <j-badge
                        :text="slotProps.state.text"
                        :status="statusMap.get(slotProps.state.value)"
                    />
                </template>
            </j-pro-table>
        </div>
    </page-container>
</template>
<script lang="ts" setup name="AccessConfigPage">
import type { ActionsType } from '@/components/Table/index';
import { getImage } from '@/utils/comm';
import {
    list,
    getProviders,
    remove,
    undeploy,
    deploy,
} from '@/api/link/accessConfig';
import { onlyMessage } from '@/utils/comm';
import { useMenuStore } from 'store/menu';
import { TiTlePermissionButtonStyle } from './data';

const menuStory = useMenuStore();
const tableRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

let providersList = ref<Record<string, any>>([]);

const statusMap = new Map();
statusMap.set('enabled', 'success');
statusMap.set('disabled', 'error');

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        // scopedSlots: true,
    },
    {
        title: '网关类型',
        dataIndex: 'provider',
        key: 'provider',
        search: {
            type: 'select',
            options: async () => {
                const res = await getProviders();
                return (res?.result || []).map((item) => ({
                    lable: item.name,
                    value: item.id,
                }));
            },
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                {
                    label: '禁用',
                    value: 'disabled',
                },
                {
                    label: '正常',
                    value: 'enabled',
                },
            ],
        },
        scopedSlots: true,
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
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
    const state = data.state.value;
    const stateText = state === 'enabled' ? '禁用' : '启用';
    return [
        {
            key: 'update',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: async () => {
                handlEdit(data.id);
            },
        },
        {
            key: 'action',
            text: stateText,
            tooltip: {
                title: stateText,
            },
            icon: state === 'enabled' ? 'StopOutlined' : 'CheckCircleOutlined',
            popConfirm: {
                title: `确认${stateText}?`,
                onConfirm: async () => {
                    let res =
                        state === 'enabled'
                            ? await undeploy(data.id)
                            : await deploy(data.id);

                    if (res.success) {
                        onlyMessage('操作成功', 'success');
                        tableRef.value?.reload();
                    }
                },
            },
        },
        {
            key: 'delete',
            text: '删除',
            disabled: state === 'enabled',
            tooltip: {
                title: state === 'enabled' ? '已启用的设备不能删除' : '删除',
            },
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    const res = await remove(data.id);
                    if (res.success) {
                        onlyMessage('操作成功', 'success');
                        tableRef.value.reload();
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
};

const getProvidersList = async () => {
    const res: any = await getProviders();
    providersList.value = res.result;
};
getProvidersList();

const handlAdd = () => {
    menuStory.jumpPage(
        `link/AccessConfig/Detail`,
        { id: ':id' },
        { view: false },
    );
};
const handlEdit = (id: string) => {
    menuStory.jumpPage(`link/AccessConfig/Detail`, { id }, { view: false });
};
const handlEye = (id: string) => {
    menuStory.jumpPage(`link/AccessConfig/Detail`, { id }, { view: true });
};

const getDescription = (slotProps: Record<string, any>) =>
    slotProps.description
        ? slotProps.description
        : providersList.value?.find(
              (item: Record<string, any>) => item.id === slotProps.provider,
          )?.description;

const getStatus = (slotProps: Record<string, any>) =>
    slotProps.channelInfo.addresses[0].health === -1 ? 'error' : 'success';

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};
</script>
<style lang="less" scoped>
.table {
    max-height: 700px;
    overflow-y: auto;
    overflow-x: hidden;
}

.tableCardDisabled {
    width: 100%;
    background: url('/images/access-config-diaabled.png') no-repeat;
    background-size: 100% 100%;
}

.tableCardEnabled {
    width: 100%;
    background: url('/images/access-config-enabled.png') no-repeat;
    background-size: 100% 100%;
}

.card-item-content {
    min-height: 100px;

    .card-item-content-title-a {
        color: #1890ff !important;
        font-weight: 700;
        font-size: 16px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
    }
    .card-item-content-box {
        min-height: 50px;
    }
    .card-item-content-text {
        color: rgba(0, 0, 0, 0.75);
        font-size: 12px;
        overflow: hidden; //超出的文本隐藏
        text-overflow: ellipsis; //溢出用省略号显示
        white-space: nowrap; //溢出不换行
    }
}
</style>
