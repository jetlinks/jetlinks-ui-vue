<template>
    <page-container>
        <div>
            <pro-search
                :columns="columns"
                target="search-configuration"
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
                                {{ $t('Configuration.index.426500-0') }}
                            </PermissionButton>
                        </j-space>
                    </template>
                    <template #card="slotProps">
                        <CardBox
                            :value="slotProps"
                            :actions="getActions(slotProps, 'card')"
                            v-bind="slotProps"
                            :status="slotProps.state?.value"
                            :statusText="slotProps.state.value==='enabled'?$t('Configuration.index.426500-3'):$t('Configuration.index.426500-4')"
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
                                <a-row>
                                    <Ellipsis
                                        style="max-width: calc(100% - 120px)"
                                    >
                                        <span
                                            style="
                                                font-weight: 600;
                                                font-size: 16px;
                                            "
                                        >
                                            {{ slotProps.name }}
                                        </span>
                                    </Ellipsis>
                                </a-row>
                                <a-row>
                                    <j-col :span="12">
                                        <div class="card-item-content-text">
                                            {{ $t('Configuration.index.426500-1') }}
                                        </div>
                                        <div style="height: 22px; width: 100%">
                                            <Ellipsis style="max-width: 100%">
                                                {{ slotProps.description }}
                                            </Ellipsis>
                                        </div>
                                    </j-col>
                                    <j-col :span="12">
                                        <div class="card-item-content-text">
                                            {{ $t('Configuration.index.426500-2') }}
                                        </div>
                                        <div style="display: flex">
                                            <LevelIcon
                                                :level="slotProps.level"
                                            ></LevelIcon>
                                            <Ellipsis>
                                                {{ levelMap[slotProps.level] }}
                                            </Ellipsis>
                                        </div>
                                    </j-col>
                                </a-row>
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

                    <template #state="slotProps">
                        <BadgeStatus
                            :text="
                                slotProps.state?.value === 'enabled'
                                    ? $t('Configuration.index.426500-3')
                                    : $t('Configuration.index.426500-4')
                            "
                            :status="slotProps.state?.value"
                            :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
                        />
                    </template>
                    <template #level="slotProps">
                        <div style="display: flex">
                            <LevelIcon :level="slotProps.level"></LevelIcon>
                            <Ellipsis>
                                {{ levelMap[slotProps.level] }}
                            </Ellipsis>
                        </div>
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
    <HandTrigger
        @save="onSave"
        @close="visible = false"
        v-if="visible"
        :data="current"
    />
</template>

<script lang="ts" setup>
import {
    queryList,
    _enable,
    _disable,
    remove,
} from '@/api/rule-engine/configuration';
import { query } from '@/api/rule-engine/log';
import { queryLevel } from '@/api/rule-engine/config';
import type { ActionsType } from '@/components/Table/index.vue';
import { getImage, onlyMessage } from '@/utils/comm';
import { useMenuStore } from '@/store/menu';
import HandTrigger from './HandTrigger/index.vue';
import { Modal } from 'ant-design-vue';
import { useAlarmLevel } from '@/hook';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const params = ref<Record<string, any>>({});
const tableRef = ref<Record<string, any>>({});
const menuStory = useMenuStore();
const { levelMap } = useAlarmLevel();
const visibleDelete = ref(false);
const configId = ref();
const deleteState = ref(false);
const alarmRecordNumber = ref(0);
const columns = [
    {
        title: $t('Configuration.index.426500-5'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        width: 300,
        ellipsis: true,
    },
    {
        title: $t('Configuration.index.426500-6'),
        dataIndex: 'targetType',
        key: 'targetType',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                {
                    label: $t('Configuration.index.426500-7'),
                    value: 'product',
                },
                {
                    label: $t('Configuration.index.426500-8'),
                    value: 'device',
                },
                {
                    label: $t('Configuration.index.426500-9'),
                    value: 'org',
                },
                {
                    label: $t('Configuration.index.426500-10'),
                    value: 'other',
                },
            ],
        },
        width: 150,
    },
    {
        title: $t('Configuration.index.426500-11'),
        dataIndex: 'scene',
        hideInTable:true,
        key: 'scene',
        search: {
            type: 'select',
            options: async () => {
                const allData = await queryList({
                    paging: false,
                    sorts: [{ name: 'createTime', order: 'desc' }],
                });
                const result = allData.result?.data as any[];
                if (allData.success && result && result.length) {
                    const sceneDataMap = new Map(); // 用于去重
                    result.forEach((item) => {
                        item.scene.forEach((a: any) => {
                            sceneDataMap.set(a.id, {
                                label: a.name,
                                value: a.id,
                            });
                        });
                    });
                    return [...sceneDataMap.values()];
                }
                return [];
            },
        },
        width: 220,
        ellipsis: true,
    },
    {
        title: $t('Configuration.index.426500-2'),
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
        width: 150,
    },
    {
        title: $t('Configuration.index.426500-12'),
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                {
                    label: $t('Configuration.index.426500-3'),
                    value: 'enabled',
                },
                {
                    label: $t('Configuration.index.426500-4'),
                    value: 'disabled',
                },
            ],
        },
        width: 120,
    },
    {
        title: $t('Configuration.index.426500-1'),
        dataIndex: 'description',
        key: 'description',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: $t('Configuration.index.426500-13'),
        key: 'action',
        fixed: 'right',
        width: 170,
        scopedSlots: true,
    },
];
const visible = ref<boolean>(false);
const current = ref<any>({});

