<!-- 通知配置 -->
<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="notice-config"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="configRef"
                :columns="columns"
                :request="ConfigApi.list"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="params"
                :gridColumn="3"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            type="primary"
                            @click="handleAdd"
                            hasPermission="notice/Config:add"
                        >
                            {{ $t('Config.index.7374416-0') }}
                        </PermissionButton>
                        <j-upload
                            name="file"
                            accept=".json"
                            :showUploadList="false"
                            :before-upload="beforeUpload"
                        >
                            <PermissionButton
                                hasPermission="notice/Config:import"
                            >
                                {{ $t('Config.index.7374416-1') }}
                            </PermissionButton>
                        </j-upload>
                        <PermissionButton
                            :popConfirm="{
                                title: $t('Config.index.7374416-2'),
                                onConfirm: handleExport,
                            }"
                            hasPermission="notice/Config:export"
                        >
                            {{ $t('Config.index.7374416-3') }}
                        </PermissionButton>
                    </j-space>
                </template>
                <template #card="slotProps">
                    <CardBox
                        :showStatus="false"
                        :statusNames="{}"
                        :value="slotProps"
                        :actions="getActions(slotProps, 'card')"
                    >
                        <template #img>
                            <slot name="img">
                                <img
                                    :src="
                                        getLogo(
                                            slotProps.type,
                                            slotProps.provider,
                                        )
                                    "
                                    class="logo"
                                />
                            </slot>
                        </template>
                        <template #content>
                            <h3 class="card-item-content-title">
                                {{ slotProps.name }}
                            </h3>
                            <j-row>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{ $t('Config.index.7374416-4') }}
                                    </div>
                                    <div>
                                        {{ getMethodTxt(slotProps.type) }}
                                    </div>
                                </j-col>
                                <j-col :span="12">
                                    <div class="card-item-content-text">
                                        {{ $t('Config.index.7374416-5') }}
                                    </div>
                                    <Ellipsis>
                                        {{ slotProps.description }}
                                    </Ellipsis>
                                </j-col>
                            </j-row>
                        </template>
                        <template #actions="item">
                            <j-tooltip
                                v-bind="item.tooltip"
                                :title="item.disabled && item.tooltip.title"
                            >
                                <j-dropdown
                                    placement="bottomRight"
                                    v-if="item.key === 'others'"
                                >
                                    <j-button>
                                        <AIcon :type="item.icon" />
                                        <span>{{ item.text }}</span>
                                    </j-button>
                                    <template #overlay>
                                        <j-menu>
                                            <j-menu-item
                                                v-for="(o, i) in item.children"
                                                :key="i"
                                            >
                                                <PermissionButton
                                                    type="link"
                                                    @click="o.onClick"
                                                    :hasPermission="`notice/Config:${o.key}`"
                                                >
                                                    <template #icon>
                                                        <AIcon :type="o.icon" />
                                                    </template>
                                                    <span>{{ o.text }}</span>
                                                </PermissionButton>
                                            </j-menu-item>
                                        </j-menu>
                                    </template>
                                </j-dropdown>
                                <PermissionButton
                                    v-else-if="item.key === 'delete'"
                                    :popConfirm="item.popConfirm"
                                    :disabled="item.disabled"
                                    :hasPermission="`notice/Config:${item.key}`"
                                >
                                    <template #icon>
                                        <AIcon type="DeleteOutlined" />
                                    </template>
                                </PermissionButton>
                                <template v-else>
                                    <PermissionButton
                                        :disabled="item.disabled"
                                        @click="item.onClick"
                                        :hasPermission="`notice/Config:${item.key}`"
                                    >
                                        <template #icon>
                                            <AIcon :type="item.icon" />
                                        </template>
                                        <span>{{ item.text }}</span>
                                    </PermissionButton>
                                </template>
                            </j-tooltip>
                        </template>
                    </CardBox>
                </template>
                <template #type="slotProps">
                    <span> {{ getMethodTxt(slotProps.type) }}</span>
                </template>
                <template #provider="slotProps">
                    <span>
                        {{ getProviderTxt(slotProps.type, slotProps.provider) }}
                    </span>
                </template>
                <template #description="slotProps">
                    <Ellipsis>
                        {{ slotProps.description }}
                    </Ellipsis>
                </template>
                <template #action="slotProps">
                    <j-space :size="16">
                        <template
                            v-for="i in getActions(slotProps, 'table')"
                            :key="i.key"
                        >
                            <PermissionButton
                                :danger="i.key === 'delete'"
                                :disabled="i.disabled"
                                :popConfirm="i.popConfirm"
                                :tooltip="{
                                    ...i.tooltip,
                                }"
                                @click="i.onClick"
                                type="link"
                                style="padding: 0px"
                                :hasPermission="'notice/Config:' + i.key"
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

        <Debug v-model:visible="debugVis" :data="currentConfig" />
        <Log v-if="logVis" :data="currentConfig" @cancel="logVis = false" />
        <SyncUser v-model:visible="syncVis" :data="currentConfig" />
    </page-container>
</template>

<script setup lang="ts">
import ConfigApi from '@/api/notice/config';
import type { ActionsType } from '@/views/device/Instance/typings';

import { NOTICE_METHOD, MSG_TYPE } from '@/views/notice/const';
import SyncUser from './SyncUser/index.vue';
import Debug from './Debug/index.vue';
import Log from './Log/index.vue';
import { downloadObject } from '@/utils/utils';
import { useMenuStore } from 'store/menu';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const menuStory = useMenuStore();

