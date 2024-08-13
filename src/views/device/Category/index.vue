<!--产品分类 -->
<template>
    <page-container>
        <pro-search
            :columns="query.columns"
            target="category"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="tableRef"
                :columns="table.columns"
                :request="queryTree"
                model="TABLE"
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
                <template #headerTitle>
                    <PermissionButton
                        type="primary"
                        @click="add"
                        hasPermission="device/Category:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        {{ $t('Category.index.882521-0') }}
                    </PermissionButton>
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
                                :hasPermission="'device/Category:' + i.key"
                                :tooltip="{
                                    ...i.tooltip,
                                }"
                                @click="i.onClick"
                                type="link"
                                style="padding: 0px"
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
        <!-- 新增和编辑弹窗 -->
        <ModifyModal
            ref="modifyRef"
            :formData="currentForm"
            :title="title"
            :isAdd="isAdd"
            :isChild="isChild"
            @refresh="refresh"
        />
    </page-container>
</template>
<script lang="ts" name="Category" setup>
import { queryTree, deleteTree } from '@/api/device/category';
import type { ActionsType } from '@/components/Table/index.vue';
import ModifyModal from './components/modifyModal/index.vue';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const expandedRowKeys = ref<any>([]);
const tableRef = ref<Record<string, any>>({});
const modifyRef = ref();
const dataSource = ref<any>([]);
const currentForm = ref({});
const title = ref('');
const isAdd = ref(0);
const isChild = ref(0);
const tableLoading = ref(false);
const addSortId = ref();
// 筛选
const query = reactive({
    columns: [
        {
            title: $t('Category.index.882521-1'),
            dataIndex: 'name',
            key: 'name',
            search: {
                type: 'string',
            },
        },
        {
            title: $t('Category.index.882521-2'),
            dataIndex: 'sortIndex',
            key: 'sortIndex',
            search: {
                type: 'number',
                componentProps: {
                    precision: 0,
                    min: 1,
                },
            },
            scopedSlots: true,
        },
        {
            title: $t('Category.index.882521-3'),
            key: 'description',
            dataIndex: 'description',
            search: {
                type: 'string',
            },
        },
        {
            title: $t('Category.index.882521-4'),
            key: 'action',
            fixed: 'right',
            width: 250,
            scopedSlots: true,
        },
    ],
});
let params = ref();
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
    data: Partial<Record<string, any>>,
    type: 'table',
): ActionsType[] => {
    if (!data) return [];
    const actions = [
        {
            key: 'update',
            text: $t('Category.index.882521-5'),
            tooltip: {
                title: $t('Category.index.882521-5'),
            },
            icon: 'EditOutlined',
            onClick: async () => {
                title.value = $t('Category.index.882521-6');
                isAdd.value = 2;
                currentForm.value = data;
                nextTick(() => {
                    modifyRef.value.show(data);
                });
            },
        },
        {
            key: 'add',
            text: $t('Category.index.882521-7'),
            tooltip: {
                title: $t('Category.index.882521-7'),
            },
            icon: 'PlusCircleOutlined',
            onClick: () => {
                title.value = $t('Category.index.882521-8');
                isAdd.value = 0;
                currentForm.value = {};
                if (data.children && data.children.length > 0) {
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
            text: $t('Category.index.882521-9'),
            tooltip: {
                title: $t('Category.index.882521-9'),
            },
            popConfirm: {
                title: $t('Category.index.882521-10'),
                okText: ' 确定',
                cancelText: $t('Category.index.882521-12'),
                onConfirm: () => {
                    const response = deleteTree(data.id);
                    response.then((resp) => {
                        if (resp.status === 200) {
                            onlyMessage($t('Category.index.882521-13'));
                            tableRef.value.reload();
                        } else {
                            onlyMessage($t('Category.index.882521-14'), 'error');
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
    columns: [
        {
            title: $t('Category.index.882521-1'),
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            width: 500,
        },
        {
            title: $t('Category.index.882521-2'),
            dataIndex: 'sortIndex',
            key: 'sortIndex',
            scopedSlots: true,
            width: 100,
        },
        {
            title: $t('Category.index.882521-3'),
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: $t('Category.index.882521-4'),
            key: 'action',
            fixed: 'right',
            ellipsis: true,
            scopedSlots: true,
            width: 120,
        },
    ],
    /**
     * 添加产品分类
     */
    add: async () => {
        title.value = $t('Category.index.882521-15');
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
        console.log(expandedRowKeys.value);
        tableRef.value.reload();
    },
});
const { add, columns, refresh } = toRefs(table);
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
