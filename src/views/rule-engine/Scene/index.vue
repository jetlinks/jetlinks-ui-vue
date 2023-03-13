<template>
    <page-container>
        <pro-search :columns="columns" target="scene" @search="handleSearch" />
        <JProTable
            ref="sceneRef"
            :columns="columns"
            :request="query"
            :defaultParams="{ sorts: [{ name: 'createTime', order: 'desc' }] }"
            :params="params"
        >
            <template #headerTitle>
                <j-space>
                    <PermissionButton
                        type="primary"
                        @click="handleAdd"
                        hasPermission="device/Instance:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        新增
                    </PermissionButton>
                </j-space>
            </template>
            <template #card="slotProps">
                <SceneCard
                    :value="slotProps"
                    :actions="getActions(slotProps, 'card')"
                    :status="slotProps.state?.value"
                    :statusText="slotProps.state?.text"
                    :statusNames="{
                        started: 'success',
                        disable: 'error',
                    }"
                >
                    <template #type>
                        <span
                            ><img
                                :height="16"
                                :src="typeMap.get(slotProps.triggerType)?.icon"
                                style="margin-right: 5px"
                            />{{
                                typeMap.get(slotProps.triggerType)?.text
                            }}</span
                        >
                    </template>
                    <template #img>
                        <img :src="typeMap.get(slotProps.triggerType)?.img" />
                    </template>
                    <template #title>
                        <Ellipsis style="width: calc(100% - 100px)">
                            <span
                                style="font-size: 16px; font-weight: 600"
                                @click.stop="handleView(slotProps.id, slotProps.triggerType)"
                            >
                                {{ slotProps.name }}
                            </span>
                        </Ellipsis>
                    </template>
                    <template #subTitle>
                        <Ellipsis :lineClamp="2">
                            说明：{{
                                slotProps?.description ||
                                typeMap.get(slotProps.triggerType)?.tip
                            }}
                        </Ellipsis>
                    </template>
                    <template #actions="item">
                        <PermissionButton
                            :disabled="item.disabled"
                            :popConfirm="item.popConfirm"
                            :tooltip="{
                                ...item.tooltip,
                            }"
                            @click="item.onClick"
                            :hasPermission="'rule-engine/Scene:' + item.key"
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
                </SceneCard>
            </template>
            <template #triggerType="slotProps">
                {{ typeMap.get(slotProps.triggerType)?.text }}
            </template>
            <template #state="slotProps">
                <j-badge
                    :text="slotProps.state?.text"
                    :status="statusMap.get(slotProps.state?.value)"
                />
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
                            @click="i.onClick"
                            type="link"
                            style="padding: 0px"
                            :hasPermission="'rule-engine/Scene:' + i.key"
                        >
                            <template #icon><AIcon :type="i.icon" /></template>
                        </PermissionButton>
                    </template>
                </j-space>
            </template>
        </JProTable>
        <SaveModal v-if="visible" @close="visible = false" :data="current" />
    </page-container>
</template>

<script setup lang='ts' name='Scene'>
import SaveModal from './Save/save.vue';
import type { SceneItem } from './typings';
import { useMenuStore } from 'store/menu';
import { query, _delete, _action, _execute } from '@/api/rule-engine/scene';
import { message } from 'ant-design-vue';
import type { ActionsType } from '@/components/Table';
import { getImage } from '@/utils/comm';
import SceneCard from './SceneCard.vue';

const menuStory = useMenuStore();
const visible = ref<boolean>(false);
const current = ref<Record<string, any>>({});

const statusMap = new Map();
statusMap.set('started', 'success');
statusMap.set('disable', 'error');

const params = ref<Record<string, any>>({});
const sceneRef = ref<Record<string, any>>({});

const typeMap = new Map();
typeMap.set('manual', {
    text: '手动触发',
    img: getImage('/scene/scene-hand.png'),
    icon: getImage('/scene/trigger-type-icon/manual.png'),
    tip: '适用于第三方平台向物联网平台下发指令控制设备',
});
typeMap.set('timer', {
    text: '定时触发',
    img: getImage('/scene/scene-timer.png'),
    icon: getImage('/scene/trigger-type-icon/timing.png'),
    tip: '适用于定期执行固定任务',
});
typeMap.set('device', {
    text: '设备触发',
    img: getImage('/scene/scene-device.png'),
    icon: getImage('/scene/trigger-type-icon/device.png'),
    tip: '适用于设备数据或行为满足触发条件时，执行指定的动作',
});

