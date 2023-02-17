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
                <PermissionButton
                    type="primary"
                    :uhasPermission="`${permission}:add`"
                    @click="table.clickAdd"
                >
                    <AIcon type="PlusOutlined" />新增
                </PermissionButton>
            </template>

            <template #action="slotProps">
                <a-space :size="16">
                    <PermissionButton
                        :uhasPermission="`${permission}:update`"
                        type="link"
                        :tooltip="{
                            title: '编辑',
                        }"
                        @click="table.clickEdit(slotProps)"
                    >
                        <AIcon type="EditOutlined" />
                    </PermissionButton>
                    <PermissionButton
                        type="link"
                        :uhasPermission="`${permission}:delete`"
                        :tooltip="{ title: '删除' }"
                        :popConfirm="{
                            title: `确定要删除吗`,
                            onConfirm: () => table.clickDel(slotProps),
                        }"
                    >
                        <AIcon type="DeleteOutlined" />
                    </PermissionButton>
                </a-space>
            </template>
        </JTable>

        <div class="dialogs">
            <AddDialog ref="addDialogRef" />
        </div>
    </a-card>
</template>

<script setup lang="ts" name="Role">
import PermissionButton from '@/components/PermissionButton/index.vue';
import AddDialog from './components/AddDialog.vue';
import { getRoleList_api, delRole_api } from '@/api/system/role';
import { message } from 'ant-design-vue';

const permission = 'system/Role';

const addDialogRef = ref(); // 新增弹窗实例
const router = useRouter();
const route = useRoute();

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
        addDialogRef.value.openDialog(true, {});
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
nextTick(() => {
    route.query.save && table.clickAdd();
});
</script>

<style lang="less" scoped>
.role-container {

    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}

</style>
