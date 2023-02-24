<template>
    <page-container>
        <div>
            <Search
                :columns="query.columns"
                target="device-instance"
                @search="handleSearch"
            ></Search>
            <JTable
                :columns="columns"
                :request="queryList"
                ref="tableRef"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
            >
                <template #headerTitle>
                    <a-space>
                        <a-button type="primary" @click="add"
                            ><plus-outlined />新增</a-button
                        >
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
                                <img
                                    :src="getImage('/alarm/alarm-config.png')"
                                />
                            </slot>
                        </template>
                        <template #content>
                            <h3 style="font-weight: 600">
                                {{ slotProps.name }}
                            </h3>
                            <a-row>
                                <a-col :span="12">
                                    <div class="content-des-title">
                                        关联场景联动
                                    </div>
                                    <div class="rule-desc">
                                        {{ (slotProps?.scene || []).map((item: any) => item?.name).join(',') || '' }}
                                    </div>
                                </a-col>
                                <a-col :span="12">
                                    <div class="content-des-title">
                                        告警级别
                                    </div>
                                    <div class="rule-desc">
                                        {{ (Store.get('default-level') || []).find((item: any) => item?.level === slotProps.level)?.title ||
            slotProps.level }}
                                    </div>
                                </a-col>
                            </a-row>
                        </template>
                        <template #actions="item">
                            <a-tooltip
                                v-bind="item.tooltip"
                                :title="item.disabled && item.tooltip.title"
                                v-if="
                                    item.key != 'trigger' ||
                                    slotProps.sceneTriggerType == 'manual'
                                "
                            >
                                <a-popconfirm
                                    v-if="item.popConfirm"
                                    v-bind="item.popConfirm"
                                    :disabled="item.disabled"
                                    okText="确定"
                                    cancelText="取消"
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
                <template #targetType="slotProps">
                    <span>{{ map[slotProps.targetType] }}</span>
                </template>
                <template #level="slotProps">
                    <a-tooltip
                        placement="topLeft"
                        :title="(Store.get('default-level') || []).find((item: any) => item?.level === slotProps.level)?.title ||
            slotProps.level"
                    >
                        <div class="ellipsis">
                            {{ (Store.get('default-level') || []).find((item: any) => item?.level === slotProps.level)?.title ||
            slotProps.level }}
                        </div>
                    </a-tooltip>
                </template>
                <template #sceneId="slotProps">
                    <span
                        >{{(slotProps?.scene || []).map((item: any) => item?.name).join(',') || ''}}</span
                    >
                </template>
                <template #state="slotProps">
                    <a-badge
                        :text="
                            slotProps.state?.value === 'enabled'
                                ? '正常'
                                : '禁用'
                        "
                        :status="
                            slotProps.state?.value === 'enabled'
                                ? 'success'
                                : 'error'
                        "
                    />
                </template>
                <template #action="slotProps">
                    <a-space :size="16">
                        <a-tooltip
                            v-for="i in getActions(slotProps)"
                            :key="i.key"
                            v-bind="i.tooltip"
                        >
                            <span
                                v-if="
                                    i.key != 'trigger' ||
                                    slotProps.sceneTriggerType == 'manual'
                                "
                            >
                                <a-popconfirm
                                    v-if="i.popConfirm"
                                    v-bind="i.popConfirm"
                                    okText="确定"
                                    cancelText="取消"
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
                            </span>
                        </a-tooltip>
                    </a-space>
                </template>
            </JTable>
        </div>
    </page-container>
</template>

<script lang="ts" setup>
import JTable from '@/components/Table';
import {
    queryList,
    _enable,
    _disable,
    remove,
    _execute,
} from '@/api/rule-engine/configuration';
import { queryLevel } from '@/api/rule-engine/config';
import { Store } from 'jetlinks-store';
import type { ActionsType } from '@/components/Table/index.vue';
import { message } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
const params = ref<Record<string, any>>({});
let isAdd = ref<number>(0);
let title = ref<string>('');
const tableRef = ref<Record<string, any>>({});
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '类型',
        dataIndex: 'targetType',
        key: 'targetType',
        scopedSlots: true,
    },
    {
        title: '告警级别',
        dataIndex: 'level',
        key: 'level',
        scopedSlots: true,
    },
    {
        title: '关联场景联动',
        dataIndex: 'sceneId',
        wdith: 250,
        scopedSlots: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 150,
        scopedSlots: true,
    },
];
const map = {
    product: '产品',
    device: '设备',
    org: '组织',
    other: '其他',
};
const query = {
    columns: [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            search: {
                type: 'string',
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
                        label: '正常',
                        value: 'enabled',
                    },
                    {
                        label: '禁用',
                        value: 'disabled',
                    },
                ],
            },
        },
        {
            title: '说明',
            key: 'description',
            dataIndex: 'description',
            search: {
                type: 'string',
            },
        },
    ],
};
const handleSearch = (e: any) => {
    params.value = e;
};
const queryDefaultLevel = () => {
    queryLevel().then((res) => {
        if (res.status === 200) {
            Store.set('default-level', res.result?.levels || []);
        }
    });
};
queryDefaultLevel();
const getActions = (
    data: Partial<Record<string, any>>,
    type?: 'card' | 'table',
): ActionsType[] => {
    if (!data) {
        return [];
    }
    const actions = [
        {
            key: 'trigger',
            text: '手动触发',
            disabled: data?.state?.value === 'disabled',
            tooltip: {
                title:
                    data?.state?.value === 'disabled'
                        ? '未启用,不能手动触发'
                        : '手动触发',
            },
            popConfirm: {
                title: '确定手动触发？',
                onConfirm: async () => {
                    const scene = (data.scene || [])
                        .filter((item: any) => item?.triggerType === 'manual')
                        .map((i) => {
                            return { id: i?.id };
                        });
                    _execute(scene).then((res) => {
                        if (res.status === 200) {
                            message.success('操作成功');
                            tableRef.value?.reload();
                        } else {
                            message.error('操作失败');
                        }
                    });
                },
            },
            icon: 'LikeOutlined',
        },
        {
            key: 'edit',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },

            icon: 'EditOutlined',
            onClick: () => {
                title.value = '编辑';
                isAdd.value = 2;
                nextTick(() => {});
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'disabled' ? '禁用' : '启用',
            tooltip: {
                title: data.state?.value !== 'disabled' ? '禁用' : '启用',
            },
            icon:
                data.state?.value !== 'disabled'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `${
                    data.state?.value !== 'disabled'
                        ? '禁用告警不会影响关联的场景状态，确定要禁用吗'
                        : '确认启用'
                }?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state?.value === 'disabled') {
                        response = await _enable(data.id);
                    } else {
                        response = await _disable(data.id);
                    }
                    if (response && response.status === 200) {
                        message.success('操作成功！');
                        tableRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: '删除',
            disabled: data?.state?.value !== 'disabled',
            tooltip: {
                title:
                    data?.state?.value !== 'disabled'
                        ? '请先禁用该告警，再删除'
                        : '删除',
            },
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    const resp = await remove(data.id);
                    if (resp.status === 200) {
                        message.success('操作成功！');
                        tableRef.value?.reload();
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
</script>
<style lang="less" scoped>
.content-des-title {
    font-size: 12px;
}
.rule-desc {
    white-space: nowrap; /*强制在同一行内显示所有文本，直到文本结束或者遭遇br标签对象才换行。*/
    overflow: hidden; /*超出部分隐藏*/
    text-overflow: ellipsis; /*隐藏部分以省略号代替*/
}
</style>