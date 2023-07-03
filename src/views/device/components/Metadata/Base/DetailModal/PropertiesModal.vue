<template>
  <j-modal
      visible
      title="属性详情"
      @cancel="cancel"
      @ok="ok"
  >
    <a-descriptions
        :column="1"
        :labelStyle="{
          width: '72px',
          textAlign: 'right',
          justifyContent: 'end'
        }"
    >
      <a-descriptions-item label="属性标识">{{ data.id }}</a-descriptions-item>
      <a-descriptions-item label="属性名称">{{ data.name }}</a-descriptions-item>
      <a-descriptions-item label="属性类型">{{ data.valueType.type }}</a-descriptions-item>
<!--      <j-table-->
<!--        :paging="false"-->
<!--      >-->

<!--      </j-table>-->
      <a-descriptions-item label="来源">
        {{ sourceMap[data.expands.source] }}
      </a-descriptions-item>
      <a-descriptions-item label="读写类型">{{ readTypeText }}</a-descriptions-item>
      <a-descriptions-item v-if="showSetting" label="存储方式">{{ data.id }}</a-descriptions-item>
      <a-descriptions-item v-if="showMetrics" label="指标配置">{{ data.id }}</a-descriptions-item>
    </a-descriptions>
  </j-modal>
</template>

<script setup lang="ts" name="PropertiesModal">

import {omit} from "lodash-es";
import {watch} from "vue";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['cancel'])

const sourceMap = {
    'device': '设备',
    'manual': '手动',
    'rule': '规则',
}

const readTypeText = computed(() => {
  const type = {
    "read": "读",
    "write": "写",
    "report": "上报",
  }

  return props.data?.expands?.type?.map?.((key: string) => type[key]).join('、')
})

const dataTypeTable = reactive({
  columns: [],
  dataSource: []
})

const showMetrics = computed(() => {
  return props.data?.expands?.metrics?.length
})

const showSetting = computed(() => {
  const setting = omit((props.data?.expands || {}), ['type', 'source'])
  return Object.values(setting).length
})

watch(() => props.data.valueType.type, () => {

})

const cancel = () => {
  emit('cancel')
}

const ok = () => {
  cancel()
}

</script>

<style scoped>

</style>