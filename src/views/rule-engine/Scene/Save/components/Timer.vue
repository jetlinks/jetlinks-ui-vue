<template>
  <a-form
    ref='timerForm'
    :model='formModel'
    layout='vertical'
    :colon='false'
  >
    <a-form-item name='trigger'>
      <a-radio-group
        v-model:value='formModel.trigger'
        :options='[
          { label: "按周", value: "week" },
          { label: "按月", value: "month" },
          { label: "cron表达式", value: "cron" },
        ]'
        option-type='button'
        button-style='solid'
      />
    </a-form-item>
    <a-form-item v-if='showCron' name='cron'>
      <a-input placeholder='corn表达式' v-model='formModel.cron' />
    </a-form-item>
    <template v-else>
      <a-form-item name='when'>

      </a-form-item>
      <a-form-item name='mod'>
        <a-radio-group
          v-model:value='formModel.mod'
          :options='[
          { label: "周期执行", value: "period" },
          { label: "执行一次", value: "once" },
        ]'
          option-type='button'
          button-style='solid'
        />
      </a-form-item>
    </template>
    <a-space v-if='showOnce' style='display: flex;gap: 24px'>
      <a-form-item :name="['once', 'time']">
        <a-time-picker valueFormat='HH:mm:ss' v-model:value='formModel.once.time' style='width: 100%' format='HH:mm:ss' />
      </a-form-item>
      <a-form-item> 执行一次 </a-form-item>
    </a-space>
    <a-space v-if='showPeriod' style='display: flex;gap: 24px'>
      <a-form-item>
        <a-time-range-picker
          valueFormat='HH:mm:ss'
          :value='[
            formModel.period.from,
            formModel.period.to,
           ]'
          @change='(v) => {
                  formModel.period.from = v[0]
                  formModel.period.to = v[1]
              }'
        />
      </a-form-item>
      <a-form-item>每</a-form-item>
      <a-form-item
        :name='["period", "every"]'
        :rules='[{ required: true, message: "请输入时间" }]'
      >
        <a-input-number
          placeholder='请输入时间'
          style='max-width: 170px'
          :precision='0'
          :min='1'
          :max='59'
          v-model:value='formModel.period.every'
        >
          <template #addonAfter>
            <a-select
              v-model:value='formModel.period.unit'
              :options='[
                { label: "秒", value: "seconds" },
                { label: "分", value: "minutes" },
                { label: "小时", value: "hours" },
              ]'
            />
          </template>
        </a-input-number>
      </a-form-item>
      <a-form-item>执行一次</a-form-item>
    </a-space>
  </a-form>
</template>

<script setup lang='ts' name='Timer'>
import type { PropType } from 'vue'
import moment from 'moment'

type NameType = string[] | string

const props = defineProps({
  name: {
    type: [String, Array] as PropType<NameType>,
    default: ''
  },
  value: {
    type: Object,
    default: () => ({})
  }
})

const formModel = reactive({
  trigger: 'week',
  when: [],
  mod: 'period',
  cron: undefined,
  once: {
    time: ''
  },
  period: {
    from: moment(new Date()).startOf('day').format('HH:mm:ss'),
    to: moment(new Date()).endOf('day').format('HH:mm:ss'),
    every: 1,
    unit: 'seconds'
  }
})

const showCron = computed(() => {
  return formModel.trigger === 'cron'
})

const showOnce = computed(() => {
  return formModel.trigger !== 'cron' && formModel.mod === 'once'
})

const showPeriod = computed(() => {
  return formModel.trigger !== 'cron' && formModel.mod === 'period'
})

</script>

<style scoped lang='less'>

</style>