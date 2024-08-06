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
                    @click="openDialog($t('Detail.ButtonMange.159184-0'), {})"
                >
                    <AIcon type="PlusOutlined" />{{ $t('Detail.ButtonMange.159184-0') }}
                </PermissionButton>
            </template>
            <template #action="slotProps">
                <j-space :size="16">
                    <PermissionButton
                        type="link"
                        :hasPermission="`${permission}:update`"
                        :tooltip="{ title: $t('Detail.ButtonMange.159184-1') }"
                        @click="openDialog($t('Detail.ButtonMange.159184-1'), slotProps)"
                    >
                        <AIcon type="EditOutlined" />
                    </PermissionButton>
                    <PermissionButton
                        type="link"
                        :hasPermission="`${permission}:view`"
                        :tooltip="{ title: $t('Detail.ButtonMange.159184-2') }"
                        @click="openDialog($t('Detail.ButtonMange.159184-2'), slotProps)"
                    >
                        <AIcon type="SearchOutlined" />
                    </PermissionButton>
                    <PermissionButton
                        type="link"
                        :tooltip="{ title: $t('Detail.ButtonMange.159184-3') }"
                        :popConfirm="{
                            title: $t('Detail.ButtonMange.159184-4'),
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
                :menuData="table.tableData"
                @confirm="table.getList"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import PermissionButton from '@/components/PermissionButton/index.vue';
import ButtonAddDialog from '../components/ButtonAddDialog.vue';
import { getMenuInfo_api, saveMenuInfo_api } from '@/api/system/menu';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

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
const dialogTitle = ref();
const openDialog = (mode:any, row: object) => {
    if (!routeParams.id && !paramsId.value) {
        return onlyMessage($t('Detail.ButtonMange.159184-5'), 'warning');
    }
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
            title: $t('Detail.ButtonMange.159184-6'),
            dataIndex: 'id',
            key: 'id',
            width: 220,
        },
        {
            title: $t('Detail.ButtonMange.159184-7'),
            dataIndex: 'name',
            key: 'name',
            width: 300,
        },
        {
            title: $t('Detail.ButtonMange.159184-8'),
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
        },
        {
            title: $t('Detail.ButtonMange.159184-9'),
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
        const response = saveMenuInfo_api(params)
        response.then(() => {
            onlyMessage($t('Detail.ButtonMange.159184-10'));
            table.getList();
        });
        return response
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
