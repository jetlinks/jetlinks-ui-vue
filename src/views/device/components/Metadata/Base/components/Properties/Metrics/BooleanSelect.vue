<template>
  <j-select
      v-model:value="myValue"
      :options="[
          { label: $t('Metrics.BooleanSelect.6916338-0'), value: 'false' },
          { label: $t('Metrics.BooleanSelect.6916338-1'), value: 'true' },
      ]"
      :dropdownStyle="{
        zIndex: 1071
      }"
      :getPopupContainer="(node) => tableWrapperRef || node"
      @select="select"
  />
</template>

<script name="BooleanSelect" setup>
import {useTableWrapper} from "@/components/Metadata/Table/context";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const props = defineProps({
  value: {
    type: String,
    default: 'false'
  }
})

const emit = defineEmits(['update:value', 'select'])

const tableWrapperRef = useTableWrapper()
const myValue = ref()
const select = (e) => {
  emit('update:value', e === 'true')
  emit('select', e === 'true')
}

watch(() => JSON.stringify(props.value), () => {
  myValue.value = props.value ? 'true' : 'false'
}, { immediate: true })

</script>

<style scoped>

</style>
