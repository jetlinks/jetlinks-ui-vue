<template>
    <div class="list-items">
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
                        <div>{{ props.data?.topicName }}</div>
                        <span :style="{color: state === 'unread' ? 'red' : '#AAAAAA'}">{{ state === 'unread' ? '未读' : '已读' }}</span>
                    </div>
                    <div class="time">
                        {{
                            dayjs(props.data?.notifyTime).format(
                                'YYYY-MM-DD HH:mm:ss',
                            )
                        }}
                    </div>
                </div>
                <div class="message">{{ props.data?.message }}</div>
            </div>
            <div class="list-item-right">
                <j-button @click.stop="detail">查看详情</j-button>
                <j-button v-if="state === 'unread'" @click.stop="read('_read')">标为已读</j-button>
                <j-button v-else @click.stop="read('_unread')">标为未读</j-button>
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

const state = ref(props.data.state?.value)

watchEffect(() => {
    state.value = props.data.state?.value
})

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
            if(type === '_read') {
                userInfo.alarmUpdateCount -= 1;
            } else {
                userInfo.alarmUpdateCount += 1;
            }
            num.value = 0;
            state.value = type === '_read' ? 'read' : 'unread'
            onlyMessage('操作成功！');
            emits('refresh')
        }
    });
};
</script>

<style lang="less" scoped>
.list-items {
    width: 312px;
    overflow: hidden;
    height: 80px;
    border-bottom: 1px solid #f0f0f0;
    margin: 0 24px;
    box-sizing: content-box;
}
.list-item {
    list-style: none;
    cursor: pointer;
    display: flex;
    width: 412px;
    transition: all 0.3s;
    gap: 24px;

    .list-item-left {
        padding: 12px 0;
        width: 312px;
        height: 80px;
        .header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 10px;

            .title {
                display: flex;
                align-items: center;
                div {
                    color: rgba(0, 0, 0, 0.85);
                    font-size: 14px;
                    font-weight: bold;
                    margin-right: 10px;
                }
                span {
                    color: red;
                    font-size: 13px;
                }
            }
            .time {
                font-size: 12px;
                color: rgba(0, 0, 0, 0.45);
            }
        }

        .message {
            font-size: 12px;
        }
    }

    .list-item-right {
        width: 100px;
        padding: 12px 12px 12px 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
}
</style>