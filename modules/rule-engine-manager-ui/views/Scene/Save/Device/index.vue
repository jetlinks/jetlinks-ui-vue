<template>
  <div class='device'>
    <a-form-item
      :rules='rules'
      :name='["trigger", "device"]'
    >
      <template #label>
        <TitleComponent :data="$t('Device.index.372524-0')"/>
      </template>

        <AddButton
          style='width: 100%'
          @click='visible = true'
        >
          <Title :options='data.options.trigger' />
        </AddButton>
        <AddModel v-if='visible' @cancel='visible = false' @save='save' :value='data.trigger.device' :options='data.options.trigger' />
        <CheckItem />
    </a-form-item>
    <Terms ref="termsRef" />
  </div>
</template>

<script setup lang='ts' name='SceneSaveDevice'>
import { storeToRefs } from 'pinia';
import { useSceneStore } from '../../../../store/scene'
import AddModel from './AddModal.vue'
import AddButton from '../components/AddButton.vue'
import Title from '../components/Title.vue'
import Terms from '../components/Terms'
import type { TriggerDevice } from '../../typings';
import { EventEmitter, DeviceEmitterKey } from '../util';
import CheckItem from './CheckItem.vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const sceneStore = useSceneStore()
const { data } = storeToRefs(sceneStore)

const visible = ref(false)
const termsRef = ref()

const rules = [{
  validator(_: any, v: any) {
    if (!v) {
      return Promise.reject(new Error($t('Device.index.372524-1')));
    } else {

        if (
          !v.productId ||
          (['fixed', 'org'].includes(v.selector) && !v.selectorValues) ||
          (v.operation?.operator === 'readProperty' && !v.operation!.readProperties.length) ||
          (v.operation?.operator === 'writeProperty' && !Object.keys(v.operation!.writeProperties).length) ||
          (v.operation?.operator === 'invokeFunction' && !v.operation.functionId) ||
          (v.operation?.operator === 'reportEvent' && !v.operation.eventId)
        ) {
          return Promise.reject(new Error($t('Device.index.372524-2')));
        }
    }
    return Promise.resolve();
  },
}]

const save = (device: TriggerDevice, options: Record<string, any>) => {
  data.value.trigger!.device = device
  data.value.options!.trigger = options
  visible.value = false
  EventEmitter.emit(DeviceEmitterKey, device)
}

defineExpose({
  changePaneIndex: (index: number) => termsRef.value?.changePaneIndex(index)
})
</script>

<style scoped lang='less'>

</style>
