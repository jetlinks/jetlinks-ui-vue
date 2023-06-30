<template>
  <j-popconfirm-modal
      body-style="padding-top:4px;width:600px;"
      @confirm="confirm"
      @cancel="cancel"
  >
    <template #content>
      <j-collapse v-model:activeKey="activeKey" >
        <StorageSetting ref="storageRef" :record="value"/>
        <j-collapse-panel key="metrics">
          <template #header>
            指标配置
            <j-tooltip title="场景联动页面可引用指标配置作为触发条件">
              <AIcon type="ExclamationCircleOutlined" style="padding-left: 12px;padding-top: 4px;" />
            </j-tooltip>
          </template>
          <Metrics ref="metrics" :value="value.expands?.metrics" />
        </j-collapse-panel>
      </j-collapse>
    </template>
    <AIcon class="j-data-table-config--icon" type="EditTwoTone" />
  </j-popconfirm-modal>
</template>

<script setup lang="ts" name="OtherSetting">
import Metrics from './Metrics/Metrics.vue'
import StorageSetting from "./StorageSetting.vue";
import {watch} from "vue";

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:value'])

const activeKey = ref()
const storageRef = ref()
const metrics = ref()
const confirm = () => {
  const storageValue = storageRef.value?.getData() || {}
  let metricsData = []

  return new Promise((resolve, reject) => {
    metrics.value.getData().then((data: any[]) => {
      metricsData = data
      const expands = {
        ...storageValue,
        metrics: metricsData
      }

      emit('update:value', {
        ...props.value,
        expands: {
          ...(props.value.expands || {}),
          ...expands
        }
      })
      resolve(true)
    }).catch(() => {
      reject(false)
    })
  })
}

const cancel = () => {

}

watch(() => props.value, () => {
  console.log(props.value)
}, {immediate: true, deep: true})

</script>

<style scoped>

</style>