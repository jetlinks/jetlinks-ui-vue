<template>
  <div class="message-box">
    <div class="message-left">
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; margin-bottom: 16px">
        <div v-for="item in messageArr" :key="item">
          <div
              :style="messageStyleMap.get(item.status)"
              class="message-status"
          >
            <a-badge
                :status="messageStatusMap.get(item.status)"
                style="margin-right: 5px"
            />
            <span>{{ item.text }}</span>
          </div>
        </div>
      </div>
      <div>
        <TitleComponent :data="$t('Message.index.160269-0')"/>
        <div class="content">
          <div class="dialog" id="dialog">
            <template v-for="item in dialogList" :key="item.key">
              <Dialog :data="item"/>
            </template>
          </div>
        </div>
        <div>
          <Function/>
        </div>
      </div>
    </div>
    <div class="right-log">
      <div style="display:flex; justify-content: space-between; align-items: center">
        <TitleComponent :data="$t('Message.index.160269-1')">
          <template #extra>
            <a-space  v-if="logList.length > 0">
              <a-tooltip>
                <a-button type="text" size="small" @click="onCollapse(!isCollapse)">
                    <AIcon :type="isCollapse ? 'NodeExpandOutlined' : 'NodeCollapseOutlined'"/>
                </a-button>
                <template #title>
                  {{`${$t('Save.SelectDevices.386303-14')}${isCollapse ? $t('Apply.List.326977-12') : $t('Apply.List.326977-11')}`}}
                </template>
              </a-tooltip>
              <a-tooltip>
                <a-button type="text" size="small" @click="scrollToBottom">
                  <AIcon type="VerticalAlignBottomOutlined"/>
                </a-button>
                <template #title>
                  {{ $t('Diagnose.util.952397-6') }}
                </template>
              </a-tooltip>
            </a-space>
          </template>
        </TitleComponent>
        <a-space>
          <j-permission-button
              :disabled="logList.length === 0"
              :popConfirm="{
                title: $t('Metadata.index.838029-0'),
                onConfirm: () => {
                  onReload();
                }
              }"
              size="small"
          >
            <AIcon type="ReloadOutlined"/>
            {{$t('components.Source.418270-2')}}
          </j-permission-button>
          <a-button type="primary" size="small" @click="onAction">
            <AIcon :type="isBegin ? 'PauseOutlined' : 'PlayCircleOutlined'"/>
            {{ isBegin ? $t('Apply.installing.6794613-12') : $t('Apply.installing.6794613-13') }}
          </a-button>
        </a-space>
      </div>
      <div class="right-log-box">
        <template v-if="logList.length">
          <Log
              v-for="(item, index) in logList"
              :data="item"
              :key="item.key"
              :isCollapse="isCollapse"
              :ref="el => logItem[index] = el"
          />
        </template>
        <div v-else class="right-log-box-empty">
          <j-empty />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {MessageType} from './util';
import {messageStatusMap, messageStyleMap} from './util';
import Dialog from './Dialog/index.vue';
import Function from './Function/index.vue';
import Log from './Log/index.vue';
import {map} from 'rxjs/operators';
import {useInstanceStore} from '../../../../../../store/instance';
import {wsClient} from '@jetlinks-web/core';
import {randomString} from '@jetlinks-web/utils';
import {cloneDeep} from 'lodash-es';
import {useI18n} from 'vue-i18n';

const {t: $t} = useI18n();
const message = reactive<MessageType>({
  up: {
    text: $t('Message.index.160269-2'),
    status: 'loading',
  },
  down: {
    text: $t('Message.index.160269-3'),
    status: 'loading',
  },
});

const instanceStore = useInstanceStore();

const allDialogList = ref<Record<string, any>[]>([]);
const dialogList = ref<Record<string, any>[]>([]);
const logList = ref<Record<string, any>[]>([]);

const diagnoseRef = ref();
const isCollapse = ref(true);
const isBegin = ref(true);
const logItem = ref([])

const messageArr = computed(() => {
  const arr = Object.keys(message) || [];
  return arr.map((i) => {
    return {...message[i], key: i};
  });
});

const onCollapse = (flag: boolean) => {
  isCollapse.value = flag
}

const scrollToBottom = () => {
  const last = logItem.value[logItem.value.length - 1];
  if (last) {
    if (last?.$el) {
      last.$el.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }
}

const onReload = () => {
  logList.value = [];
}

const onStop = () => {
  if (diagnoseRef.value) {
    diagnoseRef.value.unsubscribe();
  }
}

const onAction = () => {
  if(isBegin.value){
    onStop()
  } else {
    subscribeLog()
  }
  isBegin.value = !isBegin.value;
}

const subscribeLog = () => {
  const id = `device-debug-${instanceStore.current?.id}`;
  const topic = `/debug/device/${instanceStore.current?.id}/trace`;
  diagnoseRef.value = wsClient.getWebSocket(id, topic, {})
      ?.pipe(map((res: any) => res.payload))
      .subscribe((payload) => {
        if (payload.type === 'log') {
          logList.value.push({
            key: randomString(),
            ...payload,
          });
        } else {
          const data = {key: randomString(), ...payload};
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
              text: !flag ? $t('Message.index.160269-4') : $t('Message.index.160269-5'),
              status: !flag ? 'error' : 'success',
            };
          } else {
            message.up = {
              text: !flag ? $t('Message.index.160269-6') : $t('Message.index.160269-7'),
              status: !flag ? 'error' : 'success',
            };
          }
          const list: any[] = cloneDeep(dialogList.value);
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
            dialogList.value = cloneDeep(arr);
          } else {
            list.push({
              key: randomString(),
              traceId: data.traceId,
              downstream: data.downstream,
              upstream: data.upstream,
              list: [data],
            });
            dialogList.value = cloneDeep(list);
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
  onStop()
});
</script>

<style lang="less" scoped>
.message-box {
  display: flex;
  height: 100%;
}

.message-left {
  flex: 1;
  min-width: 0;
  height: 100%;
  overflow-y: auto;

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
}

.right-log {
  padding-left: 20px;
  border-left: 1px solid rgba(0, 0, 0, 0.09);
  height: 100%;
  width: 30%;
  display: flex;
  flex-direction: column;
  gap: 16px;

  :deep(.title) {
    margin-bottom: 0;
  }

  .right-log-box {
    min-height: 100px;
    flex: 1;
    overflow-y: auto;

    .right-log-box-empty {
      margin-top: 100px;
    }
  }
}
</style>
