<template>
  <div class="container">
    <div class="header">
      <a-space>
        <div>{{$t('Apply.installing.6794613-0', [taskList?.length || 0])}}</div>
        <div>
          <AIcon :type="statusIcon.get('success')" class="icon"/>
          {{$t('Apply.installing.6794613-1')}}{{ getStatusNumber('success') }}
        </div>
        <div>
          <AIcon :type="statusIcon.get('failed')" class="icon"/>
          {{$t('Apply.installing.6794613-2')}}{{ getStatusNumber('failed') }}
        </div>
        <div>
          <AIcon :type="statusIcon.get('installing')" class="icon"/>
          {{$t('Apply.installing.6794613-3')}}{{ getStatusNumber('installing') }}
        </div>
        <div>
          <AIcon
              :type="statusIcon.get('waiting_install')"
              class="icon"
          />
          {{$t('Apply.installing.6794613-4')}}{{ getStatusNumber('waiting_install') }}
        </div>
        <div>
          <AIcon :type="statusIcon.get('canceled')" class="icon"/>
          {{$t('Apply.installing.6794613-5')}}{{ getStatusNumber('canceled') }}
        </div>
        <template v-if="source === 'cloud'">
          <div>
            <AIcon :type="statusIcon.get('downloading')" class="icon"/>
            {{$t('Apply.installing.6794613-6')}}{{ getStatusNumber('downloading') }}
          </div>
          <div>
            <AIcon
                :type="statusIcon.get('waiting_download')"
                class="icon"
            />
            {{$t('Apply.installing.6794613-7')}}{{ getStatusNumber('waiting_download') }}
          </div>
        </template>
      </a-space>
      <a-button @click="pauseAll" :disabled="allComplete" type="primary" v-if="controlStatue">
        <template #icon>
          <AIcon type="PauseOutlined"></AIcon>
        </template>
        {{$t('Apply.installing.6794613-8')}}
      </a-button>
      <a-space v-else>
        <a-button @click="startAll" :disabled="allComplete" type="primary">
          <template #icon>
            <AIcon type="CaretRightOutlined"></AIcon>
          </template>
          {{$t('Apply.installing.6794613-9')}}
        </a-button>
        <a-button @click="removeAll" :disabled="allComplete" type="primary">
          <template #icon>
            <AIcon type="DeleteOutlined"></AIcon>
          </template>
          {{$t('Apply.installing.6794613-10')}}
        </a-button>
      </a-space>
    </div>
    <div class="progressBar"></div>
    <div
        style="
                margin-top: 10px;
                max-height: 500px;
                min-height: 400px;
                overflow-y: auto;
            "
    >
      <div v-for="i in taskList" :key="i.id" class="fileList">
        <img
            :src="
                        i.resourceDetails?.photoUrl?.url || i.resourceDetails.releaseDetail?.photoUrl?.url ||
                        imageMap.get(
                            i.resourceDetails?.releaseDetail?.resourcesType
                                ?.value,
                        )
                    "
            alt=""
            style="width: 80px; height: 80px; margin-right: 16px"
        />
        <div style="width: calc(100% - 80px)">
          <div class="fileInfoHeader">
            <div>
              <div style="display: flex">
                <j-ellipsis>{{
                    i.resourceDetails?.releaseDetail
                        ?.resourcesName
                  }}
                </j-ellipsis>
                <span class="fileType">
                                    {{
                    i.resourceDetails?.releaseDetail
                        ?.resourcesType?.text
                  }}
                                </span>
              </div>
              <div>
                {{ i.resourceDetails?.releaseDetail?.version }}
              </div>
            </div>
            <a-space>
              <Status :value="status[i.id]?.state?.value"/>
              <a-button
                  v-if="status[i.id]?.state?.value === 'success'"
                  @click="onDetail(i)"
              >{{$t('Apply.installing.6794613-11')}}
              </a-button
              >
              <a-button
                  v-if="
                                    ['installing', 'downloading'].includes(
                                        status[i.id]?.state?.value,
                                    )
                                "
                  @click="onPause(i)"
              >{{$t('Apply.installing.6794613-12')}}
              </a-button
              >
              <a-button
                  v-if="status[i.id]?.state?.value === 'canceled'"
                  @click="onBegin(i)"
              >{{$t('Apply.installing.6794613-13')}}
              </a-button
              >
              <a-button
                  v-if="
                                    [
                                        'waiting_install',
                                        'waiting_download',
                                    ].includes(status[i.id]?.state?.value)
                                "
                  @click="onDelete(i)"
              >{{$t('Apply.installing.6794613-14')}}
              </a-button
              >
              <a-button
                  v-if="status[i.id]?.state?.value === 'failed'"
                  @click="onReload(i)"
              >{{$t('Apply.installing.6794613-15')}}
              </a-button
              >
            </a-space>
          </div>
          <a-divider/>
          <div class="fileInfoFooter">
            <div class="install_container">
              <a-badge status="default"/>
              <div class="installStatue">
                {{ computedVersion(resourceVersionMap, i) }}
              </div>
              <div v-if="resourceVersionMap.has(i.resourcesId || i?.resourceDetails?.id || i.resourceDetails?.releaseDetail?.resourcesId)">
                ({{$t('Apply.installing.6794613-16')}}:{{
                  resourceVersionMap?.get(i.resourcesId || i?.resourceDetails?.id || i.resourceDetails?.releaseDetail?.resourcesId)
                }})
              </div>
            </div>
            <div class="description">
              {{ i?.describe }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {wsClient} from '@jetlinks-web/core';
import Status from './Status.vue';
import {delTask, deployTask, stopTask} from '@device-manager-ui/api/resource/resource';
import {statusIcon, computedVersion} from '@device-manager-ui/views/resource/Resource/Install/data';
import {useMenuStore} from '@jetlinks-web-core/store/menu';
import {resource} from '@device-manager-ui/assets/resource';
import { inject } from "vue";

const props = defineProps({
  taskList: {
    type: Array,
    default: () => [],
  },
  source: {
    type: String,
    default: 'cloud',
  },
  resourceVersionMap: {
    type: Object,
    default: () => {
    },
  },
});
const closeUpdateModal = inject('closeUpdateModal');
const emits = defineEmits(['refresh']);
const menuStory = useMenuStore();
const imageMap = new Map([
  ['device', resource.deviceDefaultImage],
  ['collector', resource.collectorDefaultImage],
  ['protocol', resource.protocolDefaultImage],
]);
const status = ref({});
let wsRef = null;
const controlStatue = computed(() => {
  return !Object.values(status.value).every((i) => {
    return ['success', 'failed', 'canceled'].includes(i?.state?.value);
  });
});

const allComplete = computed(() => {
  return Object.values(status.value).every((i) => {
    return i?.state?.value === 'success';
  })
})

const pauseAll = async () => {
  const arr = []
      Object.entries(status.value).forEach((i) =>
      {
        if( [
          'installing',
          'downloading',
          'waiting_install',
          'waiting_download',
        ].includes(i?.[1].state.value)){
          arr.push(i[0])
        }
      }
  );
  const resp = await stopTask(arr);
  if (resp.success) {
  }
};

const getStatusNumber = (type) => {
  return (
      props.taskList.filter((i) => {
        return (
            (status.value?.[i.id]?.state?.value || i.state.value) === type
        );
      })?.length || 0
  );
};

const startAll = async () => {
  const resp = await deployTask({
    type: props.source,
    states: ['canceled', 'failed'],
  });
  if (resp.success) {
  }
};

const removeAll = async () => {
  const resp = await delTask({
    states: ['canceled', 'failed'],
  });
  if (resp.success) {
    emits('refresh');
  }
};

const onPause = async (item) => {
  const resp = await stopTask([item.id]);
  if (resp.success) {
  }
};

const onDetail = async (data) => {
  if(closeUpdateModal){
    closeUpdateModal();
    return
  }
  menuStory.jumpPage('resource/Resource/Detail', {
    params: {
      id: data.resourceDetails?.releaseDetail?.resourcesId,
    }
  });
};

const onBegin = async (item) => {
  const resp = await deployTask({
    id: item.id,
    type: props.source,
    states: ['canceled'],
  });
  if (resp.success) {
  }
};

const onDelete = async (item) => {
  const resp = await delTask({
    id: item.id,
  });
  if (resp.success) {
    emits('refresh');
  }
};

const onReload = async (item) => {
  const resp = await deployTask({
    id: item.id,
    type: props.source,
    states: ['canceled', 'failed'],
  });
  if (resp.success) {
  }
};

const installTask = () => {
  wsRef = wsClient.getWebSocket(
      `resources-install-state-subscriber`,
      `/resources/install/*`,
      {},
  ).subscribe((resp) => {
    if (resp.payload?.taskId) {
      status.value[resp.payload.taskId] = resp.payload;
    }
  });
};

watch(
    () => props.taskList,
    () => {
      if (props.taskList.length) {
        installTask();
        props.taskList.forEach((item) => {
          status.value[item.id] = {
            state: {
              value: item.state.value,
            },
          };
        });
      }
    },
    {
      deep: true,
      immediate: true,
    },
);


onUnmounted(() => {
  if (wsRef) {
    wsRef?.unsubscribe();
  }
});
</script>
<style lang="less" scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .icon {
    margin-right: 4px;
  }
}

.fileList {
  display: flex;
  margin-bottom: 16px;
  text-align: start;
  background-color: rgb(242, 242, 242);
  padding: 16px;
  border-radius: 8px;

  .fileInfoHeader {
    display: flex;
    justify-content: space-between;
    align-items: center;

    .fileType {
      background-color: rgb(206, 234, 214);
      margin-left: 6px;
      padding: 0 6px;
      border-radius: 6px;
      color: rgb(23, 129, 60);
    }
  }

  .fileInfoFooter {
    color: #878787;
    font-size: 12px;

    .install_container {
      display: flex;
      vertical-align: middle;

      .installStatue {
        color: black;
        margin-right: 6px;
      }
    }
  }
}

.icon {
  margin-left: 10px;
}
</style>
