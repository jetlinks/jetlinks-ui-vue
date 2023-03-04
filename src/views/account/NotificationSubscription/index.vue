<template>
    <page-container>
        <div class="notification-subscription-container">
            <Search :columns="columns" @search="query.search" />
            <j-pro-table
                ref="tableRef"
                :columns="columns"
                :request="getNoticeList_api"
                model="TABLE"
                :params="query.params.value"
                :defaultParams="{
                    sorts: [{ name: 'notifyTime', order: 'desc' }],
                }"
            >
                <template #headerTitle>
                    <PermissionButton type="primary" @click="table.edit()">
                        <AIcon type="PlusOutlined" />新增
                    </PermissionButton>
                </template>

                <template #alarmConfigName="slotProps">
                    {{ slotProps.topicConfig.alarmConfigName }}
                </template>
                <template #state="slotProps">
                    <BadgeStatus
                        :status="slotProps.state.value"
                        :text="slotProps.state.text"
                        :statusNames="{
                            enabled: 'success',
                            disabled: 'error',
                        }"
                    ></BadgeStatus>
                </template>

                <template #action="slotProps">
                    <j-space :size="16">
                        <PermissionButton
                            type="link"
                            :tooltip="{
                                title: '编辑',
                            }"
                            @click="table.edit(slotProps)"
                        >
                            <AIcon type="EditOutlined" />
                        </PermissionButton>

                        <PermissionButton
                            type="link"
                            :popConfirm="{
                                title: `确定${
                                    slotProps.state.value === 'enabled'
                                        ? '禁用'
                                        : '启用'
                                }`,
                                onConfirm: () => table.changeStatus(slotProps),
                            }"
                            :tooltip="{
                                title:
                                    slotProps.state.value === 'enabled'
                                        ? '禁用'
                                        : '启用',
                            }"
                        >
                            <AIcon
                                :type="
                                    slotProps.state.value === 'enabled'
                                        ? 'StopOutlined'
                                        : 'PlayCircleOutlined'
                                "
                            />
                        </PermissionButton>
                        <PermissionButton
                            type="link"
                            :tooltip="{
                                title:
                                    slotProps.state.value === 'enabled'
                                        ? '请先禁用，再删除'
                                        : '删除',
                            }"
                            :popConfirm="{
                                title: `确认删除？`,
                                onConfirm: () => table.delete(slotProps),
                            }"
                            :disabled="slotProps.state.value === 'enabled'"
                        >
                            <AIcon type="DeleteOutlined" />
                        </PermissionButton>
                    </j-space>
                </template>
            </j-pro-table>

            <EditDialog
                v-if="dialogVisible"
                v-model:visible="dialogVisible"
                :data="table.seletctRow"
                @ok="table.refresh"
            />
        </div>
    </page-container>
</template>

<script setup lang="ts" name="NotificationSubscription">
import PermissionButton from '@/components/PermissionButton/index.vue';
import EditDialog from './components/EditDialog.vue';
import {
    getNoticeList_api,
    changeStatus_api,
    remove_api
} from '@/api/account/notificationSubscription';
import { rowType } from './typing';
import { message } from 'ant-design-vue';

const columns = [
    {
        title: '名称',
        dataIndex: 'subscribeName',
        key: 'subscribeName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '类型',
        dataIndex: 'topicName',
        key: 'topicName',
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '告警规则',
        dataIndex: 'alarmConfigName',
        key: 'alarmConfigName',
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        ellipsis: true,
        scopedSlots: true,
    },
];
const query = {
    params: ref({}),
    search: (params: object) => {
        query.params.value = {...params};
    },
};
const dialogVisible = ref<boolean>(false);
const tableRef = ref();
const table = {
    seletctRow: ref<rowType>(),
    edit: (row?: rowType) => {
        table.seletctRow = {
            ...(row || ({} as any)),
        };
        dialogVisible.value = true;
    },
    changeStatus: (row: rowType) => {
        const status = row.state.value === 'enabled' ? '_disabled' : '_enabled';
        changeStatus_api(row.id as string, status).then((resp) => {
            if (resp.status === 200) {
                message.success('操作成功！');
                table.refresh();
            } else message.warning('操作失败！');
        });
    },
    delete: (row: rowType) => {
        remove_api(row.id as string).then(resp=>{
            if(resp.status === 200) {
                message.success('操作成功！')
                table.refresh()
            }else message.warning('操作失败！')
        })
    },
    refresh: () => {
        tableRef.value && tableRef.value.reload();
    },
};
</script>

<style lang="less" scoped>
.notification-subscription-container {
    :deep(.ant-table-tbody) {
        .ant-table-cell {
            .ant-space-item {
                .ant-btn-link {
                    padding: 0;
                }
            }
        }
    }
}
</style>
