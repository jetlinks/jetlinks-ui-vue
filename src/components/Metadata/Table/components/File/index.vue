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
    <slot>
      <a-button type="link" :disabled="disabled" style="padding: 0">
        <template #icon>
          <AIcon type="EditOutlined" :class="{'table-form-required-aicon': !value}"/>
        </template>
      </a-button>
    </slot>
  </PopoverModal>
</template>

<script setup name="MetadataFile">
import Type from './Type.vue'
import { PopoverModal } from '../index'
import {Form} from "ant-design-vue";

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
    formItemContext.onFieldChange()
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
