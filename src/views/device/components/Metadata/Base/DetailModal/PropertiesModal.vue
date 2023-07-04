<template>
  <j-modal
      visible
      title="属性详情"
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
      <a-descriptions-item label="属性标识">{{ data.id }}</a-descriptions-item>
      <a-descriptions-item label="属性名称">{{ data.name }}</a-descriptions-item>
      <a-descriptions-item label="属性类型">{{ data.valueType.type }}</a-descriptions-item>
      <a-descriptions-item v-if="['int', 'long', 'float', 'double'].includes(data.valueType.type)" label="单位">{{ data.valueType?.unit }}</a-descriptions-item>
      <a-descriptions-item v-if="['float', 'double'].includes(data.valueType.type)" label="精度">{{ data.valueType?.scale }}</a-descriptions-item>
      <a-descriptions-item v-if="['string', 'password'].includes(data.valueType.type)" label="最大长度">{{ data.valueType?.maxLength }}</a-descriptions-item>
      <a-descriptions-item v-if="data.valueType.type === 'file'" label="文件类型">{{ data.valueType?.fileType }}</a-descriptions-item>
      <a-descriptions-item v-if="data.valueType.type === 'date'" label="格式">{{ data.valueType?.format }}</a-descriptions-item>
      <a-descriptions-item
          v-if="
          ['enum', 'object', 'boolean'].includes(data.valueType.type) ||
          (data.valueType.type === 'array' &&  data.valueType.elementType === 'enum')
          "
      >
        <j-table
            :columns="dataTypeTable.columns"
            :dataSource="dataTypeTable.dataSource"
            :pagination="false"
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
      <a-descriptions-item label="来源">
        {{ sourceMap[data.expands.source] }}
      </a-descriptions-item>
      <a-descriptions-item label="读写类型">{{ readTypeText }}</a-descriptions-item>
      <a-descriptions-item v-if="showSetting" label="存储方式">{{ data.id }}</a-descriptions-item>
      <a-descriptions-item v-if="showMetrics" label="指标配置"></a-descriptions-item>
      <a-descriptions-item v-if="showMetrics">
        <j-table
            :columns="metrics.columns"
            :dataSource="metrics.dataSource"
            :pagination="false"
            size="small"
        >

        </j-table>
      </a-descriptions-item>
    </j-descriptions>
    <template #footer>
      <j-button type="primary" @click="ok">确认</j-button>
    </template>
  </j-modal>
</template>

<script setup lang="ts" name="PropertiesModal">
import {OtherConfigInfo} from "@/views/device/components/Metadata/Base/components";
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

const dataTypeTable = reactive<{ columns: any[], dataSource: any }>({
  columns: [],
  dataSource: []
})

const metrics = reactive<{ columns: any[], dataSource: any }>({
  columns: [
    { title: '指标标识', dataIndex: 'id' },
    { title: '指标名称', dataIndex: 'name' },
    { title: '指标治', dataIndex: 'value' },
  ],
  dataSource: []
})

const showMetrics = computed(() => {
  const show = props.data?.expands?.metrics?.length
  if (show) {
      metrics.dataSource = props.data?.expands?.metrics
  }
  return show
})

const showSetting = computed(() => {
  const setting = omit((props.data?.expands || {}), ['type', 'source'])
  return Object.values(setting).length
})

const settingValue = computed(() => {
  console.log(showSetting.value)
  return ''
})

const handleDataTable = (type: string) => {
  switch (type) {
    case 'enum':
      dataTypeTable.columns = [
        { title: 'Value', dataIndex: 'value'},
        { title: 'Text', dataIndex: 'text'},
      ]
      dataTypeTable.dataSource = [{ unit: props.data.valueType?.unit }]
      break;
    case 'object':
      dataTypeTable.columns = [
        { title: '标识', dataIndex: 'id', width: 50},
        { title: '名称', dataIndex: 'name'},
        { title: '名称', dataIndex: 'name'},
      ]
      dataTypeTable.dataSource = [{ unit: props.data.valueType?.unit, scale: props.data.valueType?.scale }]
      break;
  }
}

watch(() => props.data.valueType.type, () => {
  handleDataTable(props.data.valueType.type === 'array' ? props.data.valueType.elementType : props.data.valueType.type)
}, { immediate: true })

const cancel = () => {
  emit('cancel')
}

const ok = () => {
  cancel()
}

</script>

<style scoped>

</style>