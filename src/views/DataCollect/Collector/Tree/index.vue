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
                type="primary"
                class="add-btn"
                @click="openDialog()"
            >
                新增采集器
            </PermissionButton>
        </div>
        <a-spin :spinning="spinning">
            <a-tree
                :tree-data="defualtDataSource"
                v-model:selected-keys="selectedKeys"
                :fieldNames="{ key: 'name' }"
                v-if="defualtDataSource[0].children.length !== 0"
                @check="checkTree"
            >
                <!-- <a-tree
                :tree-data="defualtDataSource"
                v-model:selected-keys="selectedKeys"
                :fieldNames="{ key: 'name' }"
                :height="600"
                v-if="defualtDataSource[0].children.length !== 0"
                @check="checkTree"
            > -->
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
                            @click="openDialog(data)"
                        >
                            <AIcon type="EditOutlined" />
                        </PermissionButton>
                        <PermissionButton
                            v-if="data?.state?.value === 'disabled'"
                            type="link"
                            :tooltip="{
                                title: '启用',
                            }"
                            @click="openDialog(data)"
                        >
                            <AIcon type="CheckCircleOutlined" />
                        </PermissionButton>
                        <PermissionButton
                            v-if="data?.state?.value !== 'disabled'"
                            type="link"
                            :tooltip="{
                                title: '禁用',
                            }"
                            @click="
                                openDialog({
                                    ...data,
                                    id: '',
                                    parentId: data.id,
                                })
                            "
                        >
                            <AIcon type="StopOutlined" />
                        </PermissionButton>
                        <PermissionButton
                            type="link"
                            :tooltip="{ title: '删除' }"
                            :popConfirm="{
                                title: `确定要删除吗`,
                                onConfirm: () => openDialog(data.id),
                            }"
                        >
                            <AIcon type="DeleteOutlined" />
                        </PermissionButton>
                    </span>
                </template>
            </a-tree>
            <j-empty v-else description="暂无数据" />
        </a-spin>
    </div>
</template>

<script setup lang="ts" name="TreePage">
import type { TreeProps } from 'ant-design-vue';
import { treeFilter } from '@/utils/comm';
import { queryCollector } from '@/api/data-collect/collector';

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const emits = defineEmits(['change']);

const route = useRoute();
const channelId = route.query?.channelId;

const colorMap = new Map();
colorMap.set('running', 'success');
colorMap.set('partialError', 'warning');
colorMap.set('failed', 'error');
colorMap.set('stopped', 'default');

const spinning = ref(false);
const selectedKeys = ref();
const searchValue = ref();

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

const openDialog = (row: any = {}) => {
    console.log(row);
};

const checkTree = (value: any) => {
    console.log(22, value);
};

const handleSearch = async (value: string) => {
    if (!!searchValue.value) {
        params.value = { ...defualtParams };
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
    }
    spinning.value = false;
};

const getState = (record: any) => {
    const enabled = record?.state?.value === 'enabled';
    if (record) {
        return enabled
            ? {
                  value: record?.runningState?.value,
                  text: record?.runningState?.text,
              }
            : {
                  value: 'processing',
                  text: '禁用',
              };
    } else {
        return {};
    }
};

onMounted(() => {
    handleSearch(defualtParams);
});

watch(selectedKeys, (n) => {
    emits('change', n[0]);
});
// watch(
//     () => route.query,
//     (value) => {
//         if (value?.channelId) {
//             params.value = {
//                 ...defualtParams,
//                 terms: [
//                     {
//                         column: 'channelId',
//                         value: value?.channelId,
//                     },
//                 ],
//             };

//             handleSearch(params.value);
//         } else {
//             handleSearch(defualtParams);
//         }
//     },
//     { immediate: true, deep: true },
// );
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
                height: 20px;
                .tree-left-title {
                    width: 80px;
                    // margin-left: -5px;
                }
                .tree-left-tag {
                    width: 70px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
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
