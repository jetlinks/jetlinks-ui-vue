<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="edge-resource"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="edgeResourceRef"
                :columns="columns"
                :request="query"
                :defaultParams="defaultParams"
                :params="params"
            >
                <template #card="slotProps">
                    <CardBox
                        :value="slotProps"
                        @click="handleView(slotProps)"
                        :actions="getActions(slotProps, 'card')"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.value==='disabled'?$t('Resource.index.925643-6'):$t('Resource.index.925643-7')"
                        :statusNames="{
                            enabled: 'processing',
                            disabled: 'error',
                        }"
                    >
                        <template #img>
                            <img
                                :src="
                                    getImage('/device/instance/device-card.png')
                                "
                            />
                        </template>
                        <template #content>
                            <Ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
                            </Ellipsis>
                            <j-row style="margin-top: 18px">
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{ $t('Resource.index.925643-0') }}
                                    </div>
                                    <Ellipsis>{{
                                        slotProps.category
                                    }}</Ellipsis>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{ $t('Resource.index.925643-1') }}
                                    </div>
                                    <Ellipsis style="width: 100%">
                                        {{ slotProps.sourceName }}
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
                                :hasPermission="'edge/Resource:' + item.key"
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
                <template #sourceId="slotProps">
                    {{ slotProps.sourceName }}
                </template>
                <template #category="slotProps">
                    {{ slotProps.category }}
                </template>
                <template #createTime="slotProps">
                    <span>{{
                        dayjs(slotProps.createTime).format(
                            'YYYY-MM-DD HH:mm:ss',
                        )
                    }}</span>
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
                                style="padding: 0 5px"
                                :danger="i.key === 'delete'"
                                :hasPermission="
                                    i.key === 'view'
                                        ? true
                                        : 'edge/Resource:' + i.key
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

        <Save
            v-if="visible"
            :data="current"
            @close="visible = false"
            @save="saveBtn"
        />
        <Issue
            v-if="settingVisible"
            :data="current"
            @close="settingVisible = false"
        />
    </page-container>
</template>

<script lang="ts" setup>
import { queryNoPagingPost } from '@/api/device/instance';
import { ActionsType } from '@/views/device/Instance/typings';
import { useMenuStore } from '@/store/menu';
import { getImage, onlyMessage } from '@/utils/comm';
import dayjs from 'dayjs';
import { query, _delete, _start, _stop } from '@/api/edge/resource';
import Save from './Save/index.vue';
import Issue from './Issue/index.vue';
import BadgeStatus from '@/components/BadgeStatus/index.vue';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const menuStory = useMenuStore();

const defaultParams = { sorts: [{ name: 'createTime', order: 'desc' }] };

const statusMap = new Map();
statusMap.set('enabled', 'processing');
statusMap.set('disabled', 'error');

const params = ref<Record<string, any>>({});
const edgeResourceRef = ref<Record<string, any>>({});
const settingVisible = ref<boolean>(false);
const visible = ref<boolean>(false);
const current = ref<Record<string, any>>({});

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: $t('Resource.index.925643-2'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        dataIndex: 'category',
        title: $t('Resource.index.925643-3'),
        valueType: 'select',
        scopedSlots: true,
        key: 'category',
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    query({
                        paging: false,
                        sorts: [{ name: 'createTime', order: 'desc' }],
                    }).then((resp: any) => {
                        const arrMap = new Map();
                        resp.result.data.forEach((item: any) => {
                            arrMap.set(item.category, {
                                label: item.category,
                                value: item.category,
                            });
                        });
                        resolve([...arrMap.values()]);
                    });
                }),
        },
    },
    {
        title: $t('Resource.index.925643-1'),
        dataIndex: 'sourceId',
        key: 'sourceId',
        scopedSlots: true,
        search: {
            type: 'select',
            options: () =>
                new Promise((resolve) => {
                    query({
                        paging: false,
                        sorts: [
                            {
                                name: 'createTime',
                                order: 'desc',
                            },
                        ],
                    }).then((resp: any) => {
                        const arrMap = new Map();
                        resp.result.data.forEach((item: any) => {
                            arrMap.set(item.sourceId, {
                                label: item.sourceName,
                                value: item.sourceId,
                            });
                        });
                        resolve([...arrMap.values()]);
                    });
                }),
        },
    },
    {
        title: $t('Resource.index.925643-4'),
        dataIndex: 'createTime',
        key: 'createTime',
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: $t('Resource.index.925643-5'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                { label: $t('Resource.index.925643-6'), value: 'disabled' },
                { label: $t('Resource.index.925643-7'), value: 'enabled' },
            ],
        },
    },
    {
        title: $t('Resource.index.925643-8'),
        key: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
];

const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'view',
            text: $t('Resource.index.925643-9'),
            tooltip: {
                title: $t('Resource.index.925643-9'),
            },
            icon: 'EyeOutlined',
            onClick: () => {
                handleView(data);
            },
        },
        {
            key: 'update',
            text: $t('Resource.index.925643-10'),
            tooltip: {
                title: $t('Resource.index.925643-10'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                visible.value = true;
                current.value = data;
            },
        },
        {
            key: 'setting',
            text: $t('Resource.index.925643-11'),
            disabled: data.state?.value === 'disabled',
            tooltip: {
                title:
                    data.state.value === 'disabled'
                        ? $t('Resource.index.925643-12')
                        : $t('Resource.index.925643-11'),
            },
            icon: 'DownSquareOutlined',
            onClick: () => {
                settingVisible.value = true;
                current.value = data;
            },
        },
        {
            key: 'action',
            text: data.state?.value !== 'disabled' ? $t('Resource.index.925643-21') : $t('Resource.index.925643-13'),
            tooltip: {
                title: data.state?.value !== 'disabled' ? $t('Resource.index.925643-21') : $t('Resource.index.925643-13'),
            },
            icon:
                data.state.value !== 'disabled'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `${
                    data.state.value !== 'disabled' ? $t('Resource.index.925643-14') : $t('Resource.index.925643-20')
                }?`,
                onConfirm: () => {
                    let response = undefined;
                    if (data.state.value !== 'disabled') {
                        response = _stop([data.id]);
                    } else {
                        response = _start([data.id]);
                    }
                    response.then((res) => {
                        if (res && res.status === 200) {
                            onlyMessage($t('Resource.index.925643-15'));
                            edgeResourceRef.value?.reload();
                        } else {
                            onlyMessage($t('Resource.index.925643-16'), 'error');
                        }
                    });
                    return response;
                },
            },
        },
        {
            key: 'delete',
            text: $t('Resource.index.925643-17'),
            disabled: data.state?.value !== 'disabled',
            tooltip: {
                title:
                    data.state.value !== 'disabled'
                        ? $t('Resource.index.925643-18')
                        : $t('Resource.index.925643-17'),
            },
            popConfirm: {
                title: $t('Resource.index.925643-19'),
                onConfirm: () => {
                    const response = _delete(data.id);
                    response.then((res) => {
                        if (res.status === 200) {
                            onlyMessage($t('Resource.index.925643-15'));
                            edgeResourceRef.value?.reload();
                        } else {
                            onlyMessage($t('Resource.index.925643-16'), 'error');
                        }
                    });
                    return response
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

const handleView = (dt: any) => {
    menuStory.jumpPage('device/Instance/Detail', { id: dt?.sourceId });
};

const saveBtn = () => {
    visible.value = false;
    edgeResourceRef.value?.reload();
};

const onRefresh = () => {
    settingVisible.value = false;
    edgeResourceRef.value?.reload();
};
</script>

<style lang="less" scoped></style>
