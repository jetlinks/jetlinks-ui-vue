<template>
    <page-container>
        <div class="notification-record-container">
            <Search :columns="columns" @search="query.search" />

            <j-pro-table
                ref="tableRef"
                :columns="columns"
                :request="getList_api"
                model="TABLE"
                :params="query.params.value"
                :defaultParams="{
                    'sorts[0].name': 'notifyTime',
                    'sorts[0].order': 'desc',
                }"
            >
                <template #topicProvider="slotProps">
                    {{ slotProps.topicName }}
                </template>
                <template #notifyTime="slotProps">
                    {{
                        moment(slotProps.notifyTime).format(
                            'YYYY-MM-DD HH:mm:ss',
                        )
                    }}
                </template>
                <template #state="slotProps">
                    <BadgeStatus
                        :status="slotProps.state.value"
                        :text="slotProps.state.text"
                        :statusNames="{
                            read: 'success',
                            unread: 'error',
                        }"
                    ></BadgeStatus>
                </template>
                <template #action="slotProps">
                    <a-space :size="16">
                        <PermissionButton
                            type="link"
                            :popConfirm="{
                                title: `确认标为${
                                    slotProps.state.value === 'read'
                                        ? '未读'
                                        : '已读'
                                }`,
                                onConfirm: () => table.changeStatus(slotProps),
                            }"
                            :tooltip="{
                                title:
                                    slotProps.state.value === 'read'
                                        ? '标为未读'
                                        : '标为已读',
                            }"
                        >
                            <AIcon type="ReadIconOutlined" />
                            <!-- <svg
                                width="1em"
                                height="1em"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M12 18H6L2 22V2C2 2 2.9 2 4 2H20C21.1 2 22 2 22 2V11H20V4H4V16H12V18ZM23 14.34L21.59 12.93L17.35 17.17L15.23 15.05L13.82 16.46L17.34 20L23 14.34Z"
                                    fill="currentColor"
                                />
                            </svg> -->
                        </PermissionButton>
                        <PermissionButton
                            type="link"
                            :tooltip="{
                                title: '查看',
                            }"
                            @click="table.view(slotProps)"
                        >
                            <AIcon type="SearchOutlined" />
                        </PermissionButton>
                    </a-space>
                </template>
            </j-pro-table>

            <ViewDialog v-if="viewVisible" v-model:visible="viewVisible" :data="viewItem" />
        </div>
    </page-container>
</template>

<script setup lang="ts" name="NotificationRecord">
import ViewDialog from './components/ViewDialog.vue';
import PermissionButton from '@/components/PermissionButton/index.vue';
import {
    getList_api,
    changeStatus_api,
} from '@/api/account/notificationRecord';
import { getTypeList_api } from '@/api/account/notificationSubscription';
import { optionItem } from '@/views/rule-engine/Scene/typings';
import { dictItemType } from '@/views/system/DataSource/typing';
import moment from 'moment';
import { message } from 'ant-design-vue';

const columns = [
    {
        title: '类型',
        dataIndex: 'topicProvider',
        key: 'topicProvider',
        search: {
            type: 'select',
            options: () =>
                getTypeList_api().then((resp: any) =>
                    resp.result
                        .map((item: dictItemType) => ({
                            label: item.name,
                            value: item.id,
                        }))
                        .filter((item: optionItem) => item.value === 'alarm'),
                ),
        },
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '消息',
        dataIndex: 'message',
        key: 'message',
        search: {
            type: 'string',
        },
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '通知时间',
        dataIndex: 'notifyTime',
        key: 'notifyTime',
        search: {
            type: 'date',
        },
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            options: [
                {
                    label: '未读',
                    value: 'unread',
                },
                {
                    label: '已读',
                    value: 'read',
                },
            ],
        },
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
        query.params.value = { ...params };
    },
};

const tableRef = ref();
const table = {
    changeStatus: (row: any) => {
        const type = row.state.value === 'read' ? '_unread' : '_read';
        changeStatus_api(type, [row.id]).then((resp: any) => {
            if (resp.status === 200) {
                message.success('操作成功！');
                table.refresh();
            }
        });
    },
    view: (row: any) => {
        viewItem.value = row;
        viewVisible.value = true;
    },
    refresh: () => {
        tableRef.value && tableRef.value.reload();
    },
};

const viewVisible = ref<boolean>(false);
const viewItem = ref<any>({});
</script>

<style lang="less" scoped>
.notification-record-container {
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
