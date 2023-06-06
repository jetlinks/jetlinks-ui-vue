<template>
    <page-container>
        <div class="role-container">
            <pro-search
                :columns="columns"
                target="category"
                @search="(params:any)=>queryParams = {...params}"
            />
            <FullPage>
                <j-pro-table
                    ref="tableRef"
                    :columns="columns"
                    :request="getRoleList_api"
                    model="TABLE"
                    :params="queryParams"
                    :defaultParams="{
                        pageSize: 10,
                        sorts: [
                            { name: 'createTime', order: 'desc' },
                            { name: 'id', order: 'desc' },
                        ],
                    }"
                    :pagination="{
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '50', '100'],
                    }"
                >
                    <template #headerTitle>
                        <PermissionButton
                            type="primary"
                            :hasPermission="`${permission}:add`"
                            @click="dialogVisible = true"
                        >
                            <AIcon type="PlusOutlined" />新增
                        </PermissionButton>
                    </template>

                    <template #action="slotProps">
                        <j-space :size="16">
                            <PermissionButton
                                :hasPermission="`${permission}:update`"
                                type="link"
                                :tooltip="{
                                    title: '编辑',
                                }"
                                @click="
                                    jumpPage(`system/Role/Detail`, {
                                        id: slotProps.id,
                                    })
                                "
                            >
                                <AIcon type="EditOutlined" />
                            </PermissionButton>
                            <PermissionButton
                                type="link"
                                :hasPermission="`${permission}:delete`"
                                :tooltip="{ title: '删除' }"
                                :popConfirm="{
                                    title: `确定要删除吗`,
                                    onConfirm: () => clickDel(slotProps),
                                }"
                            >
                                <AIcon type="DeleteOutlined" />
                            </PermissionButton>
                        </j-space>
                    </template>
                </j-pro-table>
            </FullPage>

            <AddDialog v-if="dialogVisible" v-model:visible="dialogVisible" />
        </div>
    </page-container>
</template>

<script setup lang="ts" name="Role">
import PermissionButton from '@/components/PermissionButton/index.vue';
import AddDialog from './components/AddDialog.vue';
import { getRoleList_api, delRole_api } from '@/api/system/role';
import { message } from 'jetlinks-ui-components';
import { useMenuStore } from '@/store/menu';

const permission = 'system/Role';
const { jumpPage } = useMenuStore();

const isSave = !!useRoute().query.save;

const columns = [
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
        title: '说明',
        key: 'description',
        ellipsis: true,
        dataIndex: 'description',
        search: {
            type: 'string',
        },
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 120,
        fixed: 'right',
        scopedSlots: true,
    },
];
const queryParams = ref({});
// 表格
const tableRef = ref<Record<string, any>>();
const clickDel = (row: any) => {
    delRole_api(row.id).then((resp: any) => {
        if (resp.status === 200) {
            tableRef.value?.reload();
            message.success('操作成功!');
        }
    });
};
const dialogVisible = ref(isSave);
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
