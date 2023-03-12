<template>
    <j-advanced-search
        :columns="columns"
        type="simple"
        target="action-notice-config"
        @search="handleSearch"
        class="search"
    />
    <div style="height: 400px; overflow-y: auto">
        <JProTable
            :columns="columns"
            :request="(e) => ConfigApi.list({
                ...e,
                terms: [
                    ...e?.terms,
                    {
                        terms: [
                            {
                                termType: 'eq',
                                column: 'type',
                                value: props.notifyType,
                            },
                        ],
                    },
                ],
                sorts: [{ name: 'id', value: props.value }, { name: 'createTime', order: 'desc' }],
            })"
            model="CARD"
            :bodyStyle="{
                paddingRight: 0,
                paddingLeft: 0,
            }"
            :params="params"
            :gridColumn="2"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
            }"
            @cancelSelect="cancelSelect"
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
                                class="logo"
                            />
                        </slot>
                    </template>
                    <template #content>
                        <Ellipsis style="width: calc(100% - 100px)">
                            <span style="font-size: 16px; font-weight: 600">
                                {{ slotProps.name }}
                            </span>
                        </Ellipsis>
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
                                <Ellipsis>
                                    {{ slotProps.description }}
                                </Ellipsis>
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
import { MSG_TYPE, NOTICE_METHOD } from '@/views/notice/const';
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

const emit = defineEmits(['update:value']);

const getLogo = (type: string, provider: string) => {
    return MSG_TYPE[type].find((f: any) => f.value === provider)?.logo;
};

const getMethodTxt = (type: string) => {
    return NOTICE_METHOD.find((f) => f.value === type)?.label;
};

const params = ref<Record<string, any>>({});
const _selectedRowKeys = ref<string[]>([]);

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

const handleSearch = (_params: any) => {
    params.value = _params;
};

const cancelSelect = () => {
    _selectedRowKeys.value = [];
};

const handleClick = (dt: any) => {
    _selectedRowKeys.value = [dt.id];
    emit('update:value', dt.id);
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
.search {
    margin-bottom: 0;
    padding-right: 0px;
    padding-left: 0px;
}

.logo{
    width: 88px;
    height: 88px;
}
</style>
