<template>
  <div class='device'>
    <a-form-item
      :rules='rules'
      name='device'
    >
      <template #label>
        <TitleComponent data='触发规则' style='font-size: 14px;' />
      </template>
      <AddButton
        style='width: 100%'
        @click='visible = true'
      >
        <Title :options='data.options.trigger' />
      </AddButton>
    </a-form-item>
    <Terms />
    <AddModel v-if='visible' @cancel='visible = false' @save='save' :value='data.trigger.device' :options='data.options.trigger' />
  </div>
</template>

<script setup lang='ts' name='SceneSaveDevice'>
import { storeToRefs } from 'pinia';
import { useSceneStore } from '@/store/scene'
import AddModel from './AddModal.vue'
import AddButton from '../components/AddButton.vue'
import Title from '../components/Title.vue'
import Action from '../action/index.vue'
import Terms from '../components/Terms'
import type { TriggerDevice } from '@/views/rule-engine/Scene/typings'

const sceneStore = useSceneStore()
const { data } = storeToRefs(sceneStore)

const visible = ref(false)

const rules = [{
  validator(_: any, v: any) {
    if (!v) {
      return Promise.reject(new Error('请配置设备触发规则'));
    }
    return Promise.resolve();
  },
}]

const save = (device: TriggerDevice, options: Record<string, any>) => {
  data.value.trigger!.device = device
  data.value.options!.trigger = options
}

</script>

<style scoped lang='less'>

</style>