let providerList: any = [];
Object.keys(MSG_TYPE).forEach((key) => {
    providerList = [...providerList, ...MSG_TYPE[key]];
});

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: $t('Config.index.7374416-6'),
        dataIndex: 'name',
        key: 'name',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Config.index.7374416-4'),
        dataIndex: 'type',
        key: 'type',
        scopedSlots: true,
        width: 100,
        search: {
            type: 'select',
            options: NOTICE_METHOD,
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: $t('Config.index.7374416-7'),
        dataIndex: 'provider',
        key: 'provider',
        scopedSlots: true,
        width: 200,
        search: {
            type: 'select',
            options: providerList,
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: $t('Config.index.7374416-5'),
        dataIndex: 'description',
        key: 'description',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Config.index.7374416-8'),
        key: 'action',
        fixed: 'right',
        width: 210,
        scopedSlots: true,
    },
];

/**
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    params.value = e;
};

/**
 * 根据通知方式展示对应logo
 */
const getLogo = (type: string, provider: string) => {
    return MSG_TYPE[type].find((f: any) => f.value === provider)?.logo;
};
/**
 * 通知方式字段展示对应文字
 */
const getMethodTxt = (type: string) => {
    return NOTICE_METHOD.find((f) => f.value === type)?.label;
};
/**
 * 根据类型展示对应文案
 * @param type
 * @param provider
 */
const getProviderTxt = (type: string, provider: string) => {
    return MSG_TYPE[type].find((f: any) => f.value === provider)?.label;
};

/**
 * 新增
 */
const handleAdd = () => {
    menuStory.jumpPage('notice/Config/Detail', { id: ':id' });
};

/**
 * 导入
 */
const beforeUpload = (file: any) => {
    console.log('file: ', file);
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async (result) => {
        const text = result.target?.result;
        console.log('text: ', text);
        if (!file.type.includes('json')) {
            onlyMessage($t('Config.index.7374416-9'), 'error');
            return false;
        }
        try {
            const data = JSON.parse(text || '{}');
            const { success } = await ConfigApi.update(data);
            if (success) {
                onlyMessage($t('Config.index.7374416-10'));
                configRef.value.reload();
            }
            return true;
        } catch {
            // onlyMessage($t('Config.index.7374416-9'), 'error');
        }
        return true;
    };
    return false;
};

/**
 * 导出
 */
const handleExport = () => {
    downloadObject(configRef.value._dataSource, $t('Config.index.7374416-11'));
};

const syncVis = ref(false);
const debugVis = ref(false);
const logVis = ref(false);
const currentConfig = ref<Partial<Record<string, any>>>();
const getActions = (
    data: Partial<Record<string, any>>,
    type: 'card' | 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: $t('Config.index.7374416-12'),
            tooltip: {
                title: $t('Config.index.7374416-12'),
            },
            icon: 'EditOutlined',
            onClick: () => {
                menuStory.jumpPage('notice/Config/Detail', {
                    id: data.id,
                });
            },
        },
        {
            key: 'debug',
            text: $t('Config.index.7374416-13'),
            tooltip: {
                title: $t('Config.index.7374416-13'),
            },
            icon: 'BugOutlined',
            onClick: () => {
                debugVis.value = true;
                currentConfig.value = data;
            },
        },
        {
            key: 'delete',
            text: $t('Config.index.7374416-14'),
            popConfirm: {
                title: $t('Config.index.7374416-15'),
                onConfirm: async () => {
                    const resp = await ConfigApi.del(data.id);
                    if (resp.status === 200) {
                        onlyMessage($t('Config.index.7374416-16'));
                        configRef.value?.reload();
                    } else {
                        onlyMessage($t('Config.index.7374416-17'), 'error');
                    }
                    return
                },
            },
            icon: 'DeleteOutlined',
        },
    ];

    const others: ActionsType = {
        key: 'others',
        text: $t('Config.index.7374416-18'),
        icon: 'EllipsisOutlined',
        children: [
            {
                key: 'export',
                text: $t('Config.index.7374416-3'),
                tooltip: {
                    title: $t('Config.index.7374416-3'),
                },
                icon: 'ArrowDownOutlined',
                onClick: () => {
                    downloadObject(data, `${data.name}`);
                },
            },
            {
                key: 'bind',
                text: $t('Config.index.7374416-19'),
                tooltip: {
                    title: $t('Config.index.7374416-19'),
                },
                icon: 'TeamOutlined',
                onClick: () => {
                    syncVis.value = true;
                    currentConfig.value = data;
                },
            },
            {
                key: 'log',
                text: $t('Config.index.7374416-20'),
                tooltip: {
                    title: $t('Config.index.7374416-20'),
                },
                icon: 'BarsOutlined',
                onClick: () => {
                    logVis.value = true;
                    currentConfig.value = data;
                },
            },
        ],
    };

    if (type === 'card') {
        if (
            data.provider !== 'dingTalkMessage' &&
            data.provider !== 'corpMessage'
        )
            others.children?.splice(1, 1);
        actions.splice(actions.length - 1, 0, others);
        return actions;
    } else {
        if (
            data.provider !== 'dingTalkMessage' &&
            data.provider !== 'corpMessage'
        )
            others.children?.splice(1, 1);
        actions.splice(actions.length - 1, 0, ...others.children);
        return actions;
    }
};
</script>
<style lang="less" scoped>
.logo {
    width: 88px;
    height: 88px;
}
</style>
