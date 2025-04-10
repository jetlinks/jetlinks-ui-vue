<template>
  <div>
    <a-radio-group
      v-if="quickBtn"
      default-value="today"
      button-style="solid"
      v-model:value="radioValue"
      @change="(e) => handleBtnChange(e.target.value)"
    >
      <a-radio-button
        v-for="item in quickBtnList"
        :key="item.value"
        :value="item.value"
      >
        {{ item.label }}
      </a-radio-button>
    </a-radio-group>
    <a-range-picker
      format="YYYY-MM-DD HH:mm:ss"
      valueFormat="YYYY-MM-DD HH:mm:ss"
      style="margin-left: 12px"
      :show-time="{ format: 'HH:mm:ss' }"
      @change="rangeChange"
      v-model:value="rangeVal"
      :allowClear="false"
    ></a-range-picker>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import { PropType } from 'vue'

defineOptions({
  name: 'JDashboardTimeSelect'
})

interface BtnOptions {
  label: string
  value: string
}

interface EmitProps {
  (e: 'change', data: Record<string, any>): void
}

const emit = defineEmits<EmitProps>()

const props = defineProps({
  // 显示快捷按钮
  quickBtn: {
    type: Boolean,
    default: true
  },
  // 快捷按钮列表
  quickBtnList: {
    type: Array as PropType<BtnOptions[]>,
    default: [
      { label: '今日', value: 'today' },
      { label: '近一周', value: 'week' },
      { label: '近一月', value: 'month' },
      { label: '近一年', value: 'year' }
    ]
  },
  type: {
    type: String,
    default: 'today'
  }
})

const radioValue = ref(props.type || 'week' || undefined)
const rangeVal = ref<[string, string]>()

const rangeChange = (val: any) => {
  radioValue.value = undefined
  emit('change', {
    start: dayjs(val[0]).valueOf(),
    end: dayjs(val[1]).valueOf(),
    type: undefined
  })
}

const getTimeByType = (type: string) => {
  switch (type) {
    case 'hour':
      return dayjs().subtract(1, 'hours').valueOf()
    case 'week':
      return dayjs().subtract(6, 'days').startOf('day').valueOf()
    case 'month':
      return dayjs().subtract(29, 'days').valueOf()
    case 'year':
      return dayjs().subtract(365, 'days').valueOf()
    case 'day':
      return dayjs().subtract(24, 'hours').valueOf()
    default:
      return dayjs().startOf('day').valueOf()
  }
}

const handleBtnChange = (val: string) => {
  radioValue.value = val
  let endTime = dayjs(new Date()).valueOf()
  let startTime = getTimeByType(val)
  if (val === 'today') {
    startTime = dayjs().subtract(0, 'days').startOf('day').valueOf()
    endTime = dayjs().subtract(0, 'days').endOf('day').valueOf()
  }
  rangeVal.value = [dayjs(startTime).format('YYYY-MM-DD HH:mm:ss'), dayjs(endTime).format('YYYY-MM-DD HH:mm:ss')]
  emit('change', {
    start: startTime,
    end: endTime,
    type: val
  })
}
handleBtnChange(radioValue.value)
// watch(() => radioValue.value, { deep: true, immediate: true });
watch(
  () => props.type,
  (val) => {
    handleBtnChange(val)
  }
)
</script>
