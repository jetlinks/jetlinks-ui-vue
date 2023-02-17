<template>
    <div class="button-mange-container">
        <JTable
            ref="tableRef"
            :columns="table.columns"
            model="TABLE"
            :dataSource="table.tableData"
            noPagination
        >
            <template #headerTitle>
                <PermissionButton
                    type="primary"
                    :uhasPermission="`${permission}:update`"
                    @click="dialog.openDialog('新增')"
                >
                    <AIcon type="PlusOutlined" />新增
                </PermissionButton>
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <PermissionButton
                        type="link"
                        :uhasPermission="`${permission}:update`"
                        :tooltip="{ title: '编辑' }"
                        @click="dialog.openDialog('编辑', slotProps)"
                    >
                        <AIcon type="EditOutlined" />
                    </PermissionButton>
                    <PermissionButton
                        type="link"
                        :uhasPermission="true"
                        :tooltip="{ title: '查看' }"
                        @click="dialog.openDialog('查看', slotProps)"
                    >
                        <AIcon type="SearchOutlined" />
                    </PermissionButton>
                    <PermissionButton
                        type="link"
                        :uhasPermission="`${permission}:update`"
                        :tooltip="{ title: '删除' }"
                        :popConfirm="{
                            title: `确认删除`,
                            onConfirm: () => table.clickDel(slotProps),
                        }"
                    >
                        <AIcon type="DeleteOutlined" />
                    </PermissionButton>
                </a-space>
            </template>
        </JTable>

        <div class="dialog">
            <ButtonAddDialog
                ref="dialogRef"
                @confirm="dialog.confirm"
                :menu-info="menuInfo"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import PermissionButton from '@/components/PermissionButton/index.vue';

import ButtonAddDialog from '../components/ButtonAddDialog.vue';

import { getMenuInfo_api, saveMenuInfo_api } from '@/api/system/menu';
import { message } from 'ant-design-vue';

const permission = 'system/Menu';
// 路由
const route = useRoute();
const routeParams = {
    id: route.params.id === ':id' ? '' : (route.params.id as string),
    ...route.query,
};

// 弹窗相关
const dialogRef = ref<any>(null);
const dialog = {
    // 打开弹窗
    openDialog: (mode: string, row?: object) => {
        dialogRef.value && dialogRef.value.openDialog(mode, { ...row });
    },
    confirm: () => {
        table.getList();
    },
};
// 菜单的基本信息-其中包括了表格的数据
const menuInfo = ref<any>({});
// 表格相关
const table = reactive({
    columns: [
        {
            title: '编码',
            dataIndex: 'id',
            key: 'id',
            width: 220,
        },
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: 300,
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
            width: 240,
        },
    ],
    tableData: [] as tableDataItem[],
    getList: () => {
        routeParams.id &&
            getMenuInfo_api(routeParams.id).then((resp: any) => {
                menuInfo.value = resp.result;
                table.tableData = resp.result.buttons as tableDataItem[];
            });
    },
    clickDel: (row: tableDataItem) => {
        const buttons = menuInfo.value.buttons.filter(
            (item: tableDataItem) => item.id !== row.id,
        );
        const params = {
            ...menuInfo.value,
            buttons,
        };
        saveMenuInfo_api(params).then(() => {
            message.success('操作成功');
            table.getList();
        });
    },
});
table.getList();
type tableDataItem = {
    id: string;
    name: string;
    description?: string;
    permissions: object[];
};
</script>

<style scoped></style>
