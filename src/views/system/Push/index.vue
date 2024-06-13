<template>
    <page-container>
        <pro-search :columns="columnsConfig" @search="handleProSearch" />

        <full-page>
            <j-pro-table
                ref="tableRef"
                :columuns="columnsConfig"
                :request="queryData"
                :params="globParams"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
            >
                <template #headerTitle>
                    <PermissionButton
                        type="primary"
                        @click="tableHandler.openDialog('add')"
                    >
                        <AIcon type="PlusOutlined" />新增
                    </PermissionButton>
                </template>
                <template #action="actionScope">
                    <j-space :size="16">
                        <PermissionButton
                            type="link"
                            :tooltip="{ title: '编辑' }"
                            @click="
                                tableHandler.openDialog('edit', actionScope)
                            "
                        >
                            <AIcon type="EditOutlined" />
                        </PermissionButton>
                        <PermissionButton
                            type="link"
                            :tooltip="{
                                title: `${
                                    actionScope.status ? '禁用' : '启用'
                                }`,
                            }"
                            :popConfirm="{
                                title: `确定${
                                    actionScope.status ? '禁用' : '启用'
                                }吗？`,
                                onConfirm: () =>
                                    tableHandler.updateStatus(actionScope),
                            }"
                        >
                            <AIcon
                                :type="
                                    actionScope.status
                                        ? 'StopOutlined'
                                        : 'PlayCircleOutlined'
                                "
                            />
                        </PermissionButton>
                        <PermissionButton
                            type="link"
                            :tooltip="{
                                title: '重置密码',
                            }"
                            @click="
                                tableHandler.openDialog('reset', actionScope)
                            "
                        >
                            <AIcon type="icon-zhongzhimima" />
                        </PermissionButton>
                        <PermissionButton
                            type="link"
                            :tooltip="{
                                title: actionScope.status
                                    ? '请先禁用，再删除'
                                    : '删除',
                            }"
                            :popConfirm="{
                                title: '确认删除?',
                                onConfirm: () =>
                                    tableHandler.deleteRow(actionScope.id),
                            }"
                            :disabled="actionScope.status"
                        >
                            <AIcon type="DeleteOutlined" />
                        </PermissionButton>
                    </j-space>
                </template>
            </j-pro-table>
        </full-page>
    </page-container>
</template>

<script setup lang="ts">
import { FullPage } from 'components/Layout';
import { columnsConfig } from './columnConfig';
import PermissionButton from 'components/PermissionButton/index.vue';
import { onlyMessage } from '@/utils/comm';

const globParams = ref({});
const tableRef = ref<Record<string, any>>({});

/**
 * 搜索
 * @param _params
 */
const handleProSearch = (_params: any) => {
    globParams.value = _params;
};

/**
 * @function queryData 包装请求
 */
const queryData = () => {
    return new Promise((resolve: any, reject: any) => {
        resolve({
            status: 200,
            data: [],
            total: 0,
        });
    });
};

const tableHandler = {
    // 打开编辑弹窗
    openDialog: (type: modalType, row?: any) => {
        dialog.selectItem = { ...(row || {}) };
        dialog.type = type;
        dialog.visible = true;
    },
    // 修改状态
    updateStatus: ({ id, status }: any) => {
        // const params = {
        //   status: status === 0 ? 1 : 0,
        //   id,
        // };
        // changeUserStatus_api(params).then(() => {
        //   onlyMessage('操作成功');
        //   table.refresh();
        // });
    },
    // 删除
    deleteRow: (id: string) => {
        // deleteUser_api(id).then(() => {
        //   onlyMessage('操作成功');
        //   table.refresh();
        // });
    },
    // 刷新列表
    refreshTable: () => {
        tableRef.value.reload();
    },
};

type modalType = '' | 'add' | 'edit' | 'reset';
const dialog = reactive({
    selectItem: {},
    visible: false,
    type: '' as modalType,
});
</script>

<style scoped lang="less"></style>
