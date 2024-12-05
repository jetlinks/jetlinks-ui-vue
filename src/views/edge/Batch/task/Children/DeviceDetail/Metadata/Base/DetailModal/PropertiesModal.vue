<template>
  <a-modal
      visible
      :maskClosable="false"
      title="属性详情"
      :getContainer="getPopupContainer"
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
      <a-descriptions-item label="属性类型">{{ TypeStringMap[data.valueType.type] }}</a-descriptions-item>
      <a-descriptions-item v-if="['int', 'long', 'float', 'double'].includes(data.valueType.type)" label="单位">{{ unitLabel }}</a-descriptions-item>
      <a-descriptions-item v-if="['float', 'double'].includes(data.valueType.type)" label="精度">{{ data.valueType?.scale || 0 }}</a-descriptions-item>
      <a-descriptions-item v-if="['string', 'password'].includes(data.valueType.type)" label="最大长度">{{ data.valueType?.maxLength }}</a-descriptions-item>
      <a-descriptions-item v-if="data.valueType.type === 'file'" label="文件类型">{{ data.valueType?.bodyType }}</a-descriptions-item>
      <a-descriptions-item v-if="data.valueType.type === 'date'" label="格式">{{ data.valueType?.format }}</a-descriptions-item>
      <a-descriptions-item
          v-if="
          ['boolean', 'array'].includes(data.valueType.type)"
      >
        <JsonView :value="dataTypeTable.dataSource"/>
      </a-descriptions-item>
      <a-descriptions-item
        v-if="
          ['enum', 'object'].includes(data.valueType.type)"
        :scroll="{
            y: 130
        }"
      >
        <j-table
          :columns="data.valueType.type === 'object' ? objectColumns : enumColumns"
          :dataSource="data.valueType.type === 'object' ? data.valueType.properties : data.valueType.elements"
          :pagination="false"
          size="small"
        >
          <template #bodyCell="{column, record, index}">
            <j-ellipsis v-if="column.dataIndex === 'id'">
              {{ record.id }}
            </j-ellipsis>
            <j-ellipsis v-if="column.dataIndex === 'name'">
              {{ record.name }}
            </j-ellipsis>
            <j-ellipsis v-if="column.dataIndex === 'value'">
              {{ record.value }}
            </j-ellipsis>
            <j-ellipsis v-if="column.dataIndex === 'text'">
              {{ record.text }}
            </j-ellipsis>
            <j-ellipsis v-if="column.dataIndex === 'valueType'">
              {{ findTypeItem(record.valueType?.type).label }}
            </j-ellipsis>
          </template>
        </j-table>
      </a-descriptions-item>
      <a-descriptions-item label="属性来源">
        {{ sourceMap[data.expands.source] }}
        <a v-if="data.expands.source === 'rule'" type="link" style="padding: 0 12px" @click="showRuleDetail">查看</a>
      </a-descriptions-item>
      <a-descriptions-item label="读写类型">{{ readTypeText }}</a-descriptions-item>
      <a-descriptions-item v-if="showSetting && data.expands?.storageType" label="存储方式">{{ settingData[data.expands?.storageType] }}</a-descriptions-item>
      <a-descriptions-item v-if="showMetrics" label="指标配置"></a-descriptions-item>
      <a-descriptions-item v-if="showMetrics">
        <j-table
            :columns="metrics.columns"
            :dataSource="metrics.dataSource"
            :pagination="false"
            size="small"
        >
          <template #bodyCell="{column, record, index}">
            <span v-if="column.dataIndex === 'serial' ">
              {{ index + 1 }}
            </span>
            <span v-if="column.dataIndex === 'value'">
              {{ record.range === true ? record.value?.join('-') : record.value }}
            </span>
          </template>
        </j-table>
      </a-descriptions-item>
    </j-descriptions>
    <template #footer>
      <j-button type="primary" @click="ok">确认</j-button>
    </template>
  </a-modal>
  <RuleDetailModal
    v-if="ruleRecord.visible"
    :value="ruleRecord.value"
    :getPopupContainer="getPopupContainer"
    @cancel="onCloseRule"
  />
</template>

<script setup lang="ts" name="PropertiesModal">
import {omit} from "lodash-es";
import {watch} from "vue";
import JsonView from './JsonView.vue'
import {TypeStringMap} from "@/views/device/components/Metadata/Base/columns";
import {useStoreType} from "@/views/device/components/Metadata/Base/utils";
import {enumColumns, objectColumns} from './utils'
import { findTypeItem } from '@/components/Metadata/Table/components/Type/data'
import RuleDetailModal from '../components/VirtualRule/DetailModal.vue'
import { queryDeviceVirtualProperty } from '@/api/device/instance';
import { queryProductVirtualProperty } from '@/api/device/product';
import {useInstanceStore} from "store/instance";
import {useProductStore} from "store/product";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  getPopupContainer: {
    type: Function,
    default: undefined
  },
  unitOptions: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['cancel'])

const route = useRoute()
const instanceStore = useInstanceStore();
const productStore = useProductStore();
const { settingData } = useStoreType(props.type)

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

const ruleRecord = reactive({
  visible: false,
  value: undefined
})

const unitLabel = computed(() => {
  let label = props.data.valueType?.unit

  const item = props.unitOptions?.find(item => item.value === label)
  if (item) {
    label = item.label
  }
  return label
})

const dataTypeTable = reactive<{ columns: any[], dataSource: any }>({
  columns: [],
  dataSource: []
})

const metrics = reactive<{ columns: any[], dataSource: any }>({
  columns: [
    { title: '序号', dataIndex: 'serial', width: 60 },
    { title: '指标标识', dataIndex: 'id' },
    { title: '指标名称', dataIndex: 'name' },
    { title: '指标值', dataIndex: 'value' },
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

const handleDataTable = (type: string) => {
  switch (type) {
    case 'enum':
      dataTypeTable.columns = [
        { title: 'Value', dataIndex: 'value'},
        { title: 'Text', dataIndex: 'text'},
      ]
      dataTypeTable.dataSource = props.data.valueType?.elements
      break;
    case 'object':
      dataTypeTable.columns = [
        { title: '标识', dataIndex: 'id', width: 50},
        { title: '名称', dataIndex: 'name'},
        { title: '名称', dataIndex: 'name'},
      ]
      dataTypeTable.dataSource = props.data.valueType?.properties
          break;
    case 'boolean':
      dataTypeTable.dataSource = {
        ...omit(props.data.valueType, ['type'])
      }
      break;
    case 'array':
      dataTypeTable.dataSource = props.data.valueType.elementType
      break;
  }
}

const cancel = () => {
  emit('cancel')
}

const ok = () => {
  cancel()
}

const showRuleDetail = () => {
  ruleRecord.visible = true
}
const onCloseRule = () => {
  ruleRecord.visible = false
  ruleRecord.value = undefined
}

const getRuleDetail = async () => {
  if (props.data.expands.source === 'rule') {
    let resp
    if (props.type === 'product') {
      resp = await queryProductVirtualProperty(
        productStore.current?.id,
        props.data.id,
      );
    } else {
      resp = await queryDeviceVirtualProperty(
        instanceStore.current?.productId,
        instanceStore.current?.id,
        props.data.id,
      );
    }

    if (resp.success) {
      ruleRecord.value = resp.result.rule?.script
    }
  }
}

watch(() => props.data.valueType.type, (val) => {
  getRuleDetail()
  handleDataTable(val)
}, { immediate: true })

</script>

<style scoped>

</style>
