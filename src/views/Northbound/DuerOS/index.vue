<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="northbound-dueros"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="instanceRef"
                :columns="columns"
                :request="query"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            type="primary"
                            @click="handleAdd"
                            hasPermission="Northbound/DuerOS:add"
                        >
                            <template #icon
                                ><AIcon type="PlusOutlined"
                            /></template>
                            新增
                        </PermissionButton>
                    </j-space>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        @click="handleView(slotProps.id)"
                        :actions="getActions(slotProps, 'card')"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.text"
                        :statusNames="{
                            enabled: 'processing',
                            disabled: 'error',
                        }"
                    >
                        <template #img>
                            <img :src="getImage('/cloud/dueros.png')" />
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <j-row style="margin-top: 15px">
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        产品
                                    </div>
                                    <Ellipsis>
                                        <div>{{ slotProps?.productName }}</div>
                                    </Ellipsis>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        设备类型
                                    </div>
                                    <Ellipsis>
                                        <div>
                                            {{ slotProps?.applianceType?.text }}
                                        </div>
                                    </Ellipsis>
                                </j-col>
                            </j-row>
                        </template>
                        <template #actions="item">
                            <PermissionButton
                                :disabled="item.disabled"
                                :popConfirm="item.popConfirm"
                                :tooltip="{
                                    ...item.tooltip,
                                }"
                                @click="item.onClick"
                                :hasPermission="'Northbound/DuerOS:' + item.key"
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
                    <BadgeStatus
                        :status="slotProps.state?.value"
                        :text="slotProps.state?.text"
                        :statusNames="{
                            enabled: 'processing',
                            disabled: 'error',
                        }"
                    />
                </template>
                <template #applianceType="slotProps">
                    {{ slotProps.applianceType.text }}
                </template>
                <template #action="slotProps">
                    <j-space>
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
                                style="padding: 0 5px"
                                @click="i.onClick"
                                type="link"
                                :danger="i.key === 'delete'"
                                :hasPermission="
                                    i.key === 'view'
                                        ? true
                                        : 'Northbound/DuerOS:' + i.key
                                "
                            >
                                <template #icon
                                    ><AIcon :type="i.icon"
                                /></template>
                            </PermissionButton>
                        </template>
                    </j-space>
                </template>
            </JProTable>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import {
    query,
    _undeploy,
    _deploy,
    _delete,
    queryProductList,
    queryTypes,
} from '@/api/northbound/dueros';
import type { ActionsType } from '@/views/device/Instance/typings';
import { getImage } from '@/utils/comm';
import { message } from 'jetlinks-ui-components';
import { useMenuStore } from 'store/menu';
import BadgeStatus from '@/components/BadgeStatus/index.vue';

const instanceRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const menuStory = useMenuStore();

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: '产品名称',
        dataIndex: 'productName',
        key: 'productName',
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    queryProductList().then((resp: any) => {
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
        title: '设备类型',
        dataIndex: 'applianceType',
        key: 'applianceType',
        scopedSlots: true,
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    queryTypes().then((resp: any) => {
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
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '正常', value: 'enabled' },
                { label: '禁用', value: 'disabled' },
            ],
        },
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 160,
        scopedSlots: true,
    },
];

/**
 * 新增
 */
const handleAdd = () => {
    menuStory.jumpPage('Northbound/DuerOS/Detail', { id: ':id' });
};

/**
 * 查看
 */
const handleView = (id: string) => {
    menuStory.jumpPage('Northbound/DuerOS/Detail', { id }, { type: 'view' });
};

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'view',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
            onClick: () => {
                handleView(data.id);
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
                menuStory.jumpPage(
                    'Northbound/DuerOS/Detail',
                    { id: data.id },
                    { type: 'edit' },
                );
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'disabled' ? '禁用' : '启用',
            tooltip: {
                title: data.state?.value !== 'disabled' ? '禁用' : '启用',
            },
            icon:
                data.state.value !== 'disabled'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `确认${
                    data.state.value !== 'disabled' ? '禁用' : '启用'
                }?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state.value !== 'disabled') {
                        response = await _undeploy(data.id);
                    } else {
                        response = await _deploy(data.id);
                    }
                    if (response && response.status === 200) {
                        message.success('操作成功！');
                        instanceRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: '删除',
            disabled: data.state?.value !== 'disabled',
            tooltip: {
                title:
                    data.state.value !== 'disabled'
                        ? '请先禁用该数据，再删除。'
                        : '删除',
            },
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    const resp = await _delete(data.id);
                    if (resp.status === 200) {
                        message.success('操作成功！');
                        instanceRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    if (type === 'card')
        return actions.filter((i: ActionsType) => i.key !== 'view');
    return actions;
};

const handleSearch = (_params: any) => {
    params.value = _params;
};
</script>
