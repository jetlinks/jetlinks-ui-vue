<template>
  <a-modal
    open
    :okText="$t('components.LogDetail.1651510-0')"
    :cancelText="$t('components.LogDetail.1651510-1')"
    :width="1000"
    :title="$t('components.LogDetail.1651510-2')"
    :closable="true"
    @ok="closeModal"
    @cancel="closeModal"
  >
    <div class="alarmInfo">
      <span class="alarmTitle">{{ data?.alarmConfigName }}</span>
      <span class="alarmTime">{{
        dayjs(data?.alarmTime).format("YYYY-MM-DD HH:mm:ss")
      }}</span>
    </div>
    <a-descriptions bordered :column="2">
      <a-descriptions-item :label="$t('components.LogDetail.1651510-3')" :span="2">{{
        data?.triggerDesc
      }}</a-descriptions-item>
      <a-descriptions-item :label="$t('components.LogDetail.1651510-4')" :span="2">{{
        data?.actualDesc
      }}</a-descriptions-item>
      <a-descriptions-item :label="$t('components.LogDetail.1651510-5')" :span="2">
        <div v-if="data.sourceType === 'device'">
          {{ $t('components.LogDetail.1651510-6') }}<a-button
          type="link"
          @click="() => gotoDevice(data?.sourceId)"
        >{{ data?.sourceName }}</a-button
        >
        </div>
        <div v-else-if="data.sourceType === 'collector'">
          {{ $t('components.LogDetail.1651510-7-1') }}<a-button
          type="link"
          @click="() => gotoCollector(data?.sourceId)"
        >{{ data?.sourceName }}</a-button
        >
        </div>
        <div v-else>
          {{ $t('components.LogDetail.1651510-7') }}<a-button
          type="link"
          @click="() => gotoRule(data)"
        >{{ data?.sourceName }}</a-button
        >
        </div>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('components.LogDetail.1651510-8')" :span="2"
      >
        <div style="max-height: 500px; overflow-y: auto">
        <div style="display: flex; flex-direction: column; gap: 10px" v-if="isIncludeMedia">
          <a-image v-if="runningWater?.image" :width="200" :src="runningWater.image"/>
          <div v-if="runningWater?.video" style="height: 300px">
            <Player :url="runningWater.video" autoplay :live="false" />
          </div>
        </div>
        <JsonViewer
            v-else
            :value="runningWater"
            :expanded="true"
            :expandDepth="4"
          ></JsonViewer></div
      ></a-descriptions-item>
    </a-descriptions>
  </a-modal>
</template>

<script setup>
import dayjs from "dayjs";
import { JsonViewer } from "vue3-json-viewer";
import { useMenuStore } from "@jetlinks-web-core/store/menu";
import { useI18n } from 'vue-i18n'
import {queryCollectorById} from "@rule-engine-manager-ui/api/collector";

const { t: $t } = useI18n()
const props = defineProps({
  data: Object,
});
const menuStory = useMenuStore();
const runningWater = computed(() => {
  return JSON.parse(props.data?.alarmInfo);
});
const isIncludeMedia = computed(() => {
  const targets = ['image', 'video'];
  return props.data?.alarmInfo && Object.keys(JSON.parse(props.data?.alarmInfo)).some((item) => targets.includes(item));
});
const emit = defineEmits(["close"]);
const closeModal = () => {
  emit("close");
};
const gotoDevice = (id) => {
  menuStory.jumpPage("device/Instance/Detail", {
    params: { id, tab: "Running" },
  });
};

const gotoCollector = async (id) => {
  const res = await queryCollectorById(id);
  menuStory.jumpPage("DataCollect/Collector", {
    query: { channelId: res.result.channelId, collectorId: res.result.id },
  });
};

const gotoRule = (record) => {
  menuStory.jumpPage(
    'rule-engine/Scene/Save',
    {
      query: { triggerType:record.sourceName===$t('components.LogDetail.1651510-9')?'timer':'manual', id:record.sourceId, type: 'view' },
    }
  );
}
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
