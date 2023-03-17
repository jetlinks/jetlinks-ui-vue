<!--产品分类 -->
<template>
    <page-container>
        <pro-search
            :columns="query.columns"
            target="category"
            @search="handleSearch"
        />
        <JProTable
            ref="tableRef"
            :columns="table.columns"
            :request="queryTree"
            model="TABLE"
            type="TREE"
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
                    新增
                </PermissionButton>
            </template>
            <template #action="slotProps">
                <j-space>
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
                        >
                            <template #icon><AIcon :type="i.icon" /></template>
                        </PermissionButton>
                    </template>
                </j-space>
            </template>
        </JProTable>
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
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
const tableRef = ref<Record<string, any>>({});
const modifyRef = ref();
const dataSource = ref<any>([]);
const currentForm = ref({});
const title = ref('');
const isAdd = ref(0);
const isChild = ref(0);
const tableLoading = ref(false);
// 筛选
const query = reactive({
    columns: [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            search: {
                type: 'string',
            },
        },
        {
            title: '排序',
            dataIndex: 'sortIndex',
            key: 'sortIndex',
            search: {
                type: 'number',
            },
            scopedSlots: true,
        },
        {
            title: '描述',
            key: 'description',
            dataIndex: 'description',
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
    ],
});
let params = ref();
/**
 * 搜索
 */
const handleSearch = (e: any) => {
    params.value = e 
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
            text: '编辑',
            tooltip: {
                title: '编辑',
            },
            icon: 'EditOutlined',
            onClick: async () => {
                title.value = '编辑分类';
                isAdd.value = 2;
                currentForm.value = data;
                nextTick(() => {
                    modifyRef.value.show(data);
                });
            },
        },
        {
            key: 'add',
            text: '添加子分类',
            tooltip: {
                title: '添加子分类',
            },
            icon: 'PlusCircleOutlined',
            onClick: () => {
                title.value = '新增子分类';
                isAdd.value = 0;
                currentForm.value = {};
                if (data.children && data.children.length > 0) {
                    isChild.value = 1;
                } else {
                    isChild.value = 2;
                }
                nextTick(() => {
                    modifyRef.value.show(data);
                });
            },
        },
        {
            key: 'delete',
            text: '删除',
            tooltip: {
                title: '删除',
            },
            popConfirm: {
                title: '确认删除?',
                okText: ' 确定',
                cancelText: '取消',
                onConfirm: async () => {
                    const resp = await deleteTree(data.id);
                    if (resp.status === 200) {
                        message.success('操作成功！');
                        tableRef.value.reload();
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

const table = reactive({
    columns: [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            width: 600,
        },
        {
            title: '排序',
            dataIndex: 'sortIndex',
            key: 'sortIndex',
            scopedSlots: true,
            width: 200,
        },
        {
            title: '说明',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            width: 700,
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            ellipsis: true,
            scopedSlots: true,
        },
    ],
    /**
     * 添加产品分类
     */
    add: async () => {
        title.value = '新增分类';
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
