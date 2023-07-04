<template>
  <j-modal
      visible
      title="事件详情"
      width="650px"
      @cancel="cancel"
      @ok="ok"
  >
    <j-descriptions
        :column="1"
        :labelStyle="{
          width: '72px',
          textAlign: 'right',
          justifyContent: 'end'
        }"
    >
      <a-descriptions-item label="事件标识">{{ data.id }}</a-descriptions-item>
      <a-descriptions-item label="事件名称">{{ data.name }}</a-descriptions-item>
      <a-descriptions-item label="事件级别">{{ EventLevel[data.expands.level] }}</a-descriptions-item>
      <a-descriptions-item label="输出参数"></a-descriptions-item>
      <a-descriptions-item>
        <j-table
            :columns="dataTypeTable.columns"
            :dataSource="dataTypeTable.dataSource"
            :pagination="false"
            :scroll="{y: 200}"
            size="small"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.dataIndex === 'type'">
              {{ record.valueType?.type }}
            </template>
            <template v-if="column.dataIndex === 'valueType'">
              <OtherConfigInfo :value="record.valueType" />
            </template>
          </template>
        </j-table>
      </a-descriptions-item>
    </j-descriptions>
    <template #footer>
      <j-button type="primary" @click="ok">确认</j-button>
    </template>
  </j-modal>
</template>

<script setup lang="ts" name="EventModal">
import {OtherConfigInfo} from "@/views/device/components/Metadata/Base/components";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const EventLevel = {
  ordinary: '普通',
  warn: '警告',
  urgent: '紧急'
}

const dataTypeTable = reactive<{ columns: any[], dataSource: any }>({
  columns: [
    { title: '参数标识', dataIndex: 'id', width: 150, ellipsis: true },
    { title: '参数名称', dataIndex: 'name', width: 150, ellipsis: true },
    { title: '数据类型', dataIndex: 'type', width: 100 },
    { title: '其它配置', dataIndex: 'valueType', ellipsis: true },
  ],
  dataSource: props.data?.valueType?.properties || []
})

const emit = defineEmits(['cancel'])
const cancel = () => {
  emit('cancel')
}

const ok = () => {
  cancel()
}



</script>

<style scoped>

</style>