<template>
    <page-container>
        <Search
            :columns="columns"
            target="notice-config"
            @search="handleSearch"
        />
        <JTable
            ref="configRef"
            :columns="columns"
            :request="TemplateApi.list"
            :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
            }"
            :params="params"
            :gridColumn="3"
        >
            <template #headerTitle>
                <a-space>
                    <a-button type="primary" @click="handleAdd">
                        新增
                    </a-button>
                    <a-upload
                        name="file"
                        accept="json"
                        :showUploadList="false"
                        :before-upload="beforeUpload"
                    >
                        <a-button>导入</a-button>
                    </a-upload>
                    <a-popconfirm
                        title="确认导出当前页数据？"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="handleExport"
                    >
                        <a-button>导出</a-button>
                    </a-popconfirm>
                </a-space>
            </template>
            <template #card="slotProps">
                <CardBox
                    :showStatus="false"
                    :value="slotProps"
                    :actions="getActions(slotProps, 'card')"
                    v-bind="slotProps"
                >
                    <template #img>
                        <slot name="img">
                            <img
                                :src="
                                    getLogo(slotProps.type, slotProps.provider)
                                "
                                class="logo"
                            />
                        </slot>
                    </template>
                    <template #content>
                        <h3 class="card-item-content-title">
                            {{ slotProps.name }}
                        </h3>
                        <a-row>
                            <a-col :span="12">
                                <div class="card-item-content-text">
                                    通知方式
                                </div>
                                <div>
                                    {{ getMethodTxt(slotProps.type) }}
                                </div>
                            </a-col>
                            <a-col :span="12">
                                <div class="card-item-content-text">说明</div>
                                <div>{{ slotProps.description }}</div>
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

        <Debug v-model:visible="debugVis" :data="currentConfig" />
        <Log v-model:visible="logVis" :data="currentConfig" />
    </page-container>
</template>

<script setup lang="ts">
import TemplateApi from '@/api/notice/template';
import type { ActionsType } from '@/components/Table/index.vue';
// import { getImage, LocalStore } from '@/utils/comm';
import { message } from 'ant-design-vue';
// import { BASE_API_PATH, TOKEN_KEY } from '@/utils/variable';

import { NOTICE_METHOD, MSG_TYPE } from '@/views/notice/const';

import Debug from './Debug/index.vue';
import Log from './Log/index.vue';
import { downloadObject } from '@/utils/utils';
import { useMenuStore } from 'store/menu';

const menuStory = useMenuStore();

let providerList: any = [];
Object.keys(MSG_TYPE).forEach((key) => {
    providerList = [...providerList, ...MSG_TYPE[key]];
});

const configRef = ref<Record<string, any>>({});
const params = ref<Record<string, any>>({});

const columns = [
    {
        title: '模板名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: '通知方式',
        dataIndex: 'type',
        key: 'type',
        scopedSlots: true,
        search: {
            type: 'select',
            options: NOTICE_METHOD,
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: '类型',
        dataIndex: 'provider',
        key: 'provider',
        scopedSlots: true,
        search: {
            type: 'select',
            options: providerList,
            handleValue: (v: any) => {
                return v;
            },
        },
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        search: {
            type: 'string',
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
 * 搜索
 * @param params
 */
const handleSearch = (e: any) => {
    // console.log('handleSearch:', e);
    params.value = e;
    // console.log('params.value: ', params.value);
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
 * 新增
 */
const handleAdd = () => {
    menuStory.jumpPage('notice/Template/Detail', {
        id: ':id',
    });
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
            message.error('请上传json格式文件');
            return false;
        }
        try {
            const data = JSON.parse(text || '{}');
            const { success } = await TemplateApi.update(data);
            if (success) {
                message.success('操作成功');
                configRef.value.reload();
            }
            return true;
        } catch {
            // message.error('请上传json格式文件');
        }
        return true;
    };
    return false;
};

/**
 * 导出
 */
const handleExport = () => {
    downloadObject(configRef.value.dataSource, `通知配置`);
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
            key: 'edit',
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: () => {
                menuStory.jumpPage('notice/Template/Detail', {
                    id: data.id,
                });
            },
        },
        {
            key: 'debug',
            text: '调试',
            tooltip: {
                title: '调试',
            },
            icon: 'BugOutlined',
            onClick: () => {
                debugVis.value = true;
                currentConfig.value = data;
            },
        },
        {
            key: 'debug',
            text: '导出',
            tooltip: {
                title: '导出',
            },
            icon: 'ArrowDownOutlined',
            onClick: () => {
                downloadObject(data, `通知配置`);
            },
        },
        {
            key: 'debug',
            text: '通知记录',
            tooltip: {
                title: '通知记录',
            },
            icon: 'BarsOutlined',
            onClick: () => {
                logVis.value = true;
                currentConfig.value = data;
            },
        },
        {
            key: 'delete',
            text: '删除',
            popConfirm: {
                title: '确认删除?',
                onConfirm: async () => {
                    const resp = await TemplateApi.del(data.id);
                    if (resp.status === 200) {
                        message.success('操作成功！');
                        configRef.value?.reload();
                    } else {
                        message.error('操作失败！');
                    }
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};
</script>

<style lang="less" scoped>
.logo {
    width: 88px;
    height: 88px;
}
</style>
