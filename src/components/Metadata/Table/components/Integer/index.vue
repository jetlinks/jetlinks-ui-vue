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
          <a-form-item :label="$t('Integer.index.4348678-0')" name="unit" :rules="[{ max: 64, message: $t('Integer.index.4348678-1') }]">
            <UnitSelect v-model:value="formData.unit" />
          </a-form-item>
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

<script setup name="MetadataInteger">
import { UnitSelect, PopoverModal } from '../index'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const emit = defineEmits(['update:value', 'cancel', 'confirm']);

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

const formRef = ref()
const visible = ref(false)
const formData = reactive({
  unit: props.value,
});

const onOk = async () => {
  const data = await formRef.value.validate()
  if (data) {
    visible.value = false
    emit('update:value', formData.unit);
    emit('confirm', formData.unit);
  }
}

const onCancel = () => {
  formRef.value?.resetFields();
  formData.unit = props.value;
  emit('cancel');
}

watch(() => props.value, (newValue) => {
  formData.unit = newValue
})
</script>

<style scoped>

</style>
