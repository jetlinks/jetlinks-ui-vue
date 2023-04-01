<template>
    <div class="button-mange-container">
        <j-pro-table
            ref="tableRef"
            :columns="table.columns"
            model="TABLE"
            :dataSource="table.tableData"
            noPagination
        >
            <template #headerTitle>
                <PermissionButton
                    type="primary"
                    :hasPermission="`${permission}:update`"
                    @click="openDialog('新增', {})"
                >
                    <AIcon type="PlusOutlined" />新增
                </PermissionButton>
            </template>
            <template #action="slotProps">
                <j-space :size="16">
                    <PermissionButton
                        type="link"
                        :hasPermission="`${permission}:update`"
                        :tooltip="{ title: '编辑' }"
                        @click="openDialog('编辑', slotProps)"
                    >
                        <AIcon type="EditOutlined" />
                    </PermissionButton>
                    <PermissionButton
                        type="link"
                        :hasPermission="`${permission}:view`"
                        :tooltip="{ title: '查看' }"
                        @click="openDialog('查看', slotProps)"
                    >
                        <AIcon type="SearchOutlined" />
                    </PermissionButton>
                    <PermissionButton
                        type="link"
                        :tooltip="{ title: '删除' }"
                        :popConfirm="{
                            title: `确认删除`,
                            onConfirm: () => table.clickDel(slotProps),
                        }"
                    >
                        <AIcon type="DeleteOutlined" />
                    </PermissionButton>
                </j-space>
            </template>
        </j-pro-table>

        <div class="dialog">
            <ButtonAddDialog
                v-if="dialogVisible"
                v-model:visible="dialogVisible"
                :menu-info="menuInfo"
                :mode="dialogTitle"
                :data="selectItem"
                @confirm="table.getList"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import PermissionButton from '@/components/PermissionButton/index.vue';
import ButtonAddDialog from '../components/ButtonAddDialog.vue';
import { getMenuInfo_api, saveMenuInfo_api } from '@/api/system/menu';
import { message } from 'jetlinks-ui-components';

const permission = 'system/Menu';
// 路由
const route = useRoute();
const routeParams = reactive({
    id: route.params.id === ':id' ? '' : (route.params.id as string),
    ...route.query,
});
const paramsId = ref('');

// 弹窗相关
const selectItem = ref<any>({});
const dialogVisible = ref(false);
const dialogTitle = ref<'查看' | '新增' | '编辑'>('新增');
const openDialog = (mode: '查看' | '新增' | '编辑', row: object) => {
    if (!routeParams.id && !paramsId.value) {
        return message.warning('请先新增菜单基本信息');
    }
    console.log(3);

    selectItem.value = { ...row };
    dialogTitle.value = mode;
    dialogVisible.value = true;
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
                table.tableData =
                    (resp.result?.buttons as tableDataItem[]) || [];
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

watch(
    () => route.params.id,
    (value) => {
        if (!!value) {
            paramsId.value = value;
        }
    },
);
</script>

<style lang="less" scoped>
.button-mange-container {
    :deep(.ant-table-cell) {
        .ant-btn-link {
            padding: 0;
        }
    }
}
</style>
