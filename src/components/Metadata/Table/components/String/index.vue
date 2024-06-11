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
          <Item v-model:value="formData.maxLength"/>
        </a-form>
      </div>
    </template>
    <slot>
      <a-button type="link" :disabled="disabled" style="padding: 0">
        <template #icon>
          <AIcon type="EditOutlined"/>
        </template>
      </a-button>
    </slot>
  </PopoverModal>
</template>

<script setup name="MetadataString">
import { PopoverModal } from '../index'
import Item from './Item.vue'

const emit = defineEmits(['update:value', 'confirm', 'cancel']);

const props = defineProps({
  value: {
    type: Number,
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

const formRef = ref()
const visible = ref(false)
const formData = reactive({
  maxLength: props.value,
})

const onOk = () => {
  visible.value = false
  emit('update:value', formData.maxLength);
  emit('confirm', formData.maxLength);
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
