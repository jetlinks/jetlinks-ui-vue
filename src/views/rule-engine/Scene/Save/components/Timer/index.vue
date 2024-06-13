<template>
  <j-form
    ref='timerForm'
    :model='formModel'
    :colon='false'
    layout='vertical'
  >
    <j-form-item name='trigger'>
      <j-radio-group
        v-model:value='formModel.trigger'
        :options='triggerOptions'
        option-type='button'
        button-style='solid'
        @change='triggerChange'
      />
    </j-form-item>
    <j-form-item v-if='showCron' name='cron' :rules="cronRules">
      <j-input placeholder='corn表达式' v-model:value='formModel.cron' @change='updateValue' />
    </j-form-item>
    <j-form-item v-else-if="showMulti" :rules="multiRules">
      <Calendar v-model:value="formModel.multi" @change='updateValue'/>
    </j-form-item>
    <template v-else>
      <j-form-item name='when'>
        <WhenOption v-model:value='formModel.when' :type='formModel.trigger' @change='updateValue' />
      </j-form-item>
      <j-form-item name='mod'>
        <j-radio-group
          v-model:value='formModel.mod'
          :options='[
          { label: "周期执行", value: "period" },
          { label: "执行一次", value: "once" },
        ]'
          option-type='button'
          button-style='solid'
          @change='updateValue'
        />
      </j-form-item>
    </template>
    <j-space v-if='showOnce && !showMulti' style='display: flex;gap: 24px'>
      <j-form-item :name="['once', 'time']">
        <j-time-picker
          valueFormat='HH:mm:ss'
          v-model:value='formModel.once.time'
          style='width: 100%'
          format='HH:mm:ss'
          @change='updateValue'
        />
      </j-form-item>
      <j-form-item> 执行一次</j-form-item>
    </j-space>
    <j-space v-if='showPeriod && !showMulti' style='display: flex;gap: 24px'>
      <j-form-item>
        <j-time-range-picker
          valueFormat='HH:mm:ss'
          :value='[
            formModel.period.from,
            formModel.period.to,
           ]'
          @change='(v) => {
                  formModel.period.from = v[0]
                  formModel.period.to = v[1]
                  updateValue()
              }'
        />
      </j-form-item>
      <j-form-item>每</j-form-item>
      <j-form-item
        :name='["period", "every"]'
        :rules='[{ required: true, message: "请输入时间" }]'
      >
        <j-input-number
          placeholder='请输入时间'
          style='max-width: 170px'
          :precision='0'
          :min='1'
          :max='unitMax'
          v-model:value='formModel.period.every'
          @change='updateValue'
        >
          <template #addonAfter>
            <j-select
              v-model:value='formModel.period.unit'
              :options='[
                { label: "秒", value: "seconds" },
                { label: "分", value: "minutes" },
                { label: "小时", value: "hours" },
              ]'
              @select='periodUnitChange'
            />
          </template>
        </j-input-number>
      </j-form-item>
      <j-form-item>执行一次</j-form-item>
    </j-space>
  </j-form>
</template>

<script setup lang='ts' name='Timer'>
import type { PropType } from 'vue'
import dayjs from 'dayjs'
import WhenOption from './WhenOption.vue'
import {cloneDeep, pick} from 'lodash-es'
import type { OperationTimer } from '../../../typings'
import { isCron } from '@/utils/regular'
import { defineExpose } from 'vue'
import Calendar from './Calendar.vue'

type NameType = string[] | string

type Emit = {
  (e: 'update:value', data: Partial<OperationTimer>): void
}

const props = defineProps({
  name: {
    type: [String, Array] as PropType<NameType>,
    default: ''
  },
  value: {
    type: Object,
    default: () => ({})
  },
  type: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits<Emit>()
const unitMax = ref<number>(99)

const cronRules = [
  { max: 64, message: '最多可输入64个字符' },
  {
    validator: async (_: any, v: string) => {
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
]

const multiRules = [
  {
    validator: async (_: any, v: string) => {
      console.log(v)
      return Promise.resolve();
    }
  }
]

const triggerOptions = computed(() => {
  let _options = [
    { label: "按周", value: "week" },
    { label: "按月", value: "month" },
    { label: "cron表达式", value: "cron" },
  ]

  if (props.type === 'timer') {
    _options = [..._options, {
      label: "自定义日历", value: "multi"
    }]
  }
  return _options
})

const formModel = reactive<OperationTimer>({
  trigger: 'week',
  when: props.value.when || [],
  mod: 'period',
  cron: undefined,
  once: {
    time: dayjs(new Date()).format('HH:mm:ss')
  },
  period: {
    from: dayjs(new Date()).startOf('day').format('HH:mm:ss'),
    to: dayjs(new Date()).endOf('day').format('HH:mm:ss'),
    every: 1,
    unit: 'seconds'
  },
  multi: {
    type: "and",
    spec: []
  }
})
const timerForm = ref()

const showCron = computed(() => {
  return formModel.trigger === 'cron'
})
const showMulti = computed(() => {
  return formModel.trigger === 'multi'
})

const showOnce = computed(() => {
  return formModel.trigger !== 'cron' && formModel.mod === 'once'
})

const showPeriod = computed(() => {
  return formModel.trigger !== 'cron' && formModel.mod === 'period'
})

const updateValue = () => {

  const cloneValue = cloneDeep(formModel)
  let keys: string[] = ['trigger']
  if (cloneValue.trigger === 'cron') {
    keys.push('cron')
  } else if (cloneValue.trigger === 'multi') {
    keys.push('multi')
  } else {
    keys = keys.concat(['mod', 'when'])

    if (cloneValue.mod === 'period') {
      keys.push('period')
    } else {
      keys.push('once')
    }
  }
  console.log( pick(cloneValue, keys), keys)
  emit('update:value', pick(cloneValue, keys))
}

const triggerChange = () => {
  formModel.when = []
  formModel.cron = undefined
  updateValue()
}

/**
 * 频率单位切换
 * @param v
 */
const periodUnitChange = (v: any) => {
  if(v === 'hours') {
    unitMax.value = 99999
  } else {
    unitMax.value = 99
  }
  formModel.period!.every = 1
  updateValue()
}

defineExpose({
  validateFields: () => new Promise(async (resolve)  => {
    const data = await timerForm.value?.validateFields()
    resolve(data)
  })
})

Object.assign(formModel, props.value)
formModel.when = props.value.when || []

watchEffect(() => {
  if(props.value?.period?.unit === 'hours') {
    unitMax.
      value = 99999
  } else {
    unitMax.value = 99
  }
})


</script>

<style scoped lang='less'>

</style>
