<template>
  <j-modal
    visible
    title="编辑"
    :keyboard="false"
    :maskClosable="false"
    @cancel="onCancel"
    @ok="onOk"
  >
    <j-form ref='formRef' layout='vertical' :model="formData">
      <j-form-item label="条件名称" required name="name" :rules="[{ max: 64, message: '最多输入64个字符'}]">
        <j-input v-model:value="formData.name"></j-input>
      </j-form-item>
    </j-form>
  </j-modal>
</template>

<script setup name="BranchesNameEdit">
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
