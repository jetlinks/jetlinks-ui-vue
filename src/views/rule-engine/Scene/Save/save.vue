<template>
  <a-modal
    visible
    :title='title'
    :width='750'
    :confirm-loading='loading'
    :maskClosable='false'
    @cancel='emit("close")'
    @ok='handleOk'
  >
    <a-form
      layout='vertical'
      name='scene-save'
      ref="formRef"
      :model='formModel'
    >
      <a-form-item
        name='name'
        label='名称'
        :rules="[
          { required: true, message: '请输入名称' },
          { max: 64, message: '最多输入64个字符' }
        ]"
      >
        <a-input v-model:value='formModel.name' placeholder='请输入名称' />
      </a-form-item>
      <a-form-item
        :name='["trigger", "type"]'
        label='触发方式'
        :rules="[{ required: true, message: '请选择触发方式' }]"
      >
        <TriggerWay v-model:modelValue='formModel.trigger.type' :disabled='disabled' />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang='ts'>

import { SceneItem } from '@/views/rule-engine/Scene/typings'
import TriggerWay from './components/TriggerWay.vue'
import type { PropType } from 'vue'
import type { FormInstance } from 'ant-design-vue';
import { save, modify } from '@/api/rule-engine/scene'
import { useMenuStore } from 'store/menu'

type Emit = {
  (e: 'close'): void
}

const loading = ref(false)
const menuStory = useMenuStore()
const formModel = reactive({
  name: '',
  trigger: {
    type: 'device'
  }
})

const formRef = ref<FormInstance>()

const props = defineProps({
  data: {
    type: Object as PropType<Partial<SceneItem>>,
    default: () => ({})
  }
})

const emit = defineEmits<Emit>()

const title = computed(() => {
  return props.data?.id ? '编辑' : '新增'
})

const disabled = computed(() => {
  return !!props.data?.id
})

const handleOk = async () => {
  if (formRef.value) {
    const values = await formRef.value.validateFields()
    let modelObj = { ...values }
    if (props.data.id) {
      modelObj = {
        ...props.data,
        name: values.name
      }
    }
    loading.value = true
    const resp = props.data.id ? await modify(props.data.id, modelObj) : await save(modelObj)
    loading.value = false
    if (resp.success) {
      emit('close')
      const _id = props.data?.id || (resp.result as any).id
      menuStory.jumpPage('rule-engine/Scene/Save', {}, { triggerType: values.trigger.type, id: _id })
    }
  }
}

</script>

<style scoped>

</style>