<template>
    <j-row :gutter="24">
        <j-col :span="16">
            <j-row :gutter="24" style="margin-bottom: 20px">
                <j-col :span="12" v-for="item in messageArr" :key="item">
                    <div
                        :style="messageStyleMap.get(item.status)"
                        class="message-status"
                    >
                        <j-badge
                            :status="messageStatusMap.get(item.status)"
                            style="margin-right: 5px"
                        />
                        <span>{{ item.text }}</span>
                    </div>
                </j-col>
            </j-row>
            <div>
                <TitleComponent data="调试" />
                <div class="content">
                    <div class="dialog" id="dialog">
                        <template v-for="item in dialogList" :key="item.key">
                            <Dialog :data="item" />
                        </template>
                    </div>
                </div>
                <div><Function /></div>
            </div>
        </j-col>
        <j-col :span="8">
            <div class="right-log">
                <TitleComponent data="日志" />
                <div class="right-log-box">
                    <template v-if="logList.length">
                        <Log
                            v-for="item in logList"
                            :data="item"
                            :key="item.key"
                        />
                    </template>
                    <div v-else class="right-log-box-empty">
                        <j-empty />
                    </div>
                </div>
            </div>
        </j-col>
    </j-row>
</template>

<script lang="ts" setup>
import type { MessageType } from './util';
import { messageStatusMap, messageStyleMap } from './util';
import Dialog from './Dialog/index.vue';
import Function from './Function/index.vue';
import Log from './Log/index.vue';
import { map } from 'rxjs/operators';
import { useInstanceStore } from '@/store/instance';
import { getWebSocket } from '@/utils/websocket';
import { randomString } from '@/utils/utils';
import _ from 'lodash';

const message = reactive<MessageType>({
    up: {
        text: '上行消息诊断中',
        status: 'loading',
    },
    down: {
        text: '下行消息诊断中',
        status: 'loading',
    },
});

const instanceStore = useInstanceStore();

const allDialogList = ref<Record<string, any>[]>([]);
const dialogList = ref<Record<string, any>[]>([]);
const logList = ref<Record<string, any>[]>([]);

const diagnoseRef = ref();

const messageArr = computed(() => {
    const arr = Object.keys(message) || [];
    return arr.map((i) => {
        return { ...message[i], key: i };
    });
});

const subscribeLog = () => {
    const id = `device-debug-${instanceStore.current?.id}`;
    const topic = `/debug/device/${instanceStore.current?.id}/trace`;
    diagnoseRef.value = getWebSocket(id, topic, {})
        ?.pipe(map((res: any) => res.payload))
        .subscribe((payload) => {
            if (payload.type === 'log') {
                logList.value.push({
                    key: randomString(),
                    ...payload,
                });
            } else {
                const data = { key: randomString(), ...payload };
                allDialogList.value.push(data);
                const flag = allDialogList.value
                    .filter(
                        (i: any) =>
                            i.traceId === data.traceId &&
                            (data.downstream === i.downstream ||
                                data.upstream === i.upstream),
                    )
                    .every((item: any) => {
                        return !item.error;
                    });
                if (!data.upstream) {
                    message.down = {
                        text: !flag ? '下行消息通信异常' : '下行消息通信正常',
                        status: !flag ? 'error' : 'success',
                    };
                } else {
                    message.up = {
                        text: !flag ? '上行消息通信异常' : '上行消息通信正常',
                        status: !flag ? 'error' : 'success',
                    };
                }
                const list: any[] = _.cloneDeep(dialogList.value);
                const t = list.find(
                    (item) =>
                        item.traceId === data.traceId &&
                        data.downstream === item.downstream &&
                        data.upstream === item.upstream,
                );
                if (t) {
                    const arr = list.map((item) => {
                        if (item.traceId === data.traceId) {
                            item.list.push(data);
                        }
                        return item;
                    });
                    dialogList.value = _.cloneDeep(arr);
                } else {
                    list.push({
                        key: randomString(),
                        traceId: data.traceId,
                        downstream: data.downstream,
                        upstream: data.upstream,
                        list: [data],
                    });
                    dialogList.value = _.cloneDeep(list);
                }
            }
            const chatBox = document.getElementById('dialog');
            if (chatBox) {
                chatBox.scrollTop = chatBox.scrollHeight;
            }
        });
};

const topState: any = inject('topState') || '';

watchEffect(() => {
    if (topState && topState?.value === 'success') {
        subscribeLog();
    }
});

onUnmounted(() => {
    if (diagnoseRef.value) {
        diagnoseRef.value.unsubscribe();
    }
});
</script>

<style lang="less" scoped>
.message-status {
    padding: 8px 24px;
}
.content {
    width: 100%;
}

.dialog {
    width: 100%;
    min-height: 300px;
    max-height: 500px;
    padding: 24px;
    overflow: hidden;
    overflow-y: auto;
    background-color: #f2f5f7;
}
.right-log {
    padding-left: 20px;
    border-left: 1px solid rgba(0, 0, 0, 0.09);
    overflow: hidden;
    height: 100%;
    overflow-y: auto;
    min-height: 400px;

    .right-log-box {
        padding-top: 10px;
        height: calc(100% - 40px);
        width: 100%;
        .right-log-box-empty {
            height: 100%;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }
}
</style>
