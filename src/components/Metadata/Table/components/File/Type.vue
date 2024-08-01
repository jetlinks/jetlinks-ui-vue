<template>
  <a-form-item
    label="文件类型"
    required
    :name="name"
    :rules="[{ required: true, message: '请选择文件类型' }]"
  >
    <j-check-button
      v-model:value="myValue"
      :options="[
                { label: 'URL', value: 'url' },
                { label: 'Base64', value: 'base64' },
                { label: 'binary', value: 'binary' },
            ]"
      @change="change"
    />

  </a-form-item>
</template>

<script setup name="MetadataFileType">
import { ref, watch } from 'vue';


const props = defineProps({
  name: {
    type: [String, Array],
    default: 'bodyType',
  },
  value: {
    type: String,
    default: undefined,
  },
});

const emit = defineEmits(['update:value']);

const myValue = ref(props.value);

const change = () => {
  emit('update:value', myValue.value);
};

watch(
  () => props.value,
  () => {
    myValue.value = props.value;
  }
);
</script>

<style scoped>

</style>
