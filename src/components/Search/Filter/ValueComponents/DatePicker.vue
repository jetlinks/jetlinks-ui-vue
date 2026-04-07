<script setup name="TimePicker">

import { watch } from 'vue'
import { toDayjsValue, toTimestampValue } from './utils'

const props = defineProps({
  value: {
    type: [String, Number],
    default: undefined,
  },
  format: {
    type: String,
    default: 'HH:mm:ss',
  },
});

const emit = defineEmits(['update:value', 'change'])

const dropdownTimePickerRef = ref()
const myValue = ref(toDayjsValue(props.value))

const getPopupContainer = () => {
  return dropdownTimePickerRef.value
}

const change = (e) => {
  myValue.value = toDayjsValue(e)
  const timestamp = toTimestampValue(e)
  emit('update:value', timestamp)
  emit('change', timestamp)
}

watch(() => props.value, (val) => {
  myValue.value = toDayjsValue(val)
}, { immediate: true })

</script>

<template>
<div class="dropdown-time-picker" ref="dropdownTimePickerRef">
  <a-date-picker
    :value="myValue"
    :format="props.format"
    :open="true"
    :get-popup-container="getPopupContainer"
    showTime
    class='manual-time-picker'
    popupClassName='manual-time-picker-popup'
    @change='change'
    @ok='change'
  />
</div>
</template>

<style scoped lang="less">
.dropdown-time-picker {
  > div{
    position: relative !important;
  }

  .manual-time-picker {
    display: none;
  }

  :deep(.ant-picker-dropdown) {
    position: relative;
    top: 0;
    left: 0;
    width: 100%;
    .ant-picker-panel {
      width: 100%
    }
    .ant-picker-footer {
      border-bottom: 0px;
    }
  }

  :deep(.ant-picker-panel-container) {
    box-shadow: unset;
  }
}
</style>
