<!--产品分类 -->
<template>
    <j-page-container>
        <pro-search
            :columns="columns"
            target="category"
            @search="handleSearch"
        />
        <FullPage :fixed="false">
            <j-pro-table
                ref="tableRef"
                :columns="columns"
                :request="queryTree"
                mode="TABLE"
                type="TREE"
                v-model:expandedRowKeys="expandedRowKeys"
                :scroll="{ y: 550 }"
                :defaultParams="{
                    paging: false,
                    sorts: [
                        { name: 'sortIndex', order: 'asc' },
                        {
                            name: 'createTime',
                            order: 'desc',
                        },
                    ],
                }"
                :params="params"
                :loading="tableLoading"
            >
                <template #headerLeftRender>
                    <j-permission-button
                        type="primary"
                        @click="add"
                        hasPermission="device/Category:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        {{ $t('Category.index.779033-0') }}
                    </j-permission-button>
                </template>
              <template #name="slotProps">
                <j-ellipsis>{{ slotProps?.i18nName || slotProps?.name }}</j-ellipsis>
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
                                :hasPermission="'device/Category:' + i.key"
                                :tooltip="{
                                    ...i.tooltip,
                                }"
                                @click="i.onClick"
                                type="link"
                                style="padding: 0; margin: 0"
                                :danger="i.key === 'delete'"
                            >
                                <template #icon
                                    ><AIcon :type="i.icon"
                                /></template>
                            </j-permission-button>
                        </template>
                    </a-space>
                </template>
            </j-pro-table>
        </FullPage>
        <!-- 新增和编辑弹窗 -->
        <ModifyModal
            ref="modifyRef"
            :formData="currentForm"
            :title="title"
            :isAdd="isAdd"
            :isChild="isChild"
            @refresh="refresh"
        />
    </j-page-container>
</template>
<script lang="ts" name="Category" setup>
import { queryTree, deleteTree } from '../../../api/category';
import ModifyModal from './components/modifyModal/index.vue';
import { onlyMessage } from '@jetlinks-web-core/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const expandedRowKeys = ref<any>([]);
const tableRef = ref<Record<string, any>>({});
const modifyRef = ref();
const currentForm = ref({});
const title = ref('');
const isAdd = ref(0);
const isChild = ref(0);
const tableLoading = ref(false);
const addSortId = ref();
// 筛选
const columns = [
    {
        title: $t('Category.index.779033-1'),
        dataIndex: 'name',
        key: 'name',
        search: {
            type: 'string',
        },
        ellipsis: true,
    },
    {
        title: $t('Category.index.779033-2'),
        dataIndex: 'sortIndex',
        key: 'sortIndex',
        search: {
            type: 'number',
            componentProps: {
                precision: 0,
                min: 1,
            },
        },
        ellipsis: true,
        scopedSlots: true,
    },
    {
        title: $t('Category.index.779033-3'),
        key: 'description',
        dataIndex: 'description',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Category.index.779033-4'),
        key: 'action',
        dataIndex: 'action',
        fixed: 'right',
        width: 200,
        scopedSlots: true,
    },
]

const params = ref();
/**
 * 搜索
 */
const handleSearch = (e: any) => {
    params.value = e;
    expandedRowKeys.value = [];
};
/**
 * 操作栏按钮
 */
const getActions = (
    data: Partial<Record<string, any>>
): any[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: $t('Category.index.779033-5'),
            tooltip: {
                title: $t('Category.index.779033-5'),
            },
            icon: 'EditOutlined',
            onClick: async () => {
                title.value = $t('Category.index.779033-6');
                isAdd.value = 2;
                currentForm.value = data;
                nextTick(() => {
                    modifyRef.value.show(data);
                });
            },
        },
        {
            key: 'add',
            text: $t('Category.index.779033-7'),
            tooltip: {
                title: $t('Category.index.779033-7'),
            },
            icon: 'PlusCircleOutlined',
            onClick: () => {
                title.value = $t('Category.index.779033-8');
                isAdd.value = 0;
                currentForm.value = {};
                if (data._children && data._children.length > 0) {
                    isChild.value = 1;
                } else {
                    isChild.value = 2;
                }
                nextTick(() => {
                    modifyRef.value.show(data);
                    addSortId.value = data.id;
                });
            },
        },
        {
            key: 'delete',
            text: $t('Category.index.779033-9'),
            tooltip: {
                title: $t('Category.index.779033-9'),
            },
            popConfirm: {
                title: $t('Category.index.779033-10'),
                okText: ' 确定',
                cancelText: $t('Category.index.779033-12'),
                onConfirm: () => {
                    const response = deleteTree(data.id);
                    response.then((resp) => {
                        if (resp.status === 200) {
                            onlyMessage($t('Category.index.779033-13'));
                            tableRef.value.reload();
                        } else {
                            onlyMessage($t('Category.index.779033-14'), 'error');
                        }
                    });
                    return response
                },
            },
            icon: 'DeleteOutlined',
        },
    ];
    return actions;
};

const table = reactive({
    // columns: [
    //     {
    //         title: $t('Category.index.779033-1'),
    //         dataIndex: 'name',
    //         key: 'name',
    //         scopedSlots: true,
    //         width: 500,
    //     },
    //     {
    //         title: $t('Category.index.779033-2'),
    //         dataIndex: 'sortIndex',
    //         key: 'sortIndex',
    //         scopedSlots: true,
    //         width: 100,
    //     },
    //     {
    //         title: $t('Category.index.779033-3'),
    //         dataIndex: 'description',
    //         key: 'description',
    //         ellipsis: true,
    //     },
    //     {
    //         title: $t('Category.index.779033-4'),
    //         key: 'action',
    //         fixed: 'right',
    //         ellipsis: true,
    //         scopedSlots: true,
    //         width: 120,
    //     },
    // ],
    /**
     * 添加产品分类
     */
    add: async () => {
        title.value = $t('Category.index.779033-15');
        isAdd.value = 0;
        isChild.value = 3;
        nextTick(() => {
            modifyRef.value.show(currentForm.value);
        });
    },
    /**
     * 刷新表格数据
     */
    refresh: () => {
        if (isAdd.value === 0 && isChild.value !== 3) {
            expandedRowKeys.value.push(addSortId.value);
        }
        tableRef.value.reload();
    },
});
const { add, refresh } = toRefs(table);
/**
 * 初始化
 */
</script>
<style scoped lang="less">
:deep(._jtable-body_1eyxz_1 ._jtable-pagination_1eyxz_43) {
    margin-top: 20px;
    display: none;
    justify-content: flex-end;
}
</style>
