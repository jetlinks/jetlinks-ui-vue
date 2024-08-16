<template>
  <div :class="{'select-no-value': !value}">
    <a-select
      v-bind="props"
      allow-clear
      :value="myValue"
      style="width: 100%"
      :placeholder="$t('Type.index.4348668-0')"
      :dropdownStyle="{
        zIndex: 1071
      }"
      :options="options"
      :getPopupContainer="(node) => tableWrapperRef || node"
      @change="change"
    />
  </div>
</template>

<script setup name="MetadataType">
import { selectProps } from 'ant-design-vue/lib/select';
import defaultOptions from './data';
import {useTableWrapper} from "@/components/Metadata/Table/context";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
  ...selectProps(),
  filter: {
    type: Array ,
    default: () => [],
  }
});

const emit = defineEmits(['update:value']);

const myValue = ref(props.value)

const options = computed(() => {
  return defaultOptions.filter(item => !props.filter.includes(item.value) )
})

const tableWrapperRef = useTableWrapper()
const change = (key) => {
  myValue.value = key
  emit('update:value', key)
}

watch(
  () => props.value,
  (newValue) => {
    myValue.value = newValue;
  },
);

</script>

<style scoped>

</style>
