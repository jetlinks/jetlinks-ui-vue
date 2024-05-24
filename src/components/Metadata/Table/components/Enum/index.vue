<template>
  <PopoverModal
    v-model:visible="visible"
    :placement="placement"
    @ok="onOk"
    @cancel="onCancel"
  >
    <template #content>
      <div style="width: 450px">
        <a-form ref="formRef" layout="vertical" :model="formData">
          <Item ref="tableRef" :value="formData.elements"/>
        </a-form>
      </div>
    </template>
    <slot><AIcon type="EditTwoTone"/></slot>
  </PopoverModal>
</template>

<script setup name="MetadataEnum">
import { PopoverModal } from '../index'
import { cloneDeep } from 'lodash-es'
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

const formRef = ref();
const tableRef = ref();
const visible = ref(false)
const formData = reactive({
  type: props.value?.type || false,
  elements: cloneDeep(props.value?.elements) || [],
});

const onCancel = () => {
  formRef.value?.resetFields();
  formData.elements = cloneDeep(props.value?.elements) || [];
  emit('cancel');
};

const onOk = async () => {
  const data = await formRef.value.validate()
  const tableData = await tableRef.value.validate()
  if (data && tableData) {
    visible.value = false
    emit('update:value', formData)
    emit('confirm', formData);
  }
}

watch(
  () => JSON.stringify(props.value),
  () => {
    formData.type = props.value?.type;
    formData.elements = cloneDeep(props.value?.elements) || [];
  }
);

</script>

<style scoped>

</style>
