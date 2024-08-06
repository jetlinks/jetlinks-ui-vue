<template>
  <j-modal
    visible
    width="650px"
    :title="$t('Save.GeoJsonModal.101933-0')"
    :maskClosable="false"
    @ok="handleSave"
    @cancel="handleCancel"
  >
    <div>
      {{ $t('Save.GeoJsonModal.101933-1') }}
    </div>
    <j-monaco-editor
      language="json"
      style="height: 400px"
      v-model:modelValue="myValue"
    />
  </j-modal>
</template>

<script setup name="GeoJsonModal">
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const props = defineProps({
  value: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['ok', 'cancel'])

const myValue = ref(props.value ? JSON.stringify(props.value) : undefined)

const handleSave = () => {
  emit('ok', myValue.value ? JSON.parse(myValue.value) : undefined)
}

const handleCancel = () => {
  emit('cancel')
}

</script>

<style scoped>

</style>
