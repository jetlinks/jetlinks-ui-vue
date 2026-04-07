<template>
  <a-modal
      :title="$t('Update.index.815518-0')"
      open
      @cancel="emits('close')"
      :maskClosable="false"
      :width="600"
      :footer="null"
      @ok="emits('close')"
  >
    <div class="ht_40">
      <div v-if="loading" class="spin">
        <a-spin ></a-spin>
      </div>
      <div v-else>
        <div v-if="errorMessage" class="error">
          <AIcon style="font-size: 100px;margin: 24px 0" type="icon-a-rongqi2737"></AIcon>
          <div >{{ errorMessage }}</div>
        </div>
        <template v-else>
          <div v-if="showUpdate" class="content">
            <div class="title">
              <div>
                <a-badge status="success"/>
                {{ $t('Update.index.815518-1') }}
              </div>
              <a-button type="primary" @click="onUpdate">{{ $t('Update.index.815518-2') }}</a-button>
            </div>
            <div class="log">
              <h3>{{ $t('Update.index.815518-3') }} {{ info.version }}</h3>
              <p>{{ info.describe }}</p>
            </div>
          </div>
          <div class="noUpdate" v-else>
            <a-badge status="success"/>
            {{ $t('Update.index.815518-4') }}
          </div>
        </template>
      </div>
    </div>
    <Install v-if="showUpdateModal" :task="taskList" @close="closeUpdateModal"/>
  </a-modal>
</template>

<script setup name="Update">
import {checkUpdate, _latest, installResource, queryTaskListNoPaging} from '@device-manager-ui/api/resource/resource';
import Install from '@device-manager-ui/views/resource/Resource/Install/index.vue'
import {provide} from "vue";

const emits = defineEmits(['close', 'refresh']);

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});

const route = useRoute();
const showUpdate = ref(false);
const showUpdateModal = ref(false);
const loading = ref(true)
const errorMessage = ref('')
const info = ref({});
const taskList = ref([])

//隐藏notification通知框
const hideNotification = () => {
  const el = document.getElementsByClassName('ant-notification');
  for (let i = 0; i < el.length; i++) {
    el[i].innerHTML = '';
  }
};

const getUpdate = async () => {
  const res = await checkUpdate(props.data.id).catch(e => {
    if(e.status === 404) {
      errorMessage.value = e?.response?.data?.message
      loading.value = false
      hideNotification()
    }
  });
  if (res?.success) {
    showUpdate.value = res.result;
    if (res.result) {
      const resp = await _latest(props.data.id).finally(() => loading.value = false);
      if (resp.success) {
        info.value = resp.result
      }
    } else {
      loading.value = false
    }
  } else {
    loading.value = false
  }
};

const getTaskList = async () => {
  const resp = await queryTaskListNoPaging({
    terms: [
      {
        column: 'state',
        termType: 'not',
        value: 'success',
      },
      {
        column: 'resourcesId',
        termType: 'eq',
        value: route.params?.id,
      }
    ],
  });
  if (resp.success) {
    taskList.value = resp.result;
    if(taskList.value.length){
      showUpdateModal.value = true;
    } else {
      getUpdate();
    }
  }
};

const onUpdate = async () => {
  const res = await installResource({
    type: 'cloud',
    resourceDetails: [{
      releaseDetail: info.value
    }]
  });
  if (res.success) {
    showUpdateModal.value = true;
  }
};

const closeUpdateModal = () => {
  showUpdateModal.value = false;
  emits('refresh')
}

provide('closeUpdateModal', closeUpdateModal)

onMounted(() => {
  // 先查是否有没有执行完成的任务, 然后再查有新的更新不
  getTaskList()
});

</script>

<style lang="less" scoped>
.ht_40 {
  min-height: 40vh;
}
.spin{
  text-align: center;
}
.content {
  background-color: #eee;
  padding: 12px;
  border-radius: 6px;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .log {
    margin-top: 12px;
  }
}

.noUpdate {
  background-color: #eee;
  padding: 12px;
  border-radius: 6px;
}
.error{
  text-align: center;
}
</style>
