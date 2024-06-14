<template>
  <a-form-item :name="name" :rules="rules" :validate-first="true">
    <template #label>
      <span style="color: #ff4d4f; padding-right: 4px; padding-top: 2px">*</span>
      枚举项
    </template>
    <Content ref="tableRef" v-model:value="dataSource" @change="change" />
  </a-form-item>
</template>

<script setup name="MetadataEnumItem">
import Content from './ItemContent.vue'

const emit = defineEmits(['update:value'])
const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  type: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    default: 'elements',
  },
});


const dataSource = ref(props.value || [])
const tableRef = ref()

const rules = [
  {
    validator: async (_, value) =>{
      console.log(value, dataSource.value)
      if (!dataSource.value?.length) {
        return Promise.reject('请添加枚举项');
      }
      // console.log(tableRef, tableRef.value)
      // const data = await tableRef.value?.validate?.()
      // if (!data) {
      //   return Promise.reject('');
      // }
      return Promise.resolve();
    },
  },
];

const change = () => {
  emit('update:value', dataSource.value)
}

const validate = async () => {
  const res = await tableRef.value?.validate()
  return res
}

defineExpose({
  validate
})

watch(
  () => JSON.stringify(props.value),
  (val) => {
    dataSource.value = val ? JSON.parse(val) : [];
  },
);
</script>

<style scoped>

</style>
