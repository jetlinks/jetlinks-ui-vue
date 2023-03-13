<template>
    <div class="notice-container">
        <j-dropdown :trigger="['click']" @visible-change="visibleChange">
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
        </j-dropdown>
    </div>
</template>

<script setup lang="tsx">
import { getList_api } from '@/api/account/notificationRecord';
import NoticeInfo from './NoticeInfo.vue';
import { getWebSocket } from '@/utils/websocket';
import { notification, Button } from 'ant-design-vue';
import { changeStatus_api } from '@/api/account/notificationRecord';
import { useUserInfo } from '@/store/userInfo';

const updateCount = computed(() => useUserInfo().$state.alarmUpdateCount);

const total = ref(0);
const list = ref<any[]>([]);
const loading = ref(false);

const subscribeNotice = () => {
    getWebSocket('notification', '/notifications', {})
        ?.pipe()
        .subscribe((resp: any) => {
            total.value += 1;
            notification.open({
                message: resp?.payload?.topicName,
                description: () => (
                    <div
                        class="ellipsis"
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            changeStatus_api('_read', [resp.id]);
                        }}
                    >
                        {resp?.payload?.message}
                    </div>
                ),
                onClick: () => {
                    changeStatus_api('_read', [resp.id]);
                },
                key: resp.payload.id,
                btn: (
                    <Button
                        type="primary"
                        size="small"
                        onClick={() => {
                            changeStatus_api('_read', [resp.id]).then(
                                (resp: any) => {
                                    if (resp.status === 200) {
                                        notification.close(resp.payload.id);
                                        getList();
                                    }
                                },
                            );
                        }}
                    >
                        标记已读
                    </Button>
                ),
            });
        });
};
const getList = () => {
    loading.value = true;
    const params = {
        'sorts[0].name': 'notifyTime',
        'sorts[0].order': 'desc',
        terms: [
            {
                terms: [
                    {
                        type: 'or',
                        value: 'unread',
                        termType: 'eq',
                        column: 'state',
                    },
                ],
            },
        ],
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
