<template>
    <div>
        <a-dropdown :trigger="['click']">
            <div style="height: 48px; display: flex; display: flex">
                <AIcon type="BellOutlined" @click.prevent />
            </div>
            <template #overlay>
                <div class="content">
                    <NoticeInfo />
                </div>
            </template>
        </a-dropdown>
    </div>
</template>

<script setup lang="ts">
import { getList_api } from '@/api/account/notificationRecord';
import NoticeInfo from './NoticeInfo.vue';

const getList = () => {
    const params = {
        'terms[0].column': 'state',
        'terms[0].value': 'unread',
        'sorts[0].name': 'notifyTime',
        'sorts[0].order': 'desc',
    };
    getList_api(params).then((resp) => {});
};
</script>

<style lang="less" scoped></style>
