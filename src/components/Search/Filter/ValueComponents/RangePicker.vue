<script setup name="RangePicker">
import { watch, ref } from 'vue'
import { toDayjsRangeValue, toTimestampRangeValue } from './utils'

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  format: {
    type: String,
    default: 'YYYY-MM-DD HH:mm:ss',
  },
})

const emit = defineEmits(['update:value', 'change'])

const dropdownRangePickerRef = ref()
const myValue = ref([])

const getPopupContainer = () => dropdownRangePickerRef.value

const change = (dates) => {
  myValue.value = toDayjsRangeValue(dates)
  const timestamps = toTimestampRangeValue(dates)
  emit('update:value', timestamps)
  emit('change', timestamps)
}

watch(() => props.value, (val) => {
  myValue.value = toDayjsRangeValue(val)
}, { immediate: true })

</script>

<template>
  <div class="dropdown-range-picker" ref="dropdownRangePickerRef">
    <a-range-picker
      :value="myValue"
      :format="props.format"
      :open="true"
      :get-popup-container="getPopupContainer"
      showTime
      class="manual-range-picker"
      popupClassName="manual-range-picker-popup"
      @change="change"
      @ok="change"
    />
  </div>
</template>

<style scoped lang="less">
.dropdown-range-picker {
  .manual-range-picker {
    display: none;
  }

  .dropdown-range-picker > div {
    position: relative;
  }

  :deep(.ant-picker-dropdown) {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
  }
}
</style>
