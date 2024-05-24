<template>
  <PopoverModal
    v-model:visible="visible"
    :placement="placement"
    @ok="onOk"
    @cancel="onCancel"
  >
    <template #content>
      <div style="width: 250px">
        <a-form ref="formRef" :model="formData" layout="vertical">
          <Type v-model:value="formData.bodyType" name="bodyType" />
        </a-form>
      </div>
    </template>
    <slot><AIcon type="EditTwoTone"/></slot>
  </PopoverModal>
</template>

<script setup name="MetadataFile">
import Type from './Type.vue'
import { PopoverModal } from '../index'

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

const formRef = ref();
const formData = reactive({
  bodyType: props.value,
});

const visible = ref(false)

const onOk = async () => {
  const data = await formRef.value.validate()
  if (data) {
    visible.value = false
    emit('update:value', formData.bodyType)
    emit('onOk', formData.bodyType)
  }
}

const onCancel = () => {
  formRef.value?.resetFields();
  formData.bodyType = props.value;
  emit('cancel');
}

watch(
  () => props.value,
  () => {
    formData.bodyType = props.value;
  },
);
</script>

<style scoped>

</style>
