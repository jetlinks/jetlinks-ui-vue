<template>
    <page-container>
        <div>
            <pro-search
                :columns="query.columns"
                target="rule-engine-instance"
                @search="handleSearch"
            />
            <FullPage>
                <JProTable
                    :columns="columns"
                    :request="queryList"
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
                                hasPermission="rule-engine/Instance:add"
                            >
                                <template #icon
                                    ><AIcon type="PlusOutlined"
                                /></template>
                                {{ $t('Instance.index.052151-0') }}
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
                            @click="openRuleEditor"
                            :statusNames="{
                                started: 'processing',
                                disable: 'error',
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
                                <Ellipsis style="width: calc(100% - 100px); margin-bottom: 18px;">
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
                                        <Ellipsis>
                                            <div>
                                                {{ slotProps.description }}
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
                                    :hasPermission="
                                        'rule-engine/Instance:' + item.key
                                    "
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
                    <template #state="slotProps">
                        <BadgeStatus
                            :text="
                                slotProps.state?.value === 'started'
                                    ? $t('Instance.index.052151-1')
                                    : $t('Instance.index.052151-2')
                            "
                            :status="slotProps.state?.value"
                            :statusNames="{
                                started: 'processing',
                                disable: 'error',
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
                                        'rule-engine/Instance:' + i.key
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
            <!-- {{ $t('Instance.index.052151-0') }}、{{ $t('Instance.index.052151-7') }} -->
            <Save
                :data="current"
                @success="refresh"
                v-if="visiable"
                @close-save="closeSave"
            />
        </div>
    </page-container>
</template>

<script lang="ts" setup>
import {
    queryList,
    startRule,
    stopRule,
    deleteRule,
} from '@/api/rule-engine/instance';
import type { ActionsType } from '@/components/Table/index.vue';
import { getImage, onlyMessage } from '@/utils/comm';
import Save from './Save/index.vue';
import { SystemConst } from '@/utils/consts';
import { useRouterParams } from '@/utils/hooks/useParams';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const params = ref<Record<string, any>>({});
let visiable = ref(false);
const tableRef = ref<Record<string, any>>({});
const { params: routeParams } = useRouterParams();
const query = {
    columns: [
        {
            title: $t('Instance.index.052151-3'),
            dataIndex: 'name',
            key: 'name',
            search: {
                type: 'string',
            },
        },
        {
            title: $t('Instance.index.052151-4'),
            dataIndex: 'state',
            key: 'state',
            search: {
                type: 'select',
                options: [
                    {
                        label: $t('Instance.index.052151-1'),
                        value: 'started',
                    },
                    {
                        label: $t('Instance.index.052151-2'),
                        value: 'disable',
                    },
                ],
            },
        },
        {
            title: $t('Instance.index.052151-5'),
            key: 'description',
            dataIndex: 'description',
            search: {
                type: 'string',
            },
        },
    ],
};
const columns = [
    {
        title: $t('Instance.index.052151-3'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
    },
    {
        title: $t('Instance.index.052151-4'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
    },
    {
        title: $t('Instance.index.052151-5'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
    {
        title: $t('Instance.index.052151-6'),
        key: 'action',
        fixed: 'right',
        width: 150,
        scopedSlots: true,
    },
];
const current = ref();
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
            text: $t('Instance.index.052151-7'),
            tooltip: {
                title: $t('Instance.index.052151-7'),
            },

            icon: 'EditOutlined',
            onClick: () => {
                current.value = data;
                visiable.value = true;
            },
        },
        {
            key: 'view',
            text: $t('Instance.index.052151-8'),
            tooltip: {
                title: $t('Instance.index.052151-8'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                openRuleEditor(data);
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'disable' ? $t('Instance.index.052151-16') : $t('Instance.index.052151-9'),
            tooltip: {
                title: data.state?.value !== 'disable' ? $t('Instance.index.052151-16') : $t('Instance.index.052151-9'),
            },
            icon:
                data.state?.value !== 'disable'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `${data.state.value !== 'disable' ? $t('Instance.index.052151-17') : $t('Instance.index.052151-10')}?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state?.value !== 'started') {
                        response = await startRule(data.id);
                    } else {
                        response = await stopRule(data.id);
                    }
                    if (response && response.status === 200) {
                        onlyMessage($t('Instance.index.052151-11'));
                        tableRef.value?.reload();
                    } else {
                        onlyMessage($t('Instance.index.052151-12'), 'error');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: $t('Instance.index.052151-13'),
            disabled: data?.state?.value !== 'disable',
            tooltip: {
                title:
                    data?.state?.value !== 'disable'
                        ? $t('Instance.index.052151-14')
                        : $t('Instance.index.052151-13'),
            },
            popConfirm: {
                title: $t('Instance.index.052151-15'),
                onConfirm: async () => {
                    const resp = await deleteRule(data.id);
                    if (resp.status === 200) {
                        onlyMessage($t('Instance.index.052151-11'));
                        tableRef.value?.reload();
                    } else {
                        onlyMessage($t('Instance.index.052151-12'), 'error');
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
const add = () => {
    (current.value = {
        name: '',
        description: '',
    }),
        (visiable.value = true);
};
/**
 * 刷新数据
 */
const refresh = () => {
    tableRef.value?.reload();
};
const handleSearch = (e: any) => {
    params.value = e;
};
const openRuleEditor = (item: any) => {
    window.open(
        `/${SystemConst.API_BASE}/rule-editor/index.html#flow/${item.id}`,
    );
};
const closeSave = () => {
    visiable.value = false;
};
onMounted(() => {
    if (history.state?.params) {
        add();
    }
});
</script>
<style scoped>
</style>