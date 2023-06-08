<template>
    <page-container>
        <div>
            <pro-search
                :columns="columns"
                target="device-instance"
                @search="handleSearch"
            />
            <FullPage>
                <JProTable
                    :columns="columns"
                    :request="queryList"
                    :gridColumn="3"
                    :gridColumns="[1, 2, 3]"
                    ref="tableRef"
                    :defaultParams="{
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }"
                    :params="params"
                >
                    <template #headerTitle>
                        <j-space>
                            <PermissionButton
                                type="primary"
                                @click="add"
                                hasPermission="rule-engine/Alarm/Configuration:add"
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
                            :actions="getActions(slotProps, 'card')"
                            v-bind="slotProps"
                            :status="slotProps.state?.value"
                            :statusText="slotProps.state?.text"
                            :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
                            @click="
                                () => {
                                    menuStory.jumpPage(
                                        'rule-engine/Alarm/Configuration/Save',
                                        {},
                                        { id: slotProps.id },
                                    );
                                }
                            "
                        >
                            <template #img>
                                <slot name="img">
                                    <img
                                        :src="
                                            getImage('/alarm/alarm-config.png')
                                        "
                                    />
                                </slot>
                            </template>
                            <template #content>
                                <Ellipsis style="width: calc(100% - 100px)">
                                    <span
                                        style="
                                            font-weight: 600;
                                            font-size: 16px;
                                        "
                                    >
                                        {{ slotProps.name }}
                                    </span>
                                </Ellipsis>
                                <j-row>
                                    <j-col :span="12">
                                        <div class="content-des-title">
                                            关联场景联动
                                        </div>
                                        <Ellipsis style='margin-bottom: 18px;'
                                            ><div>
                                                {{ (slotProps?.scene || []).map((item: any) => item?.name).join(',') || '' }}
                                            </div></Ellipsis
                                        >
                                    </j-col>
                                    <j-col :span="12">
                                        <div class="content-des-title">
                                            告警级别
                                        </div>
                                        <div>
                                            {{ (Store.get('default-level') || []).find((item: any) => item?.level === slotProps.level)?.title ||
            slotProps.level }}
                                        </div>
                                    </j-col>
                                </j-row>
                            </template>
                            <template #actions="item">
                                <PermissionButton
                                    :disabled="item.disabled"
                                    :popConfirm="item.popConfirm"
                                    :tooltip="{ ...item.tooltip }"
                                    @click="item.onClick"
                                    :hasPermission="
                                        'rule-engine/Alarm/Configuration:' +
                                        item.key
                                    "
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
                    <template #targetType="slotProps">
                        <span>{{ map[slotProps.targetType] }}</span>
                    </template>
                    <template #level="slotProps">
                        <j-tooltip
                            placement="topLeft"
                            :title="(Store.get('default-level') || []).find((item) => item?.level === slotProps.level)?.title ||
            slotProps.level"
                        >
                            <div class="ellipsis">
                                {{ (Store.get('default-level') || []).find((item) => item?.level === slotProps.level)?.title ||
            slotProps.level }}
                            </div>
                        </j-tooltip>
                    </template>
                    <template #scene="slotProps">
                        <span
                            >{{(slotProps?.scene || []).map((item) => item?.name).join(',') || ''}}</span
                        >
                    </template>
                    <template #state="slotProps">
                        <BadgeStatus
                            :text="
                                slotProps.state?.value === 'enabled'
                                    ? '正常'
                                    : '禁用'
                            "
                            :status="slotProps.state?.value"
                            :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
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
                                    :hasPermission="
                                        'rule-engine/Alarm/Configuration:' +
                                        i.key
                                    "
                                    :danger="i.key === 'delete'"
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
        </div>
    </page-container>
</template>

<script lang="ts" setup>
import {
    queryList,
    _enable,
    _disable,
    remove,
    _execute,
    getScene,
} from '@/api/rule-engine/configuration';
import { queryLevel } from '@/api/rule-engine/config';
import { Store } from 'jetlinks-store';
import type { ActionsType } from '@/components/Table/index.vue';
import { message } from 'jetlinks-ui-components';
import { getImage } from '@/utils/comm';
import { useMenuStore } from '@/store/menu';
import encodeQuery from '@/utils/encodeQuery';
const params = ref<Record<string, any>>({});
let isAdd = ref<number>(0);
let title = ref<string>('');
const tableRef = ref<Record<string, any>>({});
const menuStory = useMenuStore();
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        width: 220,
        ellipsis: true,
    },
    {
        title: '类型',
        dataIndex: 'targetType',
        key: 'targetType',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                {
                    label: '产品',
                    value: 'product',
                },
                {
                    label: '设备',
                    value: 'device',
                },
                {
                    label: '组织',
                    value: 'org',
                },
                {
                    label: '其他',
                    value: 'other',
                },
            ],
        },
        width: 100,
    },
    {
        title: '告警级别',
        dataIndex: 'level',
        key: 'level',
        scopedSlots: true,
        search: {
            type: 'select',
            options: async () => {
                const res = await queryLevel();
                if (res.status === 200) {
                    return (res?.result?.levels || [])
                        .filter((i: any) => i?.level && i?.title)
                        .map((item: any) => ({
                            label: item.title,
                            value: item.level,
                        }));
                }
                return [];
            },
        },
        width: 200,
        ellipsis: true,
    },
    {
        title: '关联场景联动',
        dataIndex: 'scene',
        scopedSlots: true,
        key: 'scene',
        search: {
            type: 'select',
            // defaultTermType: 'rule-bind-alarm',
            options: async () => {
                const res = await getScene(
                    encodeQuery({
                        sorts: { createTime: 'desc' },
                    }),
                );
                if (res.status === 200) {
                    return res.result.map((item: any) => ({
                        label: item.name,
                        value: item.id,
                    }));
                }
                return [];
            },
        },
        width: 220,
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
        width: 90,
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 120,
        scopedSlots: true,
    },
];
const map = {
    product: '产品',
    device: '设备',
    org: '组织',
    other: '其他',
};
const handleSearch = (e: any) => {
    const _terms = (e?.terms || []).map((item: any) => {
        item.terms = item.terms.map((i: any) => {
            if(i.column === 'scene'){
                return {
                    ...i,
                    termType: 'rule-bind-alarm',
                    column: 'id'
                }
            }
            return i
        })
        return item
    })
    params.value = {
        ...e,
        terms: _terms
    }
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
            key: 'tigger',
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
            key: 'update',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },

            icon: 'EditOutlined',
            onClick: () => {
                menuStory.jumpPage(
                    'rule-engine/Alarm/Configuration/Save',
                    {},
                    { id: data.id },
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
    return actions.filter(
        (item) => item.key != 'tigger' || data.sceneTriggerType == 'manual',
    );
};
const add = () => {
    menuStory.jumpPage('rule-engine/Alarm/Configuration/Save');
};
</script>
<style lang="less" scoped>
.content-des-title {
    font-size: 12px;
}
</style>