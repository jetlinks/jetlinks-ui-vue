<template>
  <div class="terms-when-item">
    <div v-if="showType"  class="dropdown-button type">
      {{ TermTypeMap[value[3]] || value[3] }}
    </div>
    <div class="dropdown-button column">
      <AIcon type='icon-zhihangdongzuoxie-1' />
      {{ value[0] }}
    </div>
    <div v-if="showAlarm" class="dropdown-button alarm">
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const TermsTypeMap = {
  eq: $t('Terms.WhenItem.4265417-0'),
  neq: $t('Terms.WhenItem.4265417-1'),
  gt: $t('Terms.WhenItem.4265417-2'),
  gte: $t('Terms.WhenItem.4265417-3'),
  lt: $t('Terms.WhenItem.4265417-4'),
  lte: $t('Terms.WhenItem.4265417-5'),
  btw: $t('Terms.WhenItem.4265417-6'),
  nbtw: $t('Terms.WhenItem.4265417-7'),
  time_gt_now: $t('Terms.WhenItem.4265417-8'),
  time_lt_now: $t('Terms.WhenItem.4265417-9'),
  in: $t('Terms.WhenItem.4265417-10'),
  nin: $t('Terms.WhenItem.4265417-11'),
  like: $t('Terms.WhenItem.4265417-12'),
  nlike: $t('Terms.WhenItem.4265417-13'),
  notnull: $t('Terms.WhenItem.4265417-14'),
  isnull: $t('Terms.WhenItem.4265417-15')
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
    color: #13C2C2;
    background: rgba(135, 232, 222, 0.3);
    border: 1px solid rgba(54, 207, 201, 0.4);
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

  &.alarm {
    color: #2F54EB;
    background: rgba(163, 202, 255, 0.3);
    border: 1px solid rgba(47, 84, 235, 0.3);
  }
}

</style>
