<template>
    <div class="notice-container">
        <a-dropdown :trigger="['click']" @visible-change="visibleChange">
            <div class="icon-content">
                <AIcon
                    type="BellOutlined"
                    @click.prevent
                    style="font-size: 16px"
                />
                <span class="unread" v-show="total > 0">{{ total }}</span>
            </div>
            <template #overlay>
                <div>
                    <NoticeInfo :data="list" @on-action="getList" />
                </div>
            </template>
        </a-dropdown>
    </div>
</template>

<script setup lang="ts">
import { getList_api } from '@/api/account/notificationRecord';
import NoticeInfo from './NoticeInfo.vue';
import { getWebSocket } from '@/utils/websocket';
import { notification } from 'ant-design-vue';
import { changeStatus_api } from '@/api/account/notificationRecord';
import { useUserInfo } from '@/store/userInfo';

const updateCount = computed(()=>useUserInfo().$state.alarmUpdateCount);

const total = ref(0);
const list = ref<any[]>([]);
const loading = ref(false);

const subscribeNotice = () => {
    getWebSocket('notification', '/notifications', {})
        ?.pipe()
        .subscribe((resp: any) => {
            total.value += 1;
            notification.open({
                message: 'Notification Title',
                description:
                    'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
                onClick: () => {
                    changeStatus_api('_read', [resp.id]);
                },
            });
        });
};
const getList = () => {
    loading.value = true;
    const params = {
        'terms[0].column': 'state',
        'terms[0].value': 'unread',
        'sorts[0].name': 'notifyTime',
        'sorts[0].order': 'desc',
    };
    getList_api(params)
        .then((resp: any) => {
            list.value = resp.result.data;
            total.value = resp.result.total;
        })
        .finally(() => (loading.value = false));
};
subscribeNotice();
getList();
watch(updateCount, () => getList());
const visibleChange = (bool: boolean) => {
    bool && getList();
};
</script>

<style lang="less" scoped>
.notice-container {
    .icon-content {
        height: 48px;
        display: flex;
        align-items: center;
        position: relative;

        .unread {
            position: absolute;
            top: 0;
            right: -12px;
            min-width: 20px;
            height: 20px;
            padding: 0 6px;
            color: #fff;
            font-weight: normal;
            font-size: 12px;
            line-height: 20px;
            white-space: nowrap;
            text-align: center;
            background: #ff4d4f;
            border-radius: 10px;
        }
    }
}
</style>
