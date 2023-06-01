<template>
    <div class="tree-container">
        <j-input-search
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
            <j-tree
                :tree-data="defualtDataSource"
                :selected-keys="selectedKeys"
                :fieldNames="{ key: 'id' }"
                v-if="
                    !(defualtDataSource.length === 0 ||
                    defualtDataSource?.[0]?.children?.length === 0)
                "
                :height="660"
                @select='treeSelect'
                defaultExpandAll
            >
                <template #title="{ name, data }">
                    <Ellipsis class="tree-left-title">
                        {{ name }}
                    </Ellipsis>
                    <j-tag
                        class="tree-left-tag"
                        v-if="data.id !== '*'"
                        :color="colorMap.get(data?.runningState?.value)"
                        >{{ data?.runningState?.text }}</j-tag
                    >
                    <j-tag
                        class="tree-left-tag2"
                        v-if="data.id !== '*'"
                        :color="colorMap.get(data?.state?.value)"
                        >{{ data?.state?.text }}</j-tag
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
                            hasPermission="DataCollect/Collector:action"
                            :popConfirm="{
                                title:
                                    data?.state?.value === 'disabled'
                                        ? '确定启用?'
                                        : '确定禁用?',
                                onConfirm: () => handlUpdate(data),
                            }"
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
                                        ? '请先禁用，再删除'
                                        : '删除',
                            }"
                            :danger="data?.state?.value === 'disabled'"
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
            </j-tree>
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
import { onlyMessage } from '@/utils/comm';
import { Store } from 'jetlinks-store';
import _ from 'lodash';
import { colorMap } from '../data.ts';

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
const selectedKeys: any = ref([]);
const searchValue = ref();
const visible = ref(false);
const current = ref({});
const collectorAll = ref();

const root = [
    {
        id: '*',
        name: '全部',
        children: [],
    },
];

const defualtDataSource: any = ref(_.cloneDeep(root));

const defualtParams = {
    paging: false,
    sorts: [{ name: 'createTime', order: 'desc' }],
    terms: !!channelId ? [
        {
            terms: [
                      {
                          column: 'channelId',
                          value: channelId,
                      },
                  ],
            type: 'and',
        },
    ] : [],
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

const handlUpdate = async (data: any) => {
    const state = data?.state?.value;
    const resp = await update(data?.id, {
        state: state !== 'disabled' ? 'disabled' : 'enabled',
        runningState: state !== 'disabled' ? 'stopped' : 'running',
    });
    if (resp.status === 200) {
        handleSearch(params.value);
        onlyMessage('操作成功', 'success');
    }
};
const handlDelete = async (id: string) => {
    const resp = await remove(id);
    if (resp.status === 200) {
        handleSearch(params.value);
        onlyMessage('操作成功', 'success');
    }
};

const saveChange = (value: object) => {
    visible.value = false;
    current.value = {};
    if (value) {
        handleSearch(params.value);
        onlyMessage('操作成功', 'success');
    }
};

const handleSearch = async (value: any) => {
    let clickSearch = !!channelId; // 通道跳转进来或者搜索时，树根节点无全部

    if (!searchValue.value && !value) {
        params.value = _.cloneDeep(defualtParams);
    } else if (!!searchValue.value) {
        clickSearch = true;
        params.value = { ..._.cloneDeep(defualtParams) };
        // params.value.terms[1] = {
        //     terms: [
        //         {
        //             column: 'name',
        //             value: `%${searchValue.value}%`,
        //             termType: 'like',
        //         },
        //     ],
        // };
        params.value.terms = [
            ...(params.value?.terms || []),
            {
                terms: [
                    {
                        column: 'name',
                        value: `%${searchValue.value}%`,
                        termType: 'like',
                    },
                ],
            }
        ];
    } else {
        !!value && (params.value = value);
    }
    spinning.value = true;
    const res: any = await queryCollector(params.value);
    if (res.status === 200) {
        if (clickSearch) {
            defualtDataSource.value = res.result;
            if (res.result.length !== 0) {
                selectedKeys.value.length === 0 &&
                    (selectedKeys.value = [res.result[0].id]); // 通道跳转进来或者搜索时，默认选中第一个
            }
        } else {
            defualtDataSource.value = _.cloneDeep(root);
            defualtDataSource.value[0].children = res.result;
        }
        collectorAll.value = res.result;

        if (selectedKeys.value.length === 0) {
            selectedKeys.value = res.result.length ? ['*'] : [];
        }

        //激活change事件
        setTimeout(() => {
            const _selectedKeys = _.cloneDeep(selectedKeys.value);
            selectedKeys.value = [];
            selectedKeys.value = _selectedKeys;
        }, 0);
    }
    spinning.value = false;
};
const getChannelNoPaging = async () => {

    const res = await queryChannelNoPaging();
    Store.set('channelListAll', res.result);
};

const treeSelect = (keys: string, e: any) => {
  selectedKeys.value = [e.node?.id]
}

onMounted(() => {
    handleSearch(_.cloneDeep(defualtParams));
    getChannelNoPaging();
});

watch(
    () => selectedKeys.value[0],
    (n, p) => {
        const key = _.isArray(selectedKeys.value) ? selectedKeys.value[0] : selectedKeys.value;
        if (key) {
          if (key !== "*") {
            const row = collectorAll.value.find((i: any) => i.id === key);
            emits('change', row);
          } else {
            emits('change', {
              id: '*'
            });
          }
        }
    },
);

watch(
    () => searchValue.value,
    (value) => {
        if (!value) {
            setTimeout(() => {
                handleSearch(value);
            }, 0);
        }
    },
);
</script>

<style lang="less" scoped>
.tree-container {
    padding-right: 24px;
    width: 370px;
    .add-btn {
        margin: 10px 0;

        :deep(.ant-btn-primary) {
            width: 100%;
        }
    }

    :deep(.ant-tree-list-holder-inner) {
        width: 90%;
    }
    :deep(.ant-tree-list) {
        width: 110%;
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
                .tree-left-tag2 {
                    width: 50px;
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
