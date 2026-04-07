<template>
  <div class='device'>
    <a-form-item
        :rules='rules'
        :name='["trigger", "collector"]'
        v-if="formData.triggerType==='collector'"
        :label="$t('Device.index.372524-0')"
    >
      <AddButton
          style='width: 100%'
          @click='visible = true'
      >
        <Title :options='formData.options.trigger'/>
      </AddButton>
      <AddModel v-if='visible && formData.triggerType==="collector"' @cancel='visible = false' @save='save'
                :value='formData.trigger.collector' :options='formData.options.trigger'/>
    </a-form-item>
    <Terms ref="termsRef"/>
  </div>
</template>

<script setup lang='ts' name='SceneSaveDevice'>
import AddModel from './AddModal.vue'
import AddButton from '../components/AddButton.vue'
import Title from './Title.vue'
import type {TriggerCollector} from '../../typings';
import {EventEmitter, DeviceEmitterKey} from '../util';
import Terms from "../components/Terms";
import {useSceneStore} from "@rule-engine-manager-ui/store/scene";
import {storeToRefs} from "pinia";
import { useI18n } from 'vue-i18n'

const sceneStore = useSceneStore()
const { data: formData } = storeToRefs(sceneStore)
const { t: $t } = useI18n()
const visible = ref(false)
const termsRef = ref()

const rules = [{
  validator(_: any, v: any) {
    if (!v) {
      return Promise.reject(new Error($t('Collector.actions.index-6100078-12')));
    } else if (!v.pointSelectInfo.pointIds.length) {
      return Promise.reject(new Error($t('Collector.actions.index-6100078-13')));
    }
    return Promise.resolve();
  },
}]
const rulesAI = [{
  validator(_: any, v: any) {
    if (!v) {
      return Promise.reject(new Error($t('Collector.actions.index-6100078-12')));
    }
    return Promise.resolve();
  },
}]

const save = (collector: TriggerCollector, options: Record<string, any>) => {
  formData.value.trigger!.collector = collector
  formData.value.options!.trigger = options
  visible.value = false
  EventEmitter.emit(DeviceEmitterKey, collector)
}

defineExpose({
  changePaneIndex: (index: number) => termsRef.value?.changePaneIndex(index)
})

</script>

<style scoped lang='less'>

</style>
