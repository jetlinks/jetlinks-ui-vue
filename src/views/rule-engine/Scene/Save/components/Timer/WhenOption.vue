<template>
  <div class='timer-when-warp'>
    <div :class='["when-item-option", allActive ? "active" : ""]' @click='() => change(0)'>每天</div>
    <div
      v-for='item in timeOptions'
      :class='["when-item-option", rowKeys.includes(item.value) ? "active" : ""]'
      @click='() => change(item.value)'
    >
      {{ item.label }}
    </div>
  </div>
</template>

<script setup lang='ts' name='WhenOption'>
import type { PropType } from 'vue'
import { numberToString } from './util'

type Emit = {
  (e: 'update:value', data: Array<number>):void
  (e: 'change', data: Array<number>):void
}

const props = defineProps({
  value: {
    type: Array as PropType<Array<number>>,
    default: []
  },
  type: {
    type: String,
    default: ''
  }
})

const emit = defineEmits<Emit>()

const timeOptions = ref<Array<{ label: string, value: number}>>([])
const rowKeys = ref<Array<number>>(props.value)

const change = (number: number) => {
  const _keys = new Set(rowKeys.value)
  if (number === 0) { // 全选
    _keys.clear()
  } else {
    if (_keys.has(number)) {
      _keys.delete(number)
    } else {
      _keys.add(number)
    }
  }
  rowKeys.value = [..._keys.values()]
  emit('update:value', rowKeys.value)
  emit('change', rowKeys.value)
}

const allActive = computed(() => {
  return !rowKeys.value.length
})

watch(() => props.type, () => {
  const isMonth = props.type === 'month'
  const day = isMonth ? 31 : 7
  change(0)
  timeOptions.value = new Array(day)
    .fill(1)
    .map((_, index) => {
      const _value = index + 1
      return {
        label: isMonth ? `${_value}号` : numberToString[_value],
        value: _value
      }
    })
}, { immediate: true })

</script>

<style scoped lang='less'>
.timer-when-warp {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
  padding: 16px;
  background: #fafafa;

  .when-item-option {
    width: 76px;
    padding: 6px 0;
    text-align: center;
    background: #fff;
    border: 1px solid #e6e6e6;
    border-radius: 2px;
    cursor: pointer;
  }

  .active {
    color: #233dd7;
    border-color: #233dd7;
  }

}
</style>