<template>
    <div class="list-items">
        <div class="list-box">
            <div
                class="list-item"
                @click="onMove"
                :style="{
                    transform: `translate(${num}px, 0)`,
                }"
            >
                <div class="list-item-left">
                    <div class="header">
                        <div class="title">
                            <span>{{ props.data?.topicName }}</span>
                            <span style="margin-left: 5px">
                                {{
                                    dayjs(props.data?.notifyTime).format(
                                        'YYYY-MM-DD HH:mm:ss',
                                    )
                                }}
                            </span>
                        </div>
                        <div :class="[state === 'unread' ? 'unread' : 'read']">
                            {{ state === 'unread' ? '未读' : '已读' }}
                        </div>
                    </div>
                    <div class="message">
                        <j-ellipsis :lineClamp="2">{{ props.data?.message }}</j-ellipsis>
                    </div>
                </div>
                <div class="list-item-right">
                    <j-button
                        size="small"
                        @click.stop="detail"
                        style="margin-bottom: 5px"
                        >查看详情</j-button
                    >
                    <j-button
                        size="small"
                        v-if="state === 'unread'"
                        @click.stop="read('_read')"
                        >标为已读</j-button
                    >
                    <j-button size="small" v-else @click.stop="read('_unread')"
                        >标为未读</j-button
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { changeStatus_api } from '@/api/account/notificationRecord';
import { useMenuStore } from '@/store/menu';
import { useUserInfo } from '@/store/userInfo';
import { onlyMessage } from '@/utils/comm';

const menuStory = useMenuStore();
const route = useRoute();

const userInfo = useUserInfo();

const emits = defineEmits(['action', 'refresh']);

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const num = ref<-100 | 0>(0);

const state = ref(props.data.state?.value);

watchEffect(() => {
    state.value = props.data.state?.value;
});

const onMove = () => {
    num.value = num.value === 0 ? -100 : 0;
};

const detail = () => {
    // 判断当前是否为/account/center
    if (route.path === '/account/center') {
        userInfo.tabKey = 'StationMessage';
        userInfo.messageInfo = props.data;
    } else {
        menuStory.routerPush('account/center', {
            row: props.data,
            tabKey: 'StationMessage',
        });
    }
    emits('action');
};

const read = (type: '_read' | '_unread') => {
    changeStatus_api(type, [props.data.id]).then((resp: any) => {
        if (resp.status === 200) {
            if (type === '_read') {
                userInfo.alarmUpdateCount -= 1;
            } else {
                userInfo.alarmUpdateCount += 1;
            }
            num.value = 0;
            state.value = type === '_read' ? 'read' : 'unread';
            onlyMessage('操作成功！');
            emits('refresh');
        }
    });
};
</script>

<style lang="less" scoped>
.list-items {
    width: 100%;
    border-bottom: 1px solid #f0f0f0;
    padding: 0 16px;

    &:hover {
        background-color: #f9faff;
    }
}

.list-box {
    overflow: hidden;
    width: 100%;
}
.list-item {
    list-style: none;
    cursor: pointer;
    display: flex;
    width: calc(100% + 124px);
    transition: all 0.3s;

    .list-item-left {
        padding: 12px 0;
        margin-right: 16px;
        width: calc(100% - 124px);
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .title {
                display: flex;
                align-items: center;
                color: #333333;
            }

            .unread {
                color: #666666;
                width: 40px;
                height: 22px;
                text-align: center;
                font-size: 12px;
                background-color: #f2f3f5;
                line-height: 22px;
            }

            .read {
                color: @primary-color;
                width: 40px;
                height: 22px;
                text-align: center;
                line-height: 22px;
                font-size: 12px;
                background-color: #f1f4ff;
            }
        }

        .message {
            color: #666666;
        }
    }

    .list-item-right {
        width: 84px;
        padding: 5px 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
    }
}
</style>