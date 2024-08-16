<template>
  <a-form-item
    :label="$t('File.Type.4348680-0')"
    required
    :name="name"
    :rules="[{ required: true, message: $t('File.Type.4348680-1') }]"
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()


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