const map = {
    product: $t('Configuration.index.426500-7'),
    device: $t('Configuration.index.426500-8'),
    org: $t('Configuration.index.426500-9'),
    other: $t('Configuration.index.426500-10'),
};
const handleSearch = (e: any) => {
    params.value = e;
};

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
            text: $t('Configuration.index.426500-14'),
            disabled: data?.state?.value === 'disabled',
            tooltip: {
                title:
                    data?.state?.value === 'disabled'
                        ? $t('Configuration.index.426500-15')
                        : $t('Configuration.index.426500-14'),
            },
            onClick: () => {
                visible.value = true;
                current.value = data;
            },
            icon: 'icon-shoudongchufa',
        },
        {
            key: 'update',
            text: $t('Configuration.index.426500-16'),
            tooltip: {
                title: $t('Configuration.index.426500-16'),
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
            text: data.state?.value !== 'disabled' ? $t('Configuration.index.426500-26') : $t('Configuration.index.426500-17'),
            tooltip: {
                title: data.state?.value !== 'disabled' ? $t('Configuration.index.426500-26') : $t('Configuration.index.426500-17'),
            },
            icon:
                data.state?.value !== 'disabled'
                    ? 'StopOutlined'
                    : 'CheckCircleOutlined',
            popConfirm: {
                title: `${
                    data.state?.value !== 'disabled'
                        ? $t('Configuration.index.426500-18')
                        : $t('Configuration.index.426500-19')
                }?`,
                onConfirm: async () => {
                    let response = undefined;
                    if (data.state?.value === 'disabled') {
                        response = await _enable(data.id);
                    } else {
                        response = await _disable(data.id);
                    }
                    if (response && response.status === 200) {
                        onlyMessage($t('Configuration.index.426500-20'));
                        tableRef.value?.reload();
                    } else {
                        onlyMessage($t('Configuration.index.426500-21'), 'error');
                    }
                    return;
                },
            },
        },
        {
            key: 'delete',
            text: $t('Configuration.index.426500-22'),
            disabled: data?.state?.value !== 'disabled',
            tooltip: {
                title:
                    data?.state?.value !== 'disabled'
                        ? $t('Configuration.index.426500-23')
                        : $t('Configuration.index.426500-22'),
                placement: 'topLeft',
            },
            onClick: async () => {
                if (deleteState.value) {
                    return;
                }
                deleteState.value = true;
                const params = {
                    paging: false,
                    terms: [
                        {
                            termType: 'eq',
                            column: 'alarmConfigId',
                            value: data.id,
                            type: 'and',
                        },
                    ],
                };
                const res = await query(params);
                if (res.success) {
                    alarmRecordNumber.value = res.result?.total || 0;
                }
                Modal.confirm({
                    title: alarmRecordNumber.value
                        ? $t('Configuration.index.426500-24', [alarmRecordNumber.value])
                        : $t('Configuration.index.426500-25'),
                    onOk() {
                        return deleteConfig(data.id);
                    },
                    onCancel() {
                        deleteState.value = false;
                    },
                });

                visibleDelete.value = true;
                configId.value = data.id;
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions.filter(
        (item) => item.key != 'tigger' || data.sceneTriggerType == 'manual',
    );
};
const onSave = () => {
    visible.value = false;
    tableRef.value?.reload();
};
const add = () => {
    menuStory.jumpPage('rule-engine/Alarm/Configuration/Save');
};

const deleteConfig = async (id: any) => {
    const resp = await remove(id);
    if (resp.success) {
        onlyMessage($t('Configuration.index.426500-20'));
        refreshTable();
    } else {
        onlyMessage($t('Configuration.index.426500-21'), 'error');
    }
    deleteState.value = false;
};

const refreshTable = () => {
    visibleDelete.value = false;
    tableRef.value.reload();
};
</script>
<style lang="less" scoped>
.content-des-title {
    font-size: 12px;
}

.card-item-content-text {
    width: 100%;
    margin-top: 16px;
    margin-bottom: 8px;
}
</style>
