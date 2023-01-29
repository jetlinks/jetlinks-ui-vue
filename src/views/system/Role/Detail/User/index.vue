<template>
    <a-card class="role-user-container">
        <Search :columns="query.columns" />

        <JTable
            ref="tableRef"
            :columns="table.columns"
            :request="getUserByRole_api"
            model="TABLE"
            :defaultParams="query.params"
            :rowSelection="{
                selectedRowKeys: table._selectedRowKeys,
                onChange: table.onSelectChange,
            }"
            @cancelSelect="table.cancelSelect"
        >
            <template #headerTitle>
                <a-button type="primary" @click="table.clickAdd"
                    ><plus-outlined />新增</a-button
                >
            </template>

            <template #action="slotProps">
                <a-space :size="16">
                    <a-popconfirm
                        title="确认解绑"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="table.clickUnBind(slotProps)"
                    >
                        <a-tooltip>
                            <template #title>解绑</template>
                            <a-button style="padding: 0" type="link">
                                <disconnect-outlined />
                            </a-button>
                        </a-tooltip>
                    </a-popconfirm>
                </a-space>
            </template>
        </JTable>

        <div class="dialogs">
            <AddUserDialog :open="dialog.openAdd" @refresh="table.refresh" />
        </div>
    </a-card>
</template>

<script setup lang="ts" name="RoleUser">
import { PlusOutlined, DisconnectOutlined } from '@ant-design/icons-vue';
import AddUserDialog from '../components/AddUserDialog.vue';
import { getUserByRole_api, unbindUser_api } from '@/api/system/role';
import { message } from 'ant-design-vue';
import userType from './index';

const route = useRoute();
const roleId = route.params.id as string;
const query = reactive<userType.queryType>({
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
const table = reactive<userType.tableType>({
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
    // 点击打开新增弹窗
    clickAdd: () => {
        dialog.openAdd += 1;
    },
    // 点击解绑
    clickUnBind: (row: any) => {
        table.unbind([row.id]);
    },
    // 批量解绑
    unbind: (ids: string[] = []) => {
        unbindUser_api(roleId, ids).then((resp) => {
            if (resp.status === 200) {
                message.success('操作成功');
                table.refresh();
            }
        });
    },
    // 刷新表格
    refresh: () => {
        tableRef.value.reload();
    },
    // 多选
    _selectedRowKeys: [] as string[],
    onSelectChange: (keys: string[]) => {
        table._selectedRowKeys = [...keys];
    },
    cancelSelect: () => {
        table._selectedRowKeys = [];
    },
});

// 弹窗相关
const dialog = reactive({
    openAdd: 0,
});
</script>

<style lang="less" scoped></style>
