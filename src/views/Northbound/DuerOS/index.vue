<template>
    <page-container>
        <Search
            :columns="columns"
            target="northbound-dueros"
            @search="handleSearch"
        />
        <JTable
            ref="instanceRef"
            :columns="columns"
            :request="query"
            :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
            :params="params"
        >
            <template #headerTitle>
                <a-space>
                    <a-button type="primary" @click="handleAdd">新增</a-button>
                </a-space>
            </template>
            <template #card="slotProps">
                <CardBox
                    :value="slotProps"
                    :actions="getActions(slotProps, 'card')"
                    v-bind="slotProps"
                    :status="slotProps.state?.value"
                    :statusText="slotProps.state?.text"
                    :statusNames="{
                        enabled: 'success',
                        disabled: 'error',
                    }"
                >
                    <template #img>
                        <slot name="img">
                            <img :src="getImage('/cloud/dueros.png')" />
                        </slot>
                    </template>
                    <template #content>
                        <h3
                            class="card-item-content-title"
                            @click.stop="handleView(slotProps.id)"
                        >
                            {{ slotProps.name }}
                        </h3>
                        <a-row>
                            <a-col :span="12">
                                <div class="card-item-content-text">产品</div>
                                <div>{{ slotProps?.productName }}</div>
                            </a-col>
                            <a-col :span="12">
                                <div class="card-item-content-text">
                                    设备类型
                                </div>
                                <div>{{ slotProps?.applianceType?.text }}</div>
                            </a-col>
                        </a-row>
                    </template>
                    <template #actions="item">
                        <a-tooltip
                            v-bind="item.tooltip"
                            :title="item.disabled && item.tooltip.title"
                        >
                            <a-popconfirm
                                v-if="item.popConfirm"
                                v-bind="item.popConfirm"
                                :disabled="item.disabled"
                            >
                                <a-button :disabled="item.disabled">
                                    <AIcon
                                        type="DeleteOutlined"
                                        v-if="item.key === 'delete'"
                                    />
                                    <template v-else>
                                        <AIcon :type="item.icon" />
                                        <span>{{ item?.text }}</span>
                                    </template>
                                </a-button>
                            </a-popconfirm>
                            <template v-else>
                                <a-button
                                    :disabled="item.disabled"
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
                                </a-button>
                            </template>
                        </a-tooltip>
                    </template>
                </CardBox>
            </template>
            <template #state="slotProps">
                <a-badge
                    :text="slotProps.state?.text"
                    :status="statusMap.get(slotProps.state?.value)"
                />
            </template>
            <template #applianceType="slotProps">
                {{ slotProps.applianceType.text }}
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <a-tooltip
                        v-for="i in getActions(slotProps, 'table')"
                        :key="i.key"
                        v-bind="i.tooltip"
                    >
                        <a-popconfirm
                            v-if="i.popConfirm"
                            v-bind="i.popConfirm"
                            :disabled="i.disabled"
                        >
                            <a-button
                                :disabled="i.disabled"
                                style="padding: 0"
                                type="link"
                                ><AIcon :type="i.icon"
                            /></a-button>
                        </a-popconfirm>
                        <a-button
                            style="padding: 0"
                            type="link"
                            v-else
                            @click="i.onClick && i.onClick(slotProps)"
                        >
                            <a-button
                                :disabled="i.disabled"
                                style="padding: 0"
                                type="link"
                                ><AIcon :type="i.icon"
                            /></a-button>
                        </a-button>
                    </a-tooltip>
                </a-space>
            </template>
        </JTable>
    </page-container>
</template>

<script setup lang="ts">
import { query, _undeploy, _deploy, _delete, queryProductList, queryTypes } from '@/api/northbound/dueros';
import type { ActionsType } from '@/components/Table/index.vue';
import { getImage } from '@/utils/comm';
import { message } from 'ant-design-vue';
import { useMenuStore } from 'store/menu'

const router = useRouter();
const instanceRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});
const current = ref<Record<string, any>>({});
const menuStory = useMenuStore()

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
        dataIndex: 'describe',
        key: 'describe',
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
        width: 250,
        scopedSlots: true,
    },
];

/**
 * 新增
 */
const handleAdd = () => {
  menuStory.jumpPage('Northbound/DuerOS/Detail', { id: ':id'})
};

/**
 * 查看
 */
const handleView = (id: string) => {
  menuStory.jumpPage('Northbound/DuerOS/Detail', { id }, { type: 'view' })
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
            key: 'edit',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: () => {
              menuStory.jumpPage('Northbound/DuerOS/Detail', { id: data.id }, { type: 'edit' })
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'disabled' ? '禁用' : '启用',
            tooltip: {
                title: data.state?.value !== 'disabled' ? '禁用' : '启用',
            },
            icon:
                data.state.value !== 'notActive'
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
