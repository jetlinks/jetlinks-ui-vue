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
          <a-form-item label="单位" name="unit" :rules="[{ max: 64, message: '最多可输入64个字符' }]">
            <UnitSelect v-model:value="formData.unit" :options="options"/>
          </a-form-item>
          <ScaleItem v-model:value="formData.scale" />
        </a-form>
      </div>
    </template>
    <slot><AIcon type="EditTwoTone"/></slot>
  </PopoverModal>
</template>

<script setup name="MetadataDouble">
import { UnitSelect, PopoverModal } from '../index'
import ScaleItem from './ScaleItem.vue'

const emit = defineEmits(['update:value', 'cancel', 'confirm']);

const props = defineProps({
  options: {
    type: [Array, Function],
    default: () => []
  },
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
  unit: props.value?.unit,
  scale: props.value?.scale || 0, // 精度
});

const onOk = async () => {
  const data = await formRef.value.validate()
  if (data) {
    visible.value = false
    emit('update:value', {
      ...props.value,
      ...formData
    });
    emit('confirm', {
      ...props.value,
      ...formData
    });
  }
}

const onCancel = () => {
  formRef.value?.resetFields();
  formData.unit = props.value?.unit;
  formData.scale = props.value?.scale || 0;
  emit('cancel');
}

watch(() => props.value, (newValue) => {
  formData.unit = props.value?.unit;
  formData.scale = props.value?.scale || 0;
})
</script>

<style scoped>

</style>
