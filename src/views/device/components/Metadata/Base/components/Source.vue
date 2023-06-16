<template>
  <j-popconfirm-modal @confirm="confirm" bodyStyle="width: 450px">
    <template #content>
      <j-form ref="formRef" layout="vertical" :model="formData">
        <ReadType v-model:value="formData.type" :disabled="value.source === 'manual'" />
      </j-form>
    </template>
    <j-button style="padding: 4px 8px;">
      <AIcon type="EditOutlined" />
    </j-button>
  </j-popconfirm-modal>
</template>

<script setup lang="ts" name="MetadataSource">

import { ReadType } from '@/components/Metadata/components'

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
  type?: string[]
}>({
  type: props.value.source === 'manual' ? ['write'] : []
})

const confirm = () => {
  return new Promise(async (resolve, reject) => {
    const data = await formRef.value!.validate().catch(() => {
      reject()
    })
    if (data) {
      emit('update:value', formData)
      resolve(true)
    }
  })
}

watch(() => props.value, () => {
  Object.assign(formData, props.value)
}, { immediate: true })

</script>

<style scoped>

</style>