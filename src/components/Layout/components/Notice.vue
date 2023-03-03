<template>
    <div>
        <a-dropdown :trigger="['click']">
            <div style="height: 48px; display: flex; display: flex">
                <AIcon type="BellOutlined" @click.prevent />
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

const total = ref(0);
const list = ref<any[]>([]);
const loading = ref(false);

const subscribeNotice = () => {
    getWebSocket('notification', '/notifications', {})
        ?.pipe()
        .subscribe((resp: any) => {
            total.value += 1
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

getList();
</script>

<style lang="less" scoped></style>
