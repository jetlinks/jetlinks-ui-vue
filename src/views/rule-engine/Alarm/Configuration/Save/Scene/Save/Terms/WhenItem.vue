<template>
  <div class="terms-when-item">
    <div v-if="showType"  class="dropdown-button type">
      {{ TermTypeMap[value[3]] || value[3] }}
    </div>
    <div class="dropdown-button column">
      <AIcon type='icon-zhihangdongzuoxie-1' />
      {{ value[0] }}
    </div>
    <div v-if="showAlarm" class="dropdown-button">
      {{ value[4] }}
    </div>
    <div class="dropdown-button termType">
      {{ TermsTypeMap[value[1]] || value[1] }}
    </div>
    <div v-if="_value" class="dropdown-button value">
      <AIcon type='icon-canshu' />
      {{ _value[0] }}
    </div>
    <div v-if="value[2][1]" class="dropdown-button value">
      <AIcon type='icon-canshu' />
      {{ _value[1] }}
    </div>

  </div>
</template>

<script setup name="WhenItem">
import { TermTypeMap } from '../utils'

const TermsTypeMap = {
  eq: '等于',
  neq: '不等于',
  gt: '大于',
  gte: '大于等于',
  lt: '小于',
  lte: '小于等于',
  btw: '在...之间',
  nbtw: '不在...之间',
  time_gt_now: '距离当前时间大于',
  time_lt_now: '距离当前时间小于',
  in: '在...之中',
  nin: '不在...之中',
  like: '包含',
  nlike: '不包含',
  notnull: '不为空',
  isnull: '为空'
};

const props = defineProps({
  value: {
    type: Array,
    default: () => []
  },
  showType: {
    type: Boolean,
    default: false
  },
  data: {
    type: Array,
    default: () => []
  }
})

const showAlarm = computed(() => {
  return props.data.terms?.length
})

const _value = computed(() => {
  if (['in', 'nin','contains_all', 'contains_any', 'not_contains', 'nbtw', 'btw',].includes(props.data.termType)) {
    return props.data.value.value
  }

  return props.value[2]
})

</script>

<style scoped lang="less">
.terms-when-item {
  display: flex;
  gap: 6px;
}

.dropdown-button {
  display: flex;
  align-items: center;
  padding: 6px 8px;
  border: 1px solid #d9d9d9;
  border-radius: 8px;
  cursor: pointer;

  &.column {
    color: #00a4fe;
    background-color: rgba(154, 219, 255, 0.3);
    border-color: rgba(0, 164, 254, 0.3);
  }

  &.termType {
    color: #2f54eb;
    background-color: rgba(163, 202, 255, 0.3);
    border-color: rgba(47, 84, 235, 0.3);
  }

  &.value {
    color: #692ca7;
    background-color: rgba(188, 125, 238, 0.1);
    border-color: rgba(188, 125, 238, 0.5);
  }

  &.type {
    padding: 5px 10px;
    margin-left: 8px;
  }
}

</style>
