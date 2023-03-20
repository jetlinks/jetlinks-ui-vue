<template>
  <j-modal
      title='触发规则'
      visible
      :width='820'
      @click='save'
      @cancel='cancel'
  >
    <Timer
        ref='timerRef' v-model:value='addModel.timer'
    />
  </j-modal>
</template>

<script setup lang="ts" name="timerAddModel">
import Timer from '../components/Timer'
import type { OperationTimer } from '@/views/rule-engine/Scene/typings'
import {nextTick, PropType} from "vue";
import {TriggerDevice} from "@/views/rule-engine/Scene/typings";
import {handleTimerOptions} from "@/views/rule-engine/Scene/Save/components/Timer/util";

type Emit = {
  (e: 'cancel'): void
  (e: 'save', data: TriggerDevice, options: Record<string, any>): void
}

const props = defineProps({
  timer: {
    type: Object as PropType<OperationTimer>,
    default: () => ({})
  }
})
const emit = defineEmits<Emit>()

const timerRef = ref()

interface AddModelType {
  timer: OperationTimer
}

const addModel = reactive<AddModelType>({
  timer: props.timer
})

const save = async () => {
  const timerData = await timerRef.value?.validateFields()
  if (timerData) {
    const options = handleTimerOptions(timerData)
    emit("save", timerData, options)
  }
}

const cancel = () => {
  emit("cancel")
}

nextTick(() => {
  Object.assign(addModel, props.timer)
})

</script>

<style scoped>

</style>