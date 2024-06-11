<template>
  <j-modal
      title='触发规则'
      visible
      :width='820'
      @ok='save'
      @cancel='cancel'
  >
    <Timer
        ref='timerRef' v-model:value='addModel.timer' type="timer"
    />
  </j-modal>
</template>

<script setup lang="ts" name="timerAddModel">
import Timer from '../components/Timer'
import type { OperationTimer } from '@/views/rule-engine/Scene/typings'
import { PropType} from "vue";
import {handleTimerOptions} from "@/views/rule-engine/Scene/Save/components/Timer/util";

type Emit = {
  (e: 'cancel'): void
  (e: 'save', data: OperationTimer, options: Record<string, any>): void
}

const props = defineProps({
  value: {
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
  timer: props.value
})

const save = async () => {
  const timerData = await timerRef.value?.validateFields()
  if (timerData) {
    const options = handleTimerOptions(addModel.timer)
    emit("save", addModel.timer, options)
  }
}

const cancel = () => {
  emit("cancel")
}

// watchEffect(() => {
//   addModel.timer = props.value
// })

</script>

<style scoped>

</style>
