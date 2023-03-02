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
    <a-form-item v-if='showCron' name='cron' :rules="[
      { max: 64, message: '最多可输入64个字符' },
      {
        validator: async (_, v) => {
           if (v) {
             if (!isCron(v)) {
               return Promise.reject(new Error('请输入正确的cron表达式'));
             }
           } else {
             return Promise.reject(new Error('请输入cron表达式'));
           }
           return Promise.resolve();
        }
      }
    ]">
      <a-input placeholder='corn表达式' v-model:value='formModel.cron' />
    </a-form-item>
    <template v-else>
      <a-form-item name='when'>
        <WhenOption v-model:value='formModel.when' :type='formModel.trigger' />
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
        <a-time-picker valueFormat='HH:mm:ss' v-model:value='formModel.once.time' style='width: 100%'
                       format='HH:mm:ss' />
      </a-form-item>
      <a-form-item> 执行一次</a-form-item>
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
import WhenOption from './WhenOption.vue'
import { cloneDeep } from 'lodash-es'
import type { OperationTimer } from '../../../typings'
import { isCron } from '@/utils/regular'
import { defineExpose } from 'vue'

type NameType = string[] | string

type Emit = {
  (e: 'update:value', data: OperationTimer): void
}

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

const emit = defineEmits<Emit>()

const formModel = reactive<OperationTimer>({
  trigger: 'week',
  when: [],
  mod: 'period',
  cron: undefined,
  once: {
    time: moment(new Date()).format('HH:mm:ss')
  },
  period: {
    from: moment(new Date()).startOf('day').format('HH:mm:ss'),
    to: moment(new Date()).endOf('day').format('HH:mm:ss'),
    every: 1,
    unit: 'seconds'
  }
})
const timerForm = ref()

Object.assign(formModel, props.value)

const showCron = computed(() => {
  return formModel.trigger === 'cron'
})

const showOnce = computed(() => {
  return formModel.trigger !== 'cron' && formModel.mod === 'once'
})

const showPeriod = computed(() => {
  return formModel.trigger !== 'cron' && formModel.mod === 'period'
})

watch(() => formModel, () => {
  const cloneValue = cloneDeep(formModel)
  if (cloneValue.trigger === 'cron') {
    delete cloneValue.when
  } else {
    delete cloneValue.cron
  }

  if (cloneValue.mod === 'period') {
    delete cloneValue.once
  } else {
    delete cloneValue.period
  }
  emit('update:value', cloneValue)
}, { deep: true })

defineExpose({
  validateFields: () => new Promise(async (resolve)  => {
    const data = await timerForm.value?.validateFields()
    resolve(data)
  })
})

</script>

<style scoped lang='less'>

</style>