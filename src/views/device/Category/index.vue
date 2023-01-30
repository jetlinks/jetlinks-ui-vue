<!--产品分类 -->
<template>
    <a-card class="product-category">
        <Search :columns="query.columns" target="category" @search="search" />
        <JTable
            ref="tableRef"
            :columns="table.columns"
            :request="queryTree"
            model="TABLE"
            :params="query.params"
        >
            <template #headerTitle>
                <a-button type="primary" @click="add"
                    ><plus-outlined />新增</a-button
                >
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
        <!-- 新增和编辑弹窗 -->
        <ModifyModal
            ref="modifyRef"
            :formData="currentForm"
            :title="title"
            :isAdd="isAdd"
            :isChild="isChild"
            @refresh="refresh"
        />
    </a-card>
</template>
<script lang="ts" name="Category" setup>
import { queryTree, deleteTree } from '@/api/device/category';
import type { ActionsType } from '@/components/Table/index.vue';
import ModifyModal from './components/modifyModal/index.vue';
import type { TableColumnType, TableProps } from 'ant-design-vue';
import { message } from 'ant-design-vue';
const tableRef = ref<Record<string, any>>({});
const modifyRef = ref();
const dataSource = ref([]);
const currentForm = ref({});
const title = ref('');
const isAdd = ref(0);
const isChild = ref(0);
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
    params: {
        paging: false,
        sorts: [
            { name: 'sortIndex', order: 'asc' },
            {
                name: 'createTime',
                order: 'desc',
            },
        ],
    },
});

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
            key: 'edit',
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
            popConfirm: {
                title: '确认删除?',
                okText: ' 确定',
                cancelText: '取消',
                onConfirm: async () => {
                    const resp = await deleteTree(data.id);
                    if (resp.status === 200) {
                        message.success('操作成功！');
                        tableRef.value?.reload();
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
        { title: '名称', dataIndex: 'name', key: 'name' },
        {
            title: '排序',
            dataIndex: 'sortIndex',
            key: 'sortIndex',
            scopedSlots: true,
        },
        {
            title: '说明',
            dataIndex: 'describe',
            key: 'describe',
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 250,
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
        tableRef.value?.reload();
    },
});
const { add, columns, refresh } = toRefs(table);
/**
 * 初始化
 */
</script>
<style scoped lang="less"></style>
