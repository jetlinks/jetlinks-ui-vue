<template>
  <j-modal
    visible
    :title='title'
    :width='750'
    :confirm-loading='loading'
    :maskClosable='false'
    @cancel='emit("close")'
    @ok='handleOk'
  >
    <j-form
      layout='vertical'
      name='scene-save'
      ref="formRef"
      :model='formModel'
    >
      <j-form-item
        name='name'
        :label="$t('Save.save.542578-0')"
        :rules="[
          { required: true, message: $t('Save.save.542578-1') },
          { max: 64, message: $t('Save.save.542578-2') }
        ]"
      >
        <j-input v-model:value='formModel.name' :placeholder="$t('Save.save.542578-1')" />
      </j-form-item>
      <j-form-item
        :name='["trigger", "type"]'
        :label="$t('Save.save.542578-3')"
        :rules="[{ required: true, message: $t('Save.save.542578-4') }]"
      >
        <TriggerWay v-model:modelValue='formModel.trigger.type' :disabled='disabled' />
      </j-form-item>
    </j-form>
  </j-modal>
</template>

<script setup lang='ts'>

import { SceneItem } from '@/views/rule-engine/Scene/typings'
import TriggerWay from './components/TriggerWay.vue'
import type { PropType } from 'vue'
import type { FormInstance } from 'ant-design-vue';
import { save, modify } from '@/api/rule-engine/scene'
import { useMenuStore } from 'store/menu'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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

watchEffect(() => {
  Object.assign(formModel, props.data)
})

const emit = defineEmits<Emit>()

const title = computed(() => {
  return props.data?.id ? $t('Save.save.542578-5') : $t('Save.save.542578-6')
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