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
    <slot>
      <a-button type="link" :disabled="disabled" style="padding: 0">
        <template #icon>
          <AIcon type="EditOutlined" :class="{'table-form-required-aicon': !value}"/>
        </template>
      </a-button>
    </slot>
  </PopoverModal>
</template>

<script setup name="MetadataDate">
import { PopoverModal } from '../index'
import Item from './Item.vue'
import { Form } from 'ant-design-vue'

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
  disabled: {
    type: Boolean,
    default:false
  }
});

const formItemContext = Form.useInjectFormItemContext();
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
    formItemContext.onFieldChange()
  }
}

const onCancel = () => {
  formRef.value?.resetFields();
  formData.format = props.value;
  emit('cancel');
}

watch(() => props.value, (newValue) => {
  formData.format = newValue
})

</script>

<style scoped>

</style>
