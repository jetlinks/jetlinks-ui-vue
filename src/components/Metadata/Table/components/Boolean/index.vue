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

const emit = defineEmits([
  'update:trueText',
  'update:trueValue',
  'update:falseText',
  'update:falseValue',
  'confirm',
  'cancel'
]);

const props = defineProps({
  trueText: {
    type: String,
    default: undefined
  },
  trueValue: {
    type: String,
    default: undefined
  },
  falseText: {
    type: String,
    default: undefined
  },
  falseValue: {
    type: String,
    default: undefined
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
    trueText: props.trueText || '是',
    trueValue: props.trueValue || 'true',
    falseText: props.falseText || '否',
    falseValue: props.falseValue || 'false',
  }
})

const onOk = async () => {
  const data = await formRef.value.validate()
  if (data) {
    visible.value = false
    emit('update:trueText', formData.value.trueText);
    emit('update:trueValue', formData.value.trueValue);
    emit('update:falseText', formData.value.falseText);
    emit('update:falseValue', formData.value.falseValue);
    emit('confirm', formData.value);
  }
}

const onCancel = () => {
  formRef.value?.resetFields();
  formData.value.trueText = props.trueText || '是'
  formData.value.trueValue = props.trueValue || 'true'
  formData.value.falseText = props.falseText || '否'
  formData.value.falseValue = props.falseValue || 'false'
  emit('cancel');
}

watch(() => [
  props.trueText,
  props.trueValue,
  props.falseText,
  props.falseValue,
], () => {
  formData.value.trueText = props.trueText || '是'
  formData.value.trueValue = props.trueValue || 'true'
  formData.value.falseText = props.falseText || '否'
  formData.value.falseValue = props.falseValue || 'false'
})

</script>

<style scoped>

</style>