const columns = [
    {
        dataIndex: 'name',
        fixed: 'left',
        ellipsis: true,
        width: 300,
        title: '名称',
        search: {
            type: 'string',
        },
    },
    {
        dataIndex: 'triggerType',
        title: '触发方式',
        scopedSlots: true,
        search: {
            type: 'select',
            options: Array.from(typeMap).map((item) => {
                return {
                    label: item[1]?.text,
                    value: item[0],
                }
            }),
        },
    },
    {
        dataIndex: 'state',
        title: '状态',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: '正常', value: 'started' },
                { label: '禁用', value: 'disable' },
            ],
        },
    },
    {
        dataIndex: 'description',
        title: '说明',
        search: {
            type: 'string',
        },
        scopedSlots: true,
    },
    {
        title: '操作',
        key: 'action',
        fixed: 'right',
        width: 250,
        scopedSlots: true,
    },
];

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions: ActionsType[] = [
        {
            key: 'update',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: () => {
                visible.value = true;
                current.value = data;
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'disable' ? '禁用' : '启用',
            tooltip: {
                title: !(!!data.triggerType && (data.branches || [])?.length)
                    ? '未配置规则的不能启用'
                    : data.state?.value !== 'disable'
                    ? '禁用'
                    : '启用',
            },
            disabled: !(!!data?.triggerType && (data?.branches || [])?.length),
            icon:
                data.state.value !== 'disable'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `确认${
                    data.state.value !== 'disable' ? '禁用' : '启用'
                }?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state.value !== 'disable') {
                        response = await _action(data.id, '_disable');
                    } else {
                        response = await _action(data.id, '_enable');
                    }
                    if (response && response.status === 200) {
                        message.success('操作成功！');
                        sceneRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: '删除',
            disabled: data.state?.value !== 'disable',
            tooltip: {
                title:
                    data.state.value !== 'disable'
                        ? '请先禁用该场景,再删除'
                        : '删除',
            },
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    const resp = await _delete(data.id);
                    if (resp.status === 200) {
                        message.success('操作成功！');
                        sceneRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    if (data.triggerType === 'manual') {
        const _item: ActionsType = {
            key: 'trigger',
            text: '手动触发',
            disabled: data.state?.value === 'disable',
            tooltip: {
                title:
                    data.state.value !== 'disable'
                        ? '手动触发'
                        : '未启用，不能手动触发',
            },
            icon: 'LikeOutlined',
            popConfirm: {
                title: '',
                onConfirm: async () => {
                    const resp = await _execute(data.id)
                    if (resp.status === 200) {
                        message.success('操作成功！');
                        sceneRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                }
            }
        };
        actions.splice(1, 0, _item);
    }
    if (type === 'table') {
        actions.splice(0, 0, {
            key: 'view',
            text: '查看',
            tooltip: {
                title: '查看',
            },
            icon: 'EyeOutlined',
            onClick: () => {
                handleView(data.id, data.triggerType);
            },
        });
    }
    return actions;
};

const handleSearch = (_params: any) => {
    params.value = _params;
};

const handleAdd = () => {
    visible.value = true;
    current.value = {};
};

/**
 * 编辑
 * @param id
 * @param triggerType 触发类型
 */
const handleEdit = (id: string, triggerType: string) => {
    menuStory.jumpPage(
        'rule-engine/Scene/Save',
        {},
        { triggerType: triggerType, id, type: 'edit' },
    );
};

/**
 * 查看
 * @param id
 * @param triggerType 触发类型
 */
const handleView = (id: string, triggerType: string) => {
    menuStory.jumpPage(
        'rule-engine/Scene/Save',
        {},
        { triggerType: triggerType, id, type: 'view' },
    );
};
</script>

<style scoped>
</style>