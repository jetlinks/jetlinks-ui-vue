<template>
  <PopoverModal
    v-model:visible="visible"
    :placement="placement"
    @ok="onOk"
    @cancel="onCancel"
  >
    <template #content>
      <div style="width: 450px" v-if="visible">
        <a-form ref="formRef" layout="vertical" :model="formData">
          <Item ref="tableRef" :value="formData.elements"/>
        </a-form>
      </div>
    </template>
    <slot>
      <a-button type="link" :disabled="disabled" style="padding: 0">
        <template #icon>
          <AIcon type="EditOutlined" :class="{'table-form-required-aicon': !formData.elements.length}"/>
        </template>
      </a-button>
    </slot>
  </PopoverModal>
</template>

<script setup name="MetadataEnum">
import { PopoverModal } from '../index'
import { cloneDeep } from 'lodash-es'
import Item from './Item.vue'
import {Form} from "ant-design-vue";

const emit = defineEmits(['update:value', 'confirm', 'cancel']);

const props = defineProps({
  value: {
    type: Array,
    default: () => ([]),
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
const tableRef = ref();
const visible = ref(false)
const formData = reactive({
  elements: cloneDeep(props.value) || [],
});

const onCancel = () => {
  formRef.value?.resetFields();
  formData.elements = cloneDeep(props.value) || [];
  emit('cancel');
};

const onOk = async () => {
  const data = await formRef.value.validate()
  const tableData = await tableRef.value.validate()
  console.log(data, tableData)
  if (data && tableData) {
    visible.value = false
    formData.elements = tableData
    emit('update:value', formData.elements)
    emit('confirm', formData.elements);
    formItemContext.onFieldChange()
  }
}

watch(
  () => JSON.stringify(props.value),
  () => {
    formData.elements = cloneDeep(props.value) || [];
  }
);

</script>

<style scoped>

</style>
