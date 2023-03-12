<template>
    <div class="tree-container">
        <a-input-search
            v-model:value="searchValue"
            style="margin-bottom: 8px"
            placeholder="请输入"
            @search="handleSearch"
            allowClear
        />

        <div class="add-btn">
            <PermissionButton
                class="add-btn"
                type="primary"
                @click="handlAdd()"
                hasPermission="DataCollect/Collector:add"
            >
                <template #icon><AIcon type="PlusOutlined" /></template>
                新增采集器
            </PermissionButton>
        </div>
        <j-spin :spinning="spinning">
            <a-tree
                :tree-data="defualtDataSource"
                v-model:selected-keys="selectedKeys"
                :fieldNames="{ key: 'id' }"
                v-if="defualtDataSource[0].children.length !== 0"
                :height="600"
            >
                <template #title="{ name, data }">
                    <Ellipsis class="tree-left-title">
                        {{ name }}
                    </Ellipsis>
                    <j-tag
                        class="tree-left-tag"
                        v-if="data.id !== '*'"
                        :color="colorMap.get(getState(data)?.value)"
                        >{{ getState(data)?.text }}</j-tag
                    >
                    <span
                        v-if="data.id !== '*'"
                        class="func-btns"
                        @click="(e) => e.stopPropagation()"
                    >
                        <PermissionButton
                            type="link"
                            :tooltip="{
                                title: '编辑',
                            }"
                            @click="handlEdit(data)"
                            hasPermission="DataCollect/Collector:update"
                        >
                            <AIcon type="EditOutlined" />
                        </PermissionButton>
                        <PermissionButton
                            type="link"
                            :tooltip="{
                                title:
                                    data?.state?.value === 'disabled'
                                        ? '启用'
                                        : '禁用',
                            }"
                            hasPermission="DataCollect/Collector:update"
                            @click="handlUpdate(data)"
                        >
                            <AIcon
                                :type="
                                    data?.state?.value === 'disabled'
                                        ? 'CheckCircleOutlined'
                                        : 'StopOutlined'
                                "
                            />
                        </PermissionButton>
                        <PermissionButton
                            type="link"
                            :disabled="data?.state?.value !== 'disabled'"
                            :tooltip="{
                                title:
                                    data?.state?.value !== 'disabled'
                                        ? '正常的采集器不能删除'
                                        : '删除',
                            }"
                            hasPermission="DataCollect/Collector:delete"
                            :popConfirm="{
                                title: `该操作将会删除下属点位，确定删除？`,
                                onConfirm: () => handlDelete(data.id),
                            }"
                        >
                            <AIcon type="DeleteOutlined" />
                        </PermissionButton>
                    </span>
                </template>
            </a-tree>
            <j-empty v-else description="暂无数据" />
        </j-spin>
        <Save v-if="visible" :data="current" @change="saveChange" />
    </div>
</template>

<script setup lang="ts" name="TreePage">
import {
    queryCollector,
    queryChannelNoPaging,
    update,
    remove,
} from '@/api/data-collect/collector';
import Save from './Save/index.vue';
import { message } from 'ant-design-vue';
import { Store } from 'jetlinks-store';
import _ from 'lodash';
import { colorMap, getState } from '../data.ts';

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const emits = defineEmits(['change']);

const route = useRoute();
const channelId = route.query?.channelId;
const spinning = ref(false);
const selectedKeys = ref([]);
const searchValue = ref();
const visible = ref(false);
const current = ref({});
const collectorAll = ref();

const defualtDataSource = ref([
    {
        id: '*',
        name: '全部',
        children: [],
    },
]);

const defualtParams = {
    paging: false,
    sorts: [{ name: 'createTime', order: 'desc' }],
    terms: [
        {
            terms: !!channelId
                ? [
                      {
                          column: 'channelId',
                          value: channelId,
                      },
                  ]
                : [],
            type: 'and',
        },
    ],
};
const params = ref();

const handlAdd = () => {
    current.value = {};
    visible.value = true;
};

const handlEdit = (data: object) => {
    current.value = _.cloneDeep(data);
    visible.value = true;
};

const handlUpdate = async (data: object) => {
    const state = data?.state?.value;
    const resp = await update(data?.id, {
        state: state !== 'disabled' ? 'disabled' : 'enabled',
        runningState: state !== 'disabled' ? 'stopped' : 'running',
    });
    if (resp.status === 200) {
        handleSearch(params.value);
        message.success('操作成功');
    }
};
const handlDelete = async (id: string) => {
    const resp = await remove(id);
    if (resp.status === 200) {
        handleSearch(params.value);
        message.success('操作成功');
    }
};

const saveChange = (value: object) => {
    visible.value = false;
    current.value = {};
    if (value) {
        handleSearch(params.value);
        message.success('操作成功');
    }
};

const handleSearch = async (value: string) => {
    if (!searchValue.value && !value) {
        params.value = _.cloneDeep(defualtParams);
    } else if (!!searchValue.value) {
        params.value = { ..._.cloneDeep(defualtParams) };
        params.value.terms[1] = {
            terms: [
                {
                    column: 'name',
                    value: `%${searchValue.value}%`,
                    termType: 'like',
                },
            ],
        };
    } else {
        !!value && (params.value = value);
    }
    spinning.value = true;
    const res = await queryCollector(params.value);
    if (res.status === 200) {
        defualtDataSource.value[0].children = res.result;
        collectorAll.value = res.result;
        if (selectedKeys.value.length === 0) {
            selectedKeys.value = [res?.result[0]?.id] || [];
            emits('change', res?.result[0]);
        }
    }
    spinning.value = false;
};

const getChannelNoPaging = async () => {
    const res = await queryChannelNoPaging();
    Store.set('channelListAll', res.result);
};

onMounted(() => {
    handleSearch(_.cloneDeep(defualtParams));
    getChannelNoPaging();
});

watch(selectedKeys, (n) => {
    const key = _.isArray(n) ? n[0] : n;
    const row = collectorAll.value.find((i) => i.id === key);
    emits('change', row);
});

watch(
    () => searchValue.value,
    (value) => {
        !value && handleSearch(value);
    },
);
</script>

<style lang="less" scoped>
.tree-container {
    padding-right: 24px;

    .add-btn {
        margin: 10px 0;

        :deep(.ant-btn-primary) {
            width: 100%;
        }
    }

    :deep(.ant-tree-treenode) {
        width: 100%;
        .ant-tree-node-content-wrapper {
            flex: 1 1 auto;

            .ant-tree-title {
                display: flex;
                justify-content: space-between;
                align-items: center;
                .tree-left-title {
                    width: 80px;
                }
                .tree-left-tag {
                    width: 70px;
                    display: flex;
                    justify-content: center;
                }
                .func-btns {
                    // display: none;
                    display: block;

                    font-size: 14px;
                    width: 100px;
                    margin-right: -10px;
                    .ant-btn-link {
                        padding: 0 4px;
                        height: 24px;
                    }
                }
                // &:hover {
                //     .func-btns {
                //         display: block;
                //     }
                // }
            }
        }
    }
}
</style>
