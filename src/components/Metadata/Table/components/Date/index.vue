<template>
  <PopoverModal
    v-model:visible="visible"
    :placement="placement"
    @ok="onOk"
    @cancel="onCancel"
  >
    <template #content>
      <div style="width: 200px">
        <a-form ref="formRef" layout="vertical" :model="formData">
          <Item v-model:value="formData.format" />
        </a-form>
      </div>
    </template>
    <slot><AIcon type="EditTwoTone"/></slot>
  </PopoverModal>
</template>

<script setup name="MetadataDate">
import { PopoverModal } from '../index'
import Item from './Item.vue'

const emit = defineEmits(['update:value', 'confirm', 'cancel']);

const props = defineProps({
  value: {
    type: String,
    default: undefined,
  },
  placement: {
    type: String,
    default: 'top',
  },
});

const formRef = ref()
const visible = ref(false)
const formData = reactive({
  format: props.value,
})
const onOk = async () => {
  const data = await formRef.value.validate()

  if (data) {
    visible.value = false
    emit('update:value', formData.format);
    emit('confirm', formData.format);
  }
}

const onCancel = () => {
  formRef.value?.resetFields();
  formData.maxLength = props.value;
  emit('cancel');
}

watch(() => props.value, (newValue) => {
  formData.maxLength = newValue
})

</script>

<style scoped>

</style>
