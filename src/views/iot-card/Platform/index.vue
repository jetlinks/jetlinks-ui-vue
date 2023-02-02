<!-- 平台对接 -->
<template>
    <page-container>
        <Search
            :columns="columns"
            target="platform-search"
            @search="handleSearch"
        />
        <JTable
            ref="platformRef"
            :columns="columns"
            :request="queryList"
            :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
            :params="params"
        >
            <template #headerTitle>
                <a-space>
                    <a-button type="primary" @click="handleAdd">
                        <AIcon type="PlusOutlined" />新增
                    </a-button>
                </a-space>
            </template>
            <template #card="slotProps">
                <CardBox
                    :value="slotProps"
                    :actions="getActions(slotProps, 'card')"
                    v-bind="slotProps"
                    :status="slotProps.state.value"
                    :statusText="slotProps.state.text"
                    :statusNames="{
                        enabled: 'success',
                        disabled: 'error',
                    }"
                >
                    <template #img>
                        <slot name="img">
                            <img :src="getImage('/iot-card/iot-card-bg.png')" />
                        </slot>
                    </template>
                    <template #content>
                        <h3 class="card-item-content-title">
                            {{ slotProps.name }}
                        </h3>
                        <a-row>
                            <a-col :span="12">
                                <div class="card-item-content-text">
                                    平台类型
                                </div>
                                <div>{{ slotProps.operatorName }}</div>
                            </a-col>
                            <a-col :span="12">
                                <div class="card-item-content-text">说明</div>
                                <div>{{ slotProps.explain }}</div>
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
                                        <span>{{ item.text }}</span>
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
                                        <span>{{ item.text }}</span>
                                    </template>
                                </a-button>
                            </template>
                        </a-tooltip>
                    </template>
                </CardBox>
            </template>
            <template #state="slotProps">
                <a-badge
                    :text="slotProps.state.text"
                    :status="
                        slotProps.state.value === 'disabled'
                            ? 'error'
                            : 'success'
                    "
                />
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <a-tooltip
                        v-for="i in getActions(slotProps, 'table')"
                        :key="i.key"
                        v-bind="i.tooltip"
                    >
                        <a-popconfirm v-if="i.popConfirm" v-bind="i.popConfirm">
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
import { getImage } from '@/utils/comm';
import type { ActionsType } from '@/components/Table';
import { message } from 'ant-design-vue';
import { queryList, update, del } from '@/api/iot-card/platform';

const router = useRouter()

const platformRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '平台类型',
        dataIndex: 'operatorName',
        key: 'operatorName',
        search: {
            type: 'select',
            options: [
                { label: '移动OneLink', value: 'onelink' },
                { label: '电信Ctwing', value: 'ctwing' },
                { label: '联通Unicom', value: 'unicom' },
            ],
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        width: 120,
        search: {
            type: 'select',
            options: [
                { label: '启用', value: 'enabled' },
                { label: '禁用', value: 'disabled' },
            ],
        },
    },
    {
        title: '说明',
        dataIndex: 'explain',
        key: 'explain',
        ellipsis: true,
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
    },
];

const statusUpdate = async (data: any) => {
    const res = await update(data);
    if (res.status === 200) {
        message.success('操作成功');
        platformRef.value?.reload();
    }
};

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    return [
        {
            key: 'edit',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: () => {
              router.push(`/iot-card/Platform/detail/${data.id}`);
            },
        },
        {
            key: 'action',
            text: data.state.value === 'enabled' ? '禁用' : '启用',
            tooltip: {
                title: data.state.value === 'enabled' ? '禁用' : '启用',
            },
            icon:
                data.state.value === 'enabled'
                    ? 'StopOutlined'
                    : 'PlayCircleOutlined',
            popConfirm: {
                title: `确认${
                    data.state.value === 'enabled' ? '禁用' : '启用'
                }？`,
                okText: ' 确定',
                cancelText: '取消',
                onConfirm: () => {
                    if (data.state.value === 'enabled') {
                        statusUpdate({
                            id: data.id,
                            config: { ...data.config },
                            state: 'disabled',
                            operatorName: data.operatorName,
                        });
                    } else {
                        statusUpdate({
                            id: data.id,
                            config: { ...data.config },
                            state: 'enabled',
                            operatorName: data.operatorName,
                        });
                    }
                },
            },
        },
        {
            key: 'delete',
            text: '删除',
            tooltip: {
                title:
                    data.state.value !== 'enabled' ? '删除' : '请先禁用再删除',
            },
            disabled: data.state.value === 'enabled',
            popConfirm: {
                title: '确认删除?',
                okText: ' 确定',
                cancelText: '取消',
                onConfirm: async () => {
                    const resp: any = await del(data.id);
                    if (resp.status === 200) {
                        message.success('操作成功！');
                        platformRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
};

const handleSearch = (e: any) => {
    params.value = e;
};

/**
 * 新增
 */
const handleAdd = () => {
  router.push(`/iot-card/Platform/detail/:id`)
};
</script>

<style scoped lang="less"></style>
