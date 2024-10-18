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
    <slot>
      <a-button type="link" :disabled="disabled" style="padding: 0">
        <template #icon>
          <AIcon type="EditOutlined" />
        </template>
      </a-button>
    </slot>
  </PopoverModal>
</template>

<script setup name="MetadataBoolean">
import { PopoverModal } from '../index'
import Item from './Item.vue'
import {Form} from "ant-design-vue";
import {BooleanValueMap} from "../utils";

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
  disabled: {
    type: Boolean,
    default:false
  }
});

const formItemContext = Form.useInjectFormItemContext();
const defaultValue = BooleanValueMap()

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
    formItemContext.onFieldChange()
  }
}

const initValue = () => {
  formData.value.trueText = props.trueText || defaultValue.trueText
  formData.value.trueValue = props.trueValue || defaultValue.trueValue
  formData.value.falseText = props.falseText || defaultValue.falseText
  formData.value.falseValue = props.falseValue || defaultValue.falseValue
}

const onCancel = () => {
  formRef.value?.resetFields();
  initValue()
  emit('cancel');
}

watch(() => [
  props.trueText,
  props.trueValue,
  props.falseText,
  props.falseValue,
], () => {
  initValue()
})

</script>

<style scoped>

</style>
