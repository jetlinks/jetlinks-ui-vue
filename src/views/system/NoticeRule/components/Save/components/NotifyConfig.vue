<template>
    <div class="header">
        <pro-search
            :columns="columns"
            target="action-notice-config"
            class="action-search"
            style="padding-bottom: 0"
            @search="handleSearch"
        />
        <j-permission-button
            @click="onAdd"
            type="primary"
            :hasPermission="['notice/Config:add']"
        >
            新增
        </j-permission-button>
    </div>
    <div class="alert">
        <AIcon type="InfoCircleOutlined" />
        钉钉群机器人类型的配置在当前页面将被过滤
    </div>
    <div style="max-height: 400px; overflow-y: auto">
        <JProTable
            :columns="columns"
            :request="query"
            mode="CARD"
            :bodyStyle="{
                padding: 0,
            }"
            ref="tableRef"
            :alertRender="false"
            :params="params"
            :gridColumn="3"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onChange: onSelectChange,
            }"
        >
            <template #card="slotProps">
                <CardBox
                    :showStatus="false"
                    :value="slotProps"
                    :showTool="false"
                    :actions="[]"
                    v-bind="slotProps"
                    @click="handleClick"
                    :active="_selectedRowKeys.includes(slotProps.id)"
                >
                    <template #img>
                        <slot name="img">
                            <img
                                :src="
                                    getLogo(slotProps.type, slotProps.provider)
                                "
                                class="notify-logo"
                            />
                        </slot>
                    </template>
                    <template #content>
                        <j-ellipsis style="width: calc(100% - 100px)">
                            <span style="font-size: 16px; font-weight: 600">
                                {{ slotProps.name }}
                            </span>
                        </j-ellipsis>
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
                                <j-ellipsis>
                                    {{ slotProps.description }}
                                </j-ellipsis>
                            </a-col>
                        </a-row>
                    </template>
                </CardBox>
            </template>
        </JProTable>
    </div>
</template>

<script lang="ts" setup>
import ConfigApi from '@/api/notice/config';
import { MSG_TYPE, NOTICE_METHOD } from './const';
import { noticeType } from '../../../data';
const props = defineProps({
    notifyType: {
        type: String,
        default: '',
    },
    value: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update:value', 'change']);

const getLogo = (type: string, provider: string) => {
    return MSG_TYPE[type].find((f: any) => f.value === provider)?.logo;
};

const getMethodTxt = (type: string) => {
    return NOTICE_METHOD.find((f) => f.value === type)?.label;
};

const params = ref<Record<string, any>>({});
const _selectedRowKeys = ref<string[]>([]);
const tableRef = ref<any>();

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
    },
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        search: {
            type: 'string',
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
];

const query = (e: Record<string, any>) =>
    ConfigApi.list({
        ...e,
        terms: [
            ...e?.terms,
            {
                terms: [
                    {
                        termType: 'eq',
                        column: 'type',
                        value: noticeType.get(props.notifyType),
                    },
                    {
                        termType: 'not',
                        column: 'provider',
                        type: 'and',
                        value: 'dingTalkRobotWebHook',
                    },
                ],
            },
        ],
        sorts: [
            { name: 'id', value: props.value },
            { name: 'createTime', order: 'desc' },
        ],
    });

const handleSearch = (_params: any) => {
    params.value = _params;
};

const onSelectChange = (keys: string[]) => {
    _selectedRowKeys.value = [...keys];
};

const handleClick = (dt: any) => {
    if (_selectedRowKeys.value.includes(dt.id)) {
        _selectedRowKeys.value = [];
        emit('update:value', undefined);
        emit('change', { provider: undefined, value: undefined });
    } else {
        _selectedRowKeys.value = [dt.id];
        emit('update:value', dt.id);
        emit('change', { provider: dt?.provider, value: dt.id });
    }
};

const onAdd = () => {
    const tab: any = window.open(
        `${origin}/#/iot/notice/Config/detail/:id?notifyType=${noticeType.get(
            props.notifyType,
        )}`,
    );
    tab.onTabSaveSuccess = (value: any) => {
        _selectedRowKeys.value = [value.id];
        emit('update:value', value.id);
        emit('change', { provider: value?.provider, value: value.id });
        tableRef.value?.reload();
    };
};

watch(
    () => props.value,
    (newValue) => {
        if (newValue) {
            _selectedRowKeys.value = [newValue];
        } else {
            _selectedRowKeys.value = [];
        }
    },
    {
        deep: true,
        immediate: true,
    },
);
</script>

<style lang="less" scoped>
.notify-logo {
    width: 88px;
    height: 88px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.alert {
    height: 40px;
    padding: 0 20px 0 10px;
    margin-bottom: 10px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 40px;
    background-color: #f6f6f6;
}
</style>
