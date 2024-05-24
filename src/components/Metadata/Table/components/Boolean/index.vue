<template>
  <PopoverModal
    v-model:visible="visible"
    :placement="placement"
    @ok="onOk"
    @cancel="onCancel"
  >
    <template #content>
      <div style="width: 250px">
        <a-form ref="formRef" layout="vertical" :model="formData">
          <Item v-model:value="formData.value" />
        </a-form>
      </div>
    </template>
    <slot><AIcon type="EditTwoTone"/></slot>
  </PopoverModal>
</template>

<script setup name="MetadataBoolean">
import { PopoverModal } from '../index'
import Item from './Item.vue'

const emit = defineEmits(['update:value', 'confirm', 'cancel']);

const props = defineProps({
  value: {
    type: Object,
    default: () => ({}),
  },
  placement: {
    type: String,
    default: 'top',
  },
});

const formRef = ref()
const visible = ref(false)
const formData = reactive({
  value: {
    trueText: props.value?.trueText || '是',
    trueValue: props.value?.trueValue || 'true',
    falseText: props.value?.falseText || '否',
    falseValue: props.value?.falseValue || 'false',
  }
})

const onOk = async () => {
  console.log('on-ok')
  const data = await formRef.value.validate()
  console.log(data)
  if (data) {
    visible.value = false
    emit('update:value', formData.value);
    emit('confirm', formData.value);
  }
}

const onCancel = () => {
  formRef.value?.resetFields();
  formData.value.trueText = props.value?.trueText || '是'
  formData.value.trueValue = props.value?.trueValue || 'true'
  formData.value.falseText = props.value?.falseText || '否'
  formData.value.falseValue = props.value?.falseValue || 'false'
  emit('cancel');
}

watch(() => props.value, (newValue) => {
  formData.value.trueText = newValue?.trueText || '是'
  formData.value.trueValue = newValue?.trueValue || 'true'
  formData.value.falseText = newValue?.falseText || '否'
  formData.value.falseValue = newValue?.falseValue || 'false'
})

</script>

<style scoped>

</style>
