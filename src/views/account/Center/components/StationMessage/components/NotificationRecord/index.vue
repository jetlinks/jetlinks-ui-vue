<template>
        <div class="notification-record-container">
        <pro-search
            :columns="columns"
            :target="type"
            style="padding: 0"
            @search="(e) => (queryParams = e)"
        />
        <j-pro-table
            ref="tableRef"
            :columns="columns"
            :request="getList_api"
            model="TABLE"
            :params="queryParams"
            :bodyStyle="{ padding: 0 }"
            :defaultParams="defaultParams"
            :scroll="{y:420}"
        >
            <template #topicProvider="slotProps">
                {{ slotProps.topicName }}
            </template>
            <template #notifyTime="slotProps">
                {{ dayjs(slotProps.notifyTime).format('YYYY-MM-DD HH:mm:ss') }}
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
                <j-space :size="16">
                    <PermissionButton
                        type="link"
                        :popConfirm="{
                            title: `${
                                slotProps.state.value === 'read'
                                    ? $t('NotificationRecord.index.7526217-0')
                                    : $t('NotificationRecord.index.7526217-12')
                            }`,
                            onConfirm: () => changeStatus(slotProps),
                        }"
                        :tooltip="{
                            title:
                                slotProps.state.value === 'read'
                                    ? $t('NotificationRecord.index.7526217-1')
                                    : $t('NotificationRecord.index.7526217-2'),
                        }"
                    >
                        <AIcon type="icon-a-PIZHU1" />
                    </PermissionButton>
                    <PermissionButton
                        type="link"
                        :tooltip="{
                            title: $t('NotificationRecord.index.7526217-3'),
                        }"
                        @click="view(slotProps)"
                    >
                        <AIcon type="EyeOutlined" />
                    </PermissionButton>
                </j-space>
            </template>
        </j-pro-table>
        <ViewDialog
            v-if="viewVisible"
            v-model:visible="viewVisible"
            :data="viewItem"
            :type="type"
        />
        </div>
</template>

<script setup lang="ts" name="NotificationRecord">
import ViewDialog from './components/ViewDialog.vue';
import PermissionButton from '@/components/PermissionButton/index.vue';
import {
    getList_api,
    changeStatus_api,
    changeAllStatus,    
} from '@/api/account/notificationRecord';
import dayjs from 'dayjs';
import { useUserInfo } from '@/store/userInfo';
import { useRouterParams } from '@/utils/hooks/useParams';
import { getTypeList_api } from '@/api/account/notificationSubscription';
import { onlyMessage } from '@/utils/comm';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const user = useUserInfo();

const props = defineProps({
    type: {
        type: String,
        default: '',
    },
});

const getType = computed(() => {
    if (props.type === 'system-business') {
        return ['device-transparent-codec'];
    } else if (props.type === 'system-monitor') {
        return ['system-event'];
    } else if(props.type === 'workflow-notification'){
        return ['workflow-task-cc','workflow-task-todo','workflow-task-reject', 'workflow-process-finish', 'workflow-process-repealed','workflow-task-transfer-todo']
    }
    else {
        return [
            'alarm',
            'alarm-product',
            'alarm-device',
            'alarm-other',
            'alarm-org',
        ];
    }
});

const columns = [
    {
        title: $t('NotificationRecord.index.7526217-4'),
        dataIndex: 'topicProvider',
        key: 'topicProvider',
        search: {
            type: 'select',
            termFilter: ['in', 'nin'],
            options: () =>
                getTypeList_api().then((resp: any) => {
                    return resp.result
                        .map((item: any) => ({
                            label: item.name,
                            value: item.id,
                        }))
                        .filter((item: any) => {
                            return [...getType.value].includes(item?.value)
                        }).sort((a: any, b: any) => {
                            return b?.value?.length - a?.value?.length
                        });
                }),
        },
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: $t('NotificationRecord.index.7526217-5'),
        dataIndex: 'message',
        key: 'message',
        search: {
            type: 'string',
        },
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: $t('NotificationRecord.index.7526217-6'),
        dataIndex: 'notifyTime',
        key: 'notifyTime',
        search: {
            type: 'date',
        },
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: $t('NotificationRecord.index.7526217-7'),
        dataIndex: 'state',
        key: 'state',
        search: {
            type: 'select',
            termFilter: ['in', 'nin'],
            options: [
                {
                    label: $t('NotificationRecord.index.7526217-8'),
                    value: 'unread',
                },
                {
                    label: $t('NotificationRecord.index.7526217-9'),
                    value: 'read',
                },
            ],
        },
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: $t('NotificationRecord.index.7526217-10'),
        dataIndex: 'action',
        key: 'action',
        ellipsis: true,
        scopedSlots: true,
        width: '200px',
    },
];

const viewVisible = ref<boolean>(false);
const viewItem = ref<any>({});

const routerParams = useRouterParams();

const defaultParams = {
    sorts: [{ name: 'notifyTime', order: 'desc' }],
    terms: [
        {
            terms: [
                {
                    column: 'topicProvider',
                    value: getType.value,
                    termType: 'in',
                },
            ],
            type: 'and',
        },
    ],
};
const queryParams = ref({});

const tableRef = ref();

const view = (row: any) => {
        viewItem.value = row;
        viewVisible.value = true;
};
const refresh = () => {
    tableRef.value && tableRef.value.reload();
};

const changeStatus = (row: any) => {
    const type = row.state.value === 'read' ? '_unread' : '_read';
    const response =  changeStatus_api(type, [row.id])
    response.then((resp: any) => {
        if (resp.status === 200) {
            onlyMessage($t('NotificationRecord.index.7526217-11'));
            refresh();
            user.updateAlarm();
        }
    });
    return response
};

watchEffect(() => {
    if (user.messageInfo?.id) {
        view(user.messageInfo);
    }
});

// const onAllRead = async () => {
//     const resp = await changeAllStatus('_read', getType.value);
//     if (resp.status === 200) {
//         onlyMessage($t('NotificationRecord.index.7526217-11'));
//         refresh();
//         user.updateAlarm();
//     }
// };

onMounted(() => {
    if (routerParams.params?.value.row) {
        view(routerParams.params?.value.row);
    }
});
onUnmounted(() => {
    user.messageInfo = {}
    viewVisible.value = false
})
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
