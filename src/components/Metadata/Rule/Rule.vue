<template>
  <j-form ref="formRef" :model="formData">
    <ReadType v-model:value="formData.type" />
    <j-form-item label="触发属性" required>
      <j-select />
    </j-form-item>
    <j-form-item label="计算规则" required>
      <div class="rule-add" @click="showRuleWindow">
        编辑规则
      </div>
    </j-form-item>
    <j-form-item label="窗口" :name="['virtualRule', 'windowType']" required>
      <j-select
          v-model:value="formData.virtualRule.windowType"
          :options="[
              { label: '无', value: undefined },
              { label: '时间窗口', value: 'time' },
              { label: '频次窗口', value: 'num' },
          ]"
      />
    </j-form-item>
    <template v-if="showWindow">
      <j-form-item label="聚合函数" :name="['virtualRule', 'aggType']">
        <j-select
            v-model:value="formData.virtualRule.aggType"
            :options="[
              { label: '时间窗口', value: 'time' },
              { label: '频次窗口', value: 'num' },
            ]"
            placeholder="请选择聚合函数"
        />
      </j-form-item>
      <j-form-item label="窗口长度" :name="['virtualRule', 'window', 'span']">
        <j-input-number v-model:value="formData.virtualRule.window.span" />
      </j-form-item>
      <j-form-item label="步长" :name="['virtualRule', 'window', 'every']">
        <j-input-number v-model:value="formData.virtualRule.window.every" />
      </j-form-item>
    </template>
  </j-form>
</template>

<script setup lang="ts" name="Rule">
import { ReadType } from '../components'

type Emit = {
  (e: 'update:value', data: Record<string, any>): void
}

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits<Emit>()
const formRef = ref<any>(null)

const formData = reactive<{
  type?: string
  virtualRule: Record<string, any>
}>({
  type: undefined,
  virtualRule: {
    windowType: undefined,
    aggType: undefined,
    isVirtualRule: false,
    type: undefined,
    window: {
      every: undefined,
      span: undefined
    },
  }
})

const showWindow = computed(() => {
  const hasWindowType = !!formData.virtualRule.windowType

  if (!hasWindowType) {
    formData.virtualRule.window = {
      every: undefined,
      span: undefined
    }
    formData.virtualRule.aggType = undefined
  }
  formData.virtualRule.isVirtualRule = hasWindowType
  formData.virtualRule.type = hasWindowType ? 'window' : 'script'
  return hasWindowType
})

const confirm = () => {
  return new Promise(async (resolve, reject) => {
    const data = await formRef.value?.validate?.()
    if (data) {
      emit('update:value', formData)
      resolve(true)
    } else {
      reject()
    }
  })
}

const showRuleWindow = () => {

}

watch(() => props.value, () => {
  Object.assign(formData, props.value)
}, { immediate: true })

</script>

<style scoped>
.rule-add {

}
</style>