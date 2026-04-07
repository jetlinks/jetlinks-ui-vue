<template>
  <a-modal
    open
    :title="$t('Terms.BranchesNameEdit.9093533-0')"
    :keyboard="false"
    :maskClosable="false"
    @cancel="onCancel"
    @ok="onOk"
  >
    <a-form ref='formRef' layout='vertical' :model="formData">
      <a-form-item :label="$t('Terms.BranchesNameEdit.9093533-1')" required name="name" :rules="[{ max: 64, message: $t('Terms.BranchesNameEdit.9093533-2')}]">
        <a-input v-model:value="formData.name"></a-input>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup name="BranchesNameEdit">
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
  name: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['cancel', 'ok'])

const formData = reactive({
  name: props.name
})
const formRef = ref()


const onCancel = () => {
  emit('cancel')
}

const onOk = async () => {
  const data = await formRef.value.validate()

  if (data) {
    emit('ok', formData.name)
  }
}

</script>

<style scoped>

</style>
