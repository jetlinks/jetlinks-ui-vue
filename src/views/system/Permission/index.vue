<template>
    <div class="permission-container">
        <Search :columns="query.columns" @search="query.search" />

        <JTable
            ref="tableRef"
            :columns="table.columns"
            :request="getPermission_api"
            model="TABLE"
            :params="query.params"
            :defaultParams="{ sorts: [{ name: 'id', order: 'asc' }] }"
        >
            <template #headerTitle>
                <a-button type="primary" @click="table.openDialog(undefined)"
                    ><plus-outlined />新增</a-button
                >
            </template>
            <template #status="slotProps">
                <StatusLabel :status-value="slotProps.status" />
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <a-tooltip>
                        <template #title>编辑</template>
                        <a-button
                            style="padding: 0"
                            type="link"
                            @click="table.openDialog(slotProps)"
                        >
                            <edit-outlined />
                        </a-button>
                    </a-tooltip>

                    <a-popconfirm
                        :title="`确定要${
                            slotProps.status ? '禁用' : '启用'
                        }吗？`"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="table.changeStatus(slotProps)"
                    >
                        <a-tooltip>
                            <template #title>{{
                                slotProps.status ? '禁用' : '启用'
                            }}</template>
                            <a-button style="padding: 0" type="link">
                                <stop-outlined v-if="slotProps.status" />
                                <play-circle-outlined v-else />
                            </a-button>
                        </a-tooltip>
                    </a-popconfirm>

                    <a-popconfirm
                        title="确定要删除吗？"
                        ok-text="确定"
                        cancel-text="取消"
                        @confirm="table.clickDel(slotProps)"
                        :disabled="slotProps.status"
                    >
                        <a-tooltip>
                            <template #title>删除</template>
                            <a-button
                                style="padding: 0"
                                type="link"
                                :disabled="slotProps.status"
                            >
                                <delete-outlined />
                            </a-button>
                        </a-tooltip>
                    </a-popconfirm>
                </a-space>
            </template>
        </JTable>

        <div class="dialogs">
            <EditDialog ref="editDialogRef" @refresh="table.refresh" />
        </div>
    </div>
</template>

<script setup lang="ts">
import EditDialog from './components/EditDialog.vue';
import StatusLabel from './components/StatusLabel.vue';
import { message } from 'ant-design-vue';
import {
    EditOutlined,
    DeleteOutlined,
    PlusOutlined,
    StopOutlined,
    PlayCircleOutlined,
} from '@ant-design/icons-vue';
import { getPermission_api, editPermission_api, delPermission_api } from '@/api/system/permission';

const editDialogRef = ref(); // 新增弹窗实例
const tableRef = ref<Record<string, any>>({}); // 表格实例

// 筛选
const query = reactive({
    columns: [
        {
            title: '标识',
            dataIndex: 'id',
            key: 'id',
            ellipsis: true,
            fixed: 'left',
            search: {
                type: 'string',
            },
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            ellipsis: true,
            search: {
                type: 'string',
            },
        },
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            ellipsis: true,
            search: {
                rename: 'status',
                type: 'select',
                options: [
                    {
                        label: '启用',
                        value: 1,
                    },
                    {
                        label: '禁用',
                        value: 0,
                    },
                ],
            },
        },
    ],
    params: {},
    search: (params:object)=>{
        query.params = params
    }
});

// 表格
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
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            scopedSlots: true,
        },
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action',
            scopedSlots: true,
        },
    ],
    tableData: [],
    openDialog: (row: object | undefined = {}) => {
        editDialogRef.value.openDialog(true, row);
    },
    changeStatus: (row: any) => {
        const params = {
            ...row,
            status: row.status ? 0 : 1,
        };
        editPermission_api(params).then(() => {
            message.success('操作成功');
            tableRef.value.reload();
        });
    },
    clickDel: (row: any) => {
        delPermission_api(row.id).then((resp: any) => {
            if (resp.status === 200) {
                tableRef.value?.reload();
                message.success('操作成功!');
            }
        });
    },
    refresh: () => {
        tableRef.value.reload();
    },
});
</script>

<style lang="less" scoped></style>
