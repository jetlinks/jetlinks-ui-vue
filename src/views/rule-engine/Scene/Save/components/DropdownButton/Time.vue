<template>
  <div class='dropdown-time-picker'>
    <j-time-picker
      v-if='type === "time"'
      open
      v-model:value='myValue'
      class='manual-time-picker'
      :format='myFormat'
      :getPopupContainer='getPopupContainer'
      popupClassName='manual-time-picker-popup'
      @change='change'
    />
    <j-date-picker
      v-else
      open
      class='manual-time-picker'
      v-model:value='myValue'
      :format='myFormat'
      :getPopupContainer='getPopupContainer'
      popupClassName='manual-time-picker-popup'
      @change='change'
    />
  </div>
</template>

<script setup lang='ts' name='DropdownTime'>
import dayjs, { Dayjs } from 'dayjs'

type Emit = {
  (e: 'update:value', value: string) : void
  (e: 'change', value: string) : void
}

const props = defineProps({
  type: {
    type: String,
    default: 'time' // time | date
  },
  value: {
    type: String,
    default: undefined
  },
  format: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits<Emit>()
const myFormat = props.format || ( props.type === 'time' ? 'HH:mm:ss' : 'YYYY-MM-DD HH:mm:ss')
const myValue = ref<Dayjs>(dayjs(props.value || new Date(), myFormat))

const getPopupContainer = (trigger: HTMLElement) => {
  return trigger?.parentNode || document.body
}

const change = (e: Dayjs) => {
  emit('update:value', e.format(myFormat))
  emit('change', e.format(myFormat))
}

</script>

<style lang='less'>
.dropdown-time-picker {
  >div{
    position: relative !important;
  }

  .manual-time-picker{
    display: none;
  }

  .ant-picker-dropdown {
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

  .ant-picker-panel-container {
    box-shadow: unset;
  }
}

.wrapper{
  display: none;
}
</style>