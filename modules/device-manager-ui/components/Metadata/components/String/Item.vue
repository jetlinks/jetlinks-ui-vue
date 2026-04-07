<template>
  <a-form-item :label="$t('String.Item.921514-0')" :name="name">
    <a-input-number
      v-model:value="myValue"
      style="width: 100%"
      :placeholder="$t('String.Item.921514-1')"
      :precision="0"
      :min="0"
      :max="9999"
      @change="change"
    />
  </a-form-item>
</template>

<script setup name="MetadataStringItem">

const props = defineProps({
  value: {
    type: Number,
    default: 0
  },
  name: {
    type: String,
    default: 'maxLength'
  },
})

const myValue = ref(props.value)

const emit = defineEmits(['update:value']);

const change = () => {
  emit('update:value', myValue.value);
};

watch(
  () => props.value,
  (newValue) => {
    myValue.value = newValue
  },
  { immediate: true },
);

</script>

<style scoped>

</style>
