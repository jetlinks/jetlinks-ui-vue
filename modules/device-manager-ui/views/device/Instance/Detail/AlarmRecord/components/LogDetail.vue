<template>
  <a-modal
    open
    :okText="$t('components.LogDetail.536180-0')"
    :cancelText="$t('components.LogDetail.536180-1')"
    :width="1000"
    :title="$t('components.LogDetail.536180-2')"
    :closable="true"
    @ok="closeModal"
    @cancel="closeModal"
  >
    <div class="alarmInfo">
      <span class="alarmTitle">{{ data?.alarmConfigName }}</span>
      <span class="alarmTime">{{
          dayjs(data?.alarmTime).format('YYYY-MM-DD HH:mm:ss')
        }}</span>
    </div>
    <a-descriptions bordered :column="2">
      <a-descriptions-item :label="$t('components.LogDetail.536180-3')" :span="2">{{
          data?.triggerDesc
        }}</a-descriptions-item>
      <a-descriptions-item :label="$t('components.LogDetail.536180-4')" :span="2">{{
          data?.actualDesc
        }}</a-descriptions-item>
      <a-descriptions-item :label="$t('components.LogDetail.536180-5')" :span="2">
        {{ $t('components.LogDetail.536180-6') }}<a-button
        type="link"
        @click="() => gotoDevice(data?.sourceId)"
      >{{ data?.sourceName }}</a-button
      >
      </a-descriptions-item>
      <a-descriptions-item :label="$t('components.LogDetail.536180-7')" :span="2"
      ><div style="max-height: 500px; overflow-y: auto">
        <JsonViewer
          :value="JSON.parse(data?.alarmInfo)"
          :expanded="true"
          :expandDepth="4"
        ></JsonViewer></div
      ></a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script setup>
import dayjs from 'dayjs';
import { JsonViewer } from 'vue3-json-viewer';
import { useMenuStore } from '@jetlinks-web-core/store';

const props = defineProps({
  data: Object,
});
const menuStory = useMenuStore();
const runningWater = computed(() => {
  return JSON.parse(props.data?.alarmInfo);
});

const emit = defineEmits(['close']);
const closeModal = () => {
  emit('close');
};
const gotoDevice = (id) => {
  menuStory.jumpPage('device/Instance/Detail', { params: { id, tab: 'Running' }});
};
</script>
<style lang="less" scoped>
.alarmInfo {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  .alarmTitle {
    font-weight: 600;
    font-size: 16px;
    color: #1a1a1a;
  }
  .alarmTime {
    font-size: 14px;
  }
}
</style>
