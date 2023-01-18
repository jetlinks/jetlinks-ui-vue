<template>
    <a-card class="role-user-container">
        <Search :columns="query.columns" />

        <JTable
            ref="tableRef"
            :columns="table.columns"
            :request="getUserByRole_api"
            model="TABLE"
            :params="query.params"
        >
            <template #headerTitle>
                <a-button type="primary" @click="table.clickAdd"
                    ><plus-outlined />新增</a-button
                >
            </template>

            <template #action="slotProps">
                <a-space :size="16"> </a-space>
            </template>
        </JTable>

        <div class="dialogs">
            <AddUserDialog :open="dialog.openAdd" @refresh="table.refresh" />
        </div>
    </a-card>
</template>

<script setup lang="ts" name="RoleUser">
import AddUserDialog from '../components/AddUserDialog.vue';
import { getUserByRole_api } from '@/api/system/role';

const route = useRoute()
const query = reactive({
    columns: [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
        },
    ],
    params: {
        terms: [
            {
                terms: [
                    {
                        column: 'id$in-dimension$role',
                        value: route.params.id,
                    },
                ],
            },
        ],
    },
});

const tableRef = ref<Record<string, any>>({});
const table = reactive({
    columns: [
        {
            title: '姓名',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: '用户名',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
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
        dialog.openAdd += 1;
    },
    refresh: ()=>{
        tableRef.value.reload()
    }
});

// 弹窗相关
const dialog = reactive({
    openAdd: 0,
});
</script>

<style lang="less" scoped></style>
