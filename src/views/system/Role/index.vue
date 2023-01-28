<template>
    <a-card class="role-container">
        <Search :columns="query.columns" />

        <JTable
            ref="tableRef"
            :columns="table.columns"
            :request="getRoleList_api"
            model="TABLE"
            :params="query.params"
        >
            <template #headerTitle>
                <a-button type="primary" @click="table.clickAdd"
                    ><plus-outlined />新增</a-button
                >
            </template>

            <template #action="slotProps">
                <a-space :size="16">
                    <a-tooltip>
                        <template #title>编辑</template>
                        <a-button
                            style="padding: 0"
                            type="link"
                            @click="table.clickEdit(slotProps)"
                        >
                            <edit-outlined />
                        </a-button>
                    </a-tooltip>
                    <a-popconfirm
                        title="确定要删除吗？"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="table.clickDel(slotProps)"
                    >
                        <a-tooltip>
                            <template #title>删除</template>
                            <a-button style="padding: 0" type="link">
                                <delete-outlined />
                            </a-button>
                        </a-tooltip>
                    </a-popconfirm>
                </a-space>
            </template>
        </JTable>

        <div class="dialogs">
            <AddDialog ref="addDialogRef" />
        </div>
    </a-card>
</template>

<script setup lang="ts" name="Role">
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
} from '@ant-design/icons-vue';
import AddDialog from './components/AddDialog.vue';
import { getRoleList_api, delRole_api } from '@/api/system/role';
import { message } from 'ant-design-vue';
const addDialogRef = ref(); // 新增弹窗实例
const router = useRouter();
// 筛选
const query = reactive({
    columns: [
        {
            title: '标识',
            dataIndex: 'id',
            key: 'id',
            ellipsis: true,
            fixed: 'left',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
        },
        {
            title: '描述',
            key: 'description',
            ellipsis: true,
            dataIndex: 'description',
            filters: true,
            onFilter: true,
        },
        {
            title: '操作',
            valueType: 'option',
            width: 200,
            fixed: 'right',
        },
    ],
    params: {},
});
// 表格
const tableRef = ref<Record<string, any>>({});
const table = reactive({
    columns: [
        {
            title: '标识',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '说明',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            scopedSlots: true,
        },
    ],
    tableData: [],
    clickAdd: () => {
        addDialogRef.value.openDialog(true, {})
    },
    clickDel: (row: any) => {
        delRole_api(row.id).then((resp: any) => {
            if (resp.status === 200) {
                tableRef.value?.reload();
                message.success('操作成功!');
            }
        });
    },
    clickEdit: (row: any) => {
        router.push(`/system/Role/detail/${row.id}`);
    },
});

</script>

<style lang="less" scoped></style>
