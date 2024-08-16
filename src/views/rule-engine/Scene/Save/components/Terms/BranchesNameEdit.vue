<template>
  <j-modal
    visible
    :title="$t('Terms.BranchesNameEdit.5425830-0')"
    :keyboard="false"
    :maskClosable="false"
    @cancel="onCancel"
    @ok="onOk"
  >
    <j-form ref='formRef' layout='vertical' :model="formData">
      <j-form-item :label="$t('Terms.BranchesNameEdit.5425830-1')" required name="name" :rules="[{ max: 64, message: $t('Terms.BranchesNameEdit.5425830-2')}]">
        <j-input v-model:value="formData.name"></j-input>
      </j-form-item>
    </j-form>
  </j-modal>
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
