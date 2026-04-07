<template>
    <j-page-container>
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
                    modeValue="CARD"
                    :params="params"
                >
                    <template #headerLeftRender>
                        <a-space>
                            <j-permission-button
                                type="primary"
                                @click="add"
                                :hasPermission="`${permissionKey}:add`"
                            >
                                <template #icon
                                    ><AIcon type="PlusOutlined"
                                /></template>
                                {{ $t('Instance.index.020452-0') }}
                            </j-permission-button>
                        </a-space>
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
                                        :src="InstanceImages.scene"
                                    />
                                </slot>
                            </template>
                            <template #content>
                                <j-ellipsis style="width: calc(100% - 100px); margin-bottom: 18px;">
                                    <span
                                        style="
                                            font-weight: 600;
                                            font-size: 16px;
                                        "
                                    >
                                        {{ slotProps.name }}
                                    </span>
                                </j-ellipsis>
                                <a-row>
                                    <a-col :span="12">
                                        <j-ellipsis>
                                            <div>
                                                {{ slotProps.description }}
                                            </div>
                                        </j-ellipsis>
                                    </a-col>
                                </a-row>
                            </template>
                            <template #actions="item">
                                <j-permission-button
                                    :disabled="item.disabled"
                                    :popConfirm="item.popConfirm"
                                    :tooltip="{
                                        ...item.tooltip,
                                    }"
                                    :hasPermission="
                                        permissionKey + ':' + item.key
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
                                </j-permission-button>
                            </template>
                        </CardBox>
                    </template>
                    <template #state="slotProps">
                        <JBadgeStatus
                            :text="slotProps.state?.text "
                            :status="slotProps.state?.value"
                            :statusNames="{
                                started: 'processing',
                                disable: 'error',
                            }"
                        />
                    </template>
                    <template #action="slotProps">
                        <a-space>
                            <template
                                v-for="i in getActions(slotProps, 'table')"
                                :key="i.key"
                            >
                                <j-permission-button
                                    :disabled="i.disabled"
                                    :popConfirm="i.popConfirm"
                                    :tooltip="{
                                        ...i.tooltip,
                                    }"
                                    @click="i.onClick"
                                    type="link"
                                    style="padding: 0px"
                                    :hasPermission="i.key === 'view' ? true : permissionKey + ':' + i.key"
                                    :danger="i.key === 'delete'"
                                >
                                    <template #icon
                                        ><AIcon :type="i.icon"
                                    /></template>
                                </j-permission-button>
                            </template>
                        </a-space>
                    </template>
                </JProTable>
            </FullPage>
            <!-- {{ $t('Instance.index.020452-0') }}、{{ $t('Instance.index.020452-7') }} -->
            <Save
                :data="current"
                @success="refresh"
                v-if="visible"
                @close-save="closeSave"
            />
        </div>
    </j-page-container>
</template>

<script lang="ts" setup>
import {
    queryList,
    startRule,
    stopRule,
    deleteRule,
} from '../../api/instance';
import { onlyMessage } from '@jetlinks-web/utils';
import Save from './Save/index.vue';
import { useRouterParams } from '@jetlinks-web/hooks';
import { InstanceImages } from '../../assets/index';
import { useI18n } from 'vue-i18n'
import { useRulePermission } from '@rule-engine-manager-ui/hook/usePermission'
import {getBaseApi} from "@jetlinks-web-core/utils";

const { t: $t } = useI18n()
const params = ref<Record<string, any>>({});
const tableRef = ref<Record<string, any>>({});
const routerParams = useRouterParams();
let visible = ref(false);

const permissionKey = useRulePermission()

const query = {
    columns: [
        {
            title: $t('Instance.index.020452-3'),
            dataIndex: 'name',
            key: 'name',
            search: {
                type: 'string',
            },
        },
        {
            title: $t('Instance.index.020452-4'),
            dataIndex: 'state',
            key: 'state',
            search: {
                type: 'select',
                options: [
                    {
                        label: $t('Instance.index.020452-1'),
                        value: 'started',
                    },
                    {
                        label: $t('Instance.index.020452-2'),
                        value: 'disable',
                    },
                ],
            },
        },
        {
            title: $t('Instance.index.020452-5'),
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
        title: $t('Instance.index.020452-3'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
    },
    {
        title: $t('Instance.index.020452-4'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
    },
    {
        title: $t('Instance.index.020452-5'),
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
    {
        title: $t('Instance.index.020452-6'),
        key: 'action',
        fixed: 'right',
        width: 170,
        scopedSlots: true,
    },
];
const current = ref();
const getActions = (
    data: Partial<Record<string, any>>,
    type?: 'card' | 'table',
): any[] => {
    if (!data) {
        return [];
    }
    const actions = [
        {
            key: 'update',
            text: $t('Instance.index.020452-7'),
            tooltip: {
                title: $t('Instance.index.020452-7'),
            },

            icon: 'EditOutlined',
            onClick: () => {
                current.value = data;
                visible.value = true;
            },
        },
        {
            key: 'view',
            text: $t('Instance.index.020452-8'),
            tooltip: {
                title: $t('Instance.index.020452-8'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                openRuleEditor(data);
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'disable' ? $t('Instance.index.020452-2') : $t('Instance.index.020452-9'),
            tooltip: {
                title: data.state?.value !== 'disable' ? $t('Instance.index.020452-2') : $t('Instance.index.020452-9'),
            },
            icon:
                data.state?.value !== 'disable'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: $t('Instance.index.020452-10', [data.state.value !== 'disable' ? $t('Instance.index.020452-2') : $t('Instance.index.020452-9')]),
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state?.value !== 'started') {
                        response = await startRule(data.id);
                    } else {
                        response = await stopRule(data.id);
                    }
                    if (response && response.status === 200) {
                        onlyMessage($t('Instance.index.020452-11'));
                        tableRef.value?.reload();
                    } else {
                        onlyMessage($t('Instance.index.020452-12'), 'error');
                    }
                },
            },
        },
        {
            key: 'delete',
            text: $t('Instance.index.020452-13'),
            disabled: data?.state?.value !== 'disable',
            tooltip: {
                title:
                    data?.state?.value !== 'disable'
                        ? $t('Instance.index.020452-14')
                        : $t('Instance.index.020452-13'),
            },
            popConfirm: {
                title: $t('Instance.index.020452-15'),
                onConfirm: async () => {
                    const resp = await deleteRule(data.id);
                    if (resp.status === 200) {
                        onlyMessage($t('Instance.index.020452-11'));
                        tableRef.value?.reload();
                    } else {
                        onlyMessage($t('Instance.index.020452-12'), 'error');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    if (type === 'card')
        return actions.filter((i: any) => i.key !== 'view');
    return actions;
};
const add = () => {
    (current.value = {
        name: '',
        description: '',
    }),
        (visible.value = true);
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
        `${getBaseApi()}/rule-editor/index.html#flow/${item.id}`,
    );
};
const closeSave = () => {
    visible.value = false;
};
onMounted(() => {
    if (routerParams.params.value?.save) {
        add();
    }
});
</script>
<style scoped>
</style>
