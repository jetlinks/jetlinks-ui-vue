<template>
  <j-modal
      visible
      :maskClosable="false"
      :title="$t('DetailModal.TagsModal.6915911-0')"
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
      <a-descriptions-item :label="$t('DetailModal.TagsModal.6915911-1')">{{ data.id }}</a-descriptions-item>
      <a-descriptions-item :label="$t('DetailModal.TagsModal.6915911-2')">{{ data.name }}</a-descriptions-item>
      <a-descriptions-item :label="$t('DetailModal.TagsModal.6915911-3')">{{ data.valueType.type }}</a-descriptions-item>
      <a-descriptions-item v-if="['int', 'long', 'float', 'double'].includes(data.valueType.type)" :label="$t('DetailModal.TagsModal.6915911-4')">{{ unitLabel }}</a-descriptions-item>
      <a-descriptions-item v-if="['float', 'double'].includes(data.valueType.type)" :label="$t('DetailModal.TagsModal.6915911-5')">{{ data.valueType?.scale }}</a-descriptions-item>
      <a-descriptions-item v-if="['string', 'password'].includes(data.valueType.type)" :label="$t('DetailModal.TagsModal.6915911-6')">{{ data.valueType?.maxLength }}</a-descriptions-item>
      <a-descriptions-item v-if="data.valueType.type === 'file'" :label="$t('DetailModal.TagsModal.6915911-7')">{{ data.valueType?.bodyType }}</a-descriptions-item>
      <a-descriptions-item v-if="data.valueType.type === 'date'" :label="$t('DetailModal.TagsModal.6915911-8')">{{ data.valueType?.format }}</a-descriptions-item>
      <a-descriptions-item
          v-if="
          ['enum', 'object', 'boolean', 'array'].includes(data.valueType.type)"
      >
        <JsonView :value="dataTypeTable.dataSource"/>
      </a-descriptions-item>
      <a-descriptions-item :label="$t('DetailModal.TagsModal.6915911-9')">{{ readTypeText }}</a-descriptions-item>
      <a-descriptions-item v-if="showSetting && data.expands?.storageType" :label="$t('DetailModal.TagsModal.6915911-10')">{{ settingData[data.expands?.storageType] }}</a-descriptions-item>
    </j-descriptions>
    <template #footer>
      <j-button type="primary" @click="ok">{{ $t('DetailModal.TagsModal.6915911-11') }}</j-button>
    </template>
  </j-modal>
</template>

<script setup lang="ts" name="TagsModal">
import {OtherConfigInfo} from "@/views/device/components/Metadata/Base/components";
import {omit} from "lodash-es";
import {watch} from "vue";
import JsonView from './JsonView.vue'
import {getUnit} from "@/api/device/instance";
import {useStoreType} from "@/views/device/components/Metadata/Base/utils";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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

const sourceMap = {
  'device': $t('DetailModal.TagsModal.6915911-12'),
  'manual': $t('DetailModal.TagsModal.6915911-13'),
  'rule': $t('DetailModal.TagsModal.6915911-14'),
}

const { settingData } = useStoreType(props.type)

const readTypeText = computed(() => {
  const type = {
    "read": $t('DetailModal.TagsModal.6915911-15'),
    "write": $t('DetailModal.TagsModal.6915911-16'),
    "report": $t('DetailModal.TagsModal.6915911-17'),
  }

  return props.data?.expands?.type?.map?.((key: string) => type[key]).join('、')
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
    { title: $t('DetailModal.TagsModal.6915911-18'), dataIndex: 'id' },
    { title: $t('DetailModal.TagsModal.6915911-19'), dataIndex: 'name' },
    { title: $t('DetailModal.TagsModal.6915911-20'), dataIndex: 'value' },
  ],
  dataSource: []
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
        { title: $t('DetailModal.TagsModal.6915911-21'), dataIndex: 'id', width: 50},
        { title: $t('DetailModal.TagsModal.6915911-22'), dataIndex: 'name'},
        { title: $t('DetailModal.TagsModal.6915911-22'), dataIndex: 'name'},
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


watch(() => props.data.valueType.type, () => {
  const type = props.data.valueType.type
  handleDataTable(props.data.valueType.type)

  // if (['float', 'double', 'int', 'long'].includes(type)) {
  //   getUnit().then((res) => {
  //     if (res.success) {
  //       res.result.map((item) => {
  //         if (item.id === props.data.valueType?.unit) {
  //           unitLabel.value = item.description
  //         }
  //       })
  //     }
  //   });
  // }
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
