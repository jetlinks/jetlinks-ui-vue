<template>
  <j-popconfirm-modal
      body-style="padding-top:4px;width:600px;"
      placement="topRight"
      @confirm="confirm"
      @cancel="cancel"
      @visibleChange="visibleChange"
  >
    <template #content>
      <j-scrollbar height="350">
        <j-collapse v-model:activeKey="activeKey" >
          <j-collapse-panel v-for="(item, index) in config" :key="'store_'+index" :header="item.name">
            <j-table
                :columns="columns"
                :data-source="item.properties"
                :pagination="false"
                rowKey="id"
            >
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.dataIndex === 'type'">{{ record.type?.name }}</template>
                <value-item
                    v-else-if="column.dataIndex === 'value'"
                    v-model:modelValue="configValue[record.property]"
                    :itemType="item.properties[index].type?.type"
                    :options="(item.properties[index].type?.elements || []).map((a:any) => ({
                           label: a.text,
                           value: a.value,
                    }))"
                />
              </template>
            </j-table>
          </j-collapse-panel>
          <j-collapse-panel key="metrics" v-if="showMetrics">
            <template #header>
              指标配置
              <j-tooltip title="场景联动页面可引用指标配置作为触发条件">
                <AIcon type="ExclamationCircleOutlined" style="padding-left: 12px;padding-top: 4px;" />
              </j-tooltip>
            </template>
            <Metrics ref="metricsRef" :value="myValue.expands?.metrics" :type="props.value?.valueType?.type"/>
          </j-collapse-panel>
        </j-collapse>
      </j-scrollbar>
    </template>
    <j-button>
      <AIcon type="SettingOutlined" />
      配置
    </j-button>
  </j-popconfirm-modal>
</template>

<script setup lang="ts" name="OtherSetting">
import Metrics from './Metrics/Metrics.vue'
import {watch} from "vue";
import {cloneDeep} from "lodash";
import {useProductStore} from "store/product";
import {useInstanceStore} from "store/instance";
import {getMetadataConfig, getMetadataDeviceConfig} from "@/api/device/product";
import {omit} from "lodash-es";

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})

const type = inject('_metadataType')

const productStore = useProductStore()
const deviceStore = useInstanceStore()

const emit = defineEmits(['update:value'])

const activeKey = ref()
const storageRef = ref()
const metricsRef = ref()

const myValue = ref(props.value)
const visible = ref(false)

const config = ref<any>([])
const configValue = ref(props.value?.expands)

const showMetrics = computed(() => {
  return ['int', 'long', 'float', 'double', 'string', 'boolean', 'date'].includes(props.value?.valueType?.type as any)
})

const columns = ref([
  {
    title: '参数名称',
    dataIndex: 'name',
    width: 150,
    ellipsis: true,
  },
  {
    title: '输入类型',
    dataIndex: 'type',
    width: 150,
  },
  {
    title: '值',
    dataIndex: 'value',
  },
]);

const getConfig = async () => {
  const record = props.value
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
      activeKey.value = ['store_0']
      resp.result.forEach(a => {
        if (a.properties) {
          a.properties.forEach(b => {
            configValue.value[b.property] = undefined
          })
        }
      })
    } else if (showMetrics.value) {
      activeKey.value = ['metrics']
    }
  }
}

const confirm = () => {

  return new Promise(async (resolve, reject) => {
    try {
      let metrics: any
      metrics = await metricsRef.value?.getData()

      const expands = {
        ...(configValue.value || {}),
      }

      if (metrics) {
        expands.metrics = metrics
      }
      console.log(expands)
      emit('update:value', {
        ...props.value,
        expands: {
          ...(props.value.expands || {}),
          ...expands
        }
      })
      resolve(true)
    } catch (err) {
      console.log(err)
      reject(false)
    }
  })
}

const visibleChange = (e: boolean) => {
  if (e) {
    configValue.value = omit(props.value?.expands, ['source', 'type', 'metrics', 'required'])
    getConfig()
  }
}

const cancel = () => {
  console.log(props.value)
  myValue.value = cloneDeep(props.value)
}

watch(() => props.value, () => {
  console.log(props.value)
  myValue.value = cloneDeep(props.value)
}, {immediate: true, deep: true})

</script>

<style scoped>

</style>