<template>
  <j-collapse-panel v-for="(item, index) in config" :key="'store_'+index" :header="item.name">
    <j-table
        :columns="columns"
        :data-source="item.properties"
        :pagination="false"
        rowKey="id"
    >
      <template #bodyCell="{ column, record, index }">
        <template v-if="column.dataIndex === 'type'">{{ record.type?.name }}</template>
        <ValueItem
            v-else-if="column.dataIndex === 'value'"
            v-model:modelValue="configValue.value[record.property]"
            :itemType="record.type?.type"
            :options="(record?.type?.elements || []).map((a:any) => ({
                   label: a.text,
                   value: a.value,
            }))"
            style="width: 100%;z-index: 1071"
            :get-popup-container="(node) => fullRef || node"
        />
      </template>
    </j-table>
  </j-collapse-panel>
</template>

<script setup lang="ts" name="StorageSetting">
import {useProductStore} from "store/product";
import {useInstanceStore} from "store/instance";
import type { PropType } from "vue";
import { defineExpose } from 'vue'
import {getMetadataConfig, getMetadataDeviceConfig} from "@/api/device/product";
import { omit } from 'lodash-es'
import { FULL_CODE } from 'jetlinks-ui-components/es/DataTable'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()


const props = defineProps({
  type: {
    type: String,
    default: undefined
  },
  record: {
    type: Object as PropType<any>,
    default: undefined
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const productStore = useProductStore()
const deviceStore = useInstanceStore()
const fullRef = inject(FULL_CODE);
const config = ref<any>([])
const configValue = ref(props.record?.expands)

const columns = ref([
  {
    title: $t('Properties.StorageSetting.6916231-0'),
    dataIndex: 'name',
    width: 150,
    ellipsis: true,
  },
  {
    title: $t('Properties.StorageSetting.6916231-1'),
    dataIndex: 'type',
    width: 150,
  },
  {
    title: $t('Properties.StorageSetting.6916231-2'),
    dataIndex: 'value',
  },
]);
const getConfig = async () => {
  const { type, record } = props
  const id = type === 'product' ? productStore.current?.id : deviceStore.current.id
  console.log(record.id, id, record.valueType)
  if(!record.id || !id || !record.valueType.type) return

  const params: any = {
    deviceId: id,
    metadata: {
      id: record.id,
      type: 'property',
      dataType: record.valueType.type,
    },
  }

  const resp = type === 'product' ? await getMetadataConfig(params) : await getMetadataDeviceConfig(params)
  if (resp.status === 200) {

    config.value = resp.result
    if (resp.result.length && !configValue.value) {
      resp.result.forEach(a => {
        if (a.properties) {
          a.properties.forEach(b => {
            configValue.value[b.property] = undefined
          })
        }
      })
    }
  }
}

watch(() => props.visible, () => {
  if (props.visible) {
    configValue.value = omit(props.record?.expands, ['source', 'type', 'metrics'])
    getConfig()
  }
}, { immediate: true })

const getData = () => {
  return configValue.value
}

defineExpose({
  getData
})

</script>

<style scoped>

</style>
