<template>
  <j-modal
      visible
      title="功能详情"
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
      <a-descriptions-item label="功能标识">{{ data.id }}</a-descriptions-item>
      <a-descriptions-item label="功能名称">{{ data.name }}</a-descriptions-item>
      <a-descriptions-item label="是否异步">{{ data.async ? '是' : '否' }}</a-descriptions-item>
      <a-descriptions-item label="输入参数"></a-descriptions-item>
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

<script setup lang="ts" name="FunctionModal">
import {OtherConfigInfo} from "@/views/device/components/Metadata/Base/components";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const dataTypeTable = reactive<{ columns: any[], dataSource: any }>({
  columns: [
    { title: '参数标识', dataIndex: 'id', width: 120, ellipsis: true },
    { title: '参数名称', dataIndex: 'name', width: 120, ellipsis: true },
    { title: '数据类型', dataIndex: 'type', width: 100 },
    { title: '其它配置', dataIndex: 'valueType', ellipsis: true },
  ],
  dataSource: props.data?.inputs || []
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