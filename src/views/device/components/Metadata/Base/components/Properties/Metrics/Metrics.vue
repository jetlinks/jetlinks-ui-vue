<template>
  <div>
    <EditTable
        ref="tableRef"
        :dataSource="dataSource"
        :columns="newColumns"
        :height="200"
    >
      <template #id="{ record, index }">
        <EditTableFormItem :name="[index, 'id']">
          <a-input v-model:value="record.id" :placeholder="$t('Metrics.Metrics.6916335-0')"/>
        </EditTableFormItem>
      </template>
      <template #name="{ record, index }">
        <EditTableFormItem :name="[index, 'name']">
          <a-input v-model:value="record.name" :placeholder="$t('Metrics.Metrics.6916335-1')"/>
        </EditTableFormItem>
      </template>
      <template #range="{record}">
        <BooleanSelect
          v-model:value="record.range"
          @select="(e) => record.value = e ? [undefined, undefined]: undefined"/>
      </template>
      <template #value="{record, index}">
        <EditTableFormItem :name="[index, 'value']">
          <MetricValueItem
            v-model:value="record.value"
            :range="record.range"
            :options="options"
          />
        </EditTableFormItem>
      </template>
      <template #action="{index}">
        <j-button
            type="link"
            @click="() => deleteItem(index)"
        >
          <AIcon type="DeleteOutlined" />
        </j-button>
      </template>
    </EditTable>
    <j-button style="width: 100%;margin-top: 16px;" @click="addItem" >
      <template #icon><AIcon type="PlusOutlined" /></template>
      {{ $t('Metrics.Metrics.6916335-2') }}
    </j-button>
  </div>
</template>

<script setup name="Metrics" lang="ts">
import { defineExpose, provide } from 'vue'
import MetricValueItem from './ValueItem.vue'
import BooleanSelect from "@/views/device/components/Metadata/Base/components/Properties/Metrics/BooleanSelect.vue";
import { EditTable, EditTableFormItem } from '@/components/Metadata/Table'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: undefined
  },
  options: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:value'])

const dataSource = ref<any[]>([])
const tableRef = ref()

provide('metricsType', props.type)


const columns: any = [
  {
    title: $t('Metrics.Metrics.6916335-3'),
    dataIndex: 'id',
    width: 120,
    type: 'text',
    placement: 'Left',
    form: {
      required: true,
      rules: [
        {
          asyncValidator(_: any, value: any, ...setting) {
            if (value) {
              const option = setting[2]

              if (dataSource.value.filter((_, index) => index !== option.index).some(item => item.value === value)) {
                return Promise.reject($t('Metrics.Metrics.6916335-4'))
              }
              return Promise.resolve()
            }
            return Promise.reject($t('Metrics.Metrics.6916335-0'))
          }
        },
        { max: 64, message: $t('Metrics.Metrics.6916335-5') },
        {
          pattern: /^[a-zA-Z0-9_\-]+$/,
          message: $t('Metrics.Metrics.6916335-6'),
        },
      ]
    },
  },
  {
    title: $t('Metrics.Metrics.6916335-7'),
    dataIndex: 'name',
    type: 'text',
    form: {
      required: true,
      rules: [
        {
          asyncValidator(rule:any,value: any) {
            if (!value) {
              return Promise.reject($t('Metrics.Metrics.6916335-8'))
            }
            return Promise.resolve()
          }
        },
        { max: 64, message: $t('Metrics.Metrics.6916335-5') },
      ]
    },
  },

  {
    title: $t('Metrics.Metrics.6916335-9'),
    dataIndex: 'value',
    width: 100,
    form: {
      rules: [
        {
          asyncValidator(rule:any,value: any) {
            if (!value || (Array.isArray(value) && value.some(item => !item))) {
              return Promise.reject($t('Metrics.Metrics.6916335-10'))
            }
            return Promise.resolve()
          }
        },
      ]
    },
  },
  {
    title: $t('Metrics.Metrics.6916335-11'),
    dataIndex: 'action',
    width: 60,
  },
]


const newColumns = computed(() => {
  if (props.type && !['string', 'boolean', 'date'].includes(props.type)) {
    const data = [...columns]
    data.splice(2, 0, {
        title: $t('Metrics.Metrics.6916335-12'),
        dataIndex: 'range',
        width: 120,
    })
    return data
  }
  return columns
})

const addItem = () => {
  dataSource.value.push({
    id: undefined,
    name: undefined,
    range: false,
    value: undefined,
  })
}

const deleteItem = (index: number) => {
  dataSource.value.splice(index, 1)
}

const getData = () => {
  return new Promise((resolve, reject) =>  {
    tableRef.value.validate().then((data: any) => {
      resolve(data)
    }).catch((err) => {
      reject(false)
    })
  })
}

watch(() => props.value, () => {
  dataSource.value = JSON.parse(JSON.stringify(props.value)) || []
}, { immediate: true, deep: true})

defineExpose({ getData })

</script>

<style scoped>

</style>
