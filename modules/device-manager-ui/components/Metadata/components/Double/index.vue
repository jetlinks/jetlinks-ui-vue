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
          <a-form-item :label="$t('Double.index.192428-0')" name="unit" :rules="[{ max: 64, message: $t('Double.index.192428-1') }]">
            <UnitSelect v-model:value="formData.unit"/>
          </a-form-item>
          <ScaleItem v-model:value="formData.scale" />
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

<script setup name="MetadataDouble">
import { UnitSelect, PopoverModal } from '../index'
import ScaleItem from './ScaleItem.vue'
import {Form} from "ant-design-vue";
import {useI18n} from "vue-i18n";

const emit = defineEmits(['update:value', 'cancel', 'confirm']);

const props = defineProps({
  value: {
    type: Object,
    default: () => ({}),
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
const { t: $t } = useI18n();
const formItemContext = Form.useInjectFormItemContext();

const formRef = ref()
const visible = ref(false)
const formData = reactive({
  unit: props.value?.unit,
  scale: props.value?.scale || 2 // 精度
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
    formItemContext.onFieldChange()
  }
}

const onCancel = () => {
  formRef.value?.resetFields();
  formData.unit = props.value?.unit;
  formData.scale = props.value?.scale || 2;
  emit('cancel');
}

watch(() => props.value, () => {
  formData.unit = props.value?.unit;
  formData.scale = props.value?.scale || 2;
}, {
  immediate: true,
  deep: true
})
</script>

<style scoped>

</style>
