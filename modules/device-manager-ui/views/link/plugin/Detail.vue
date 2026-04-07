<template>
  <a-drawer open :title="data.name" :width="600">
    <TitleComponent :data="$t('Plugin.index.626239-23')" />
    <a-descriptions :column="2">
      <a-descriptions-item label="ID">{{
          info.id || '--'
        }}</a-descriptions-item>
      <a-descriptions-item :label="$t('plugin.index.293829-4')">{{
          info.version || '--'
        }}</a-descriptions-item>
      <a-descriptions-item :label="$t('plugin.index.293829-2')">{{
          TypeMap[info.type] || '--'
        }}</a-descriptions-item>
      <a-descriptions-item :label="$t('Firmware.index.858355-5')">{{
          info.createTime ? dayjs(info.createTime).format('YYYY-MM-DD HH:mm:ss') : '--'
        }}</a-descriptions-item>
      <a-descriptions-item :label="$t('Plugin.index.626239-24')">
        {{  info?.configuration?.sourceId || info?.configuration?.autoCreate  ? $t('Plugin.index.626239-25') : $t('Plugin.index.626239-26') }}
        <a-tooltip
            :title="info?.configuration?.sourceId ? $t('Plugin.index.626239-27') : $t('Plugin.index.626239-28')"
        ><AIcon
            type="QuestionCircleOutlined"
            style="margin-left: 2px"
        />
        </a-tooltip>
      </a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<script setup lang="ts" name="Detail">
import { TypeMap } from './util';
import dayjs from 'dayjs';
import {useI18n} from "vue-i18n";
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
});
const {t: $t} = useI18n();
const info = ref<any>({});

onMounted(() => {
  info.value = props.data;
});
</script>

<style lang="less" scoped></style>
