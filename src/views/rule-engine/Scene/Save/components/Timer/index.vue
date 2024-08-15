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
      <j-input :placeholder="$t('Timer.index.5425719-0')" v-model:value='formModel.cron' @change='updateValue' />
    </j-form-item>
    <j-form-item v-else-if="showMulti" name="multi" :rules="multiRules">
      <Calendar v-model:value="formModel.multi" @change='updateValue'/>
    </j-form-item>
    <template v-else>
      <j-form-item name='when'>
        <WhenOption v-model:value='formModel.when' :type='formModel.trigger' @change='updateValue' />
      </j-form-item>
      <j-form-item name='mod'>
        <j-radio-group
          v-model:value='formModel.mod'
          :options="[
          { label: $t('Timer.index.5425719-1'), value: 'period' },
          { label: $t('Timer.index.5425719-2'), value: 'once' },
        ]"
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
      <j-form-item> {{ $t('Timer.index.5425719-2') }}</j-form-item>
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
      <j-form-item>{{ $t('Timer.index.5425719-3') }}</j-form-item>
      <j-form-item
        :name='["period", "every"]'
        :rules="[{ required: true, message: $t('Timer.index.5425719-4') }]"
      >
        <j-input-number
          :placeholder="$t('Timer.index.5425719-4')"
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
              :options="[
                { label: $t('Timer.index.5425719-5'), value: 'seconds' },
                { label: $t('Timer.index.5425719-6'), value: 'minutes' },
                { label: $t('Timer.index.5425719-7'), value: 'hours' },
              ]"
              @select='periodUnitChange'
            />
          </template>
        </j-input-number>
      </j-form-item>
      <j-form-item>{{ $t('Timer.index.5425719-2') }}</j-form-item>
    </j-space>
  </j-form>
</template>

<script setup lang='ts' name='Timer'>
import type { PropType } from 'vue'
import dayjs from 'dayjs'
import WhenOption from './WhenOption.vue'
import {cloneDeep, pick} from 'lodash-es'
import type { OperationTimer } from '../../../typings'
import { defineExpose } from 'vue'
import Calendar from './Calendar.vue'
import cronstrue from 'cronstrue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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
  { max: 64, message: $t('Timer.index.5425719-8') },
  {
    validator: async (_: any, v: string) => {

      if (v) {
        try {
          console.log(v, cronstrue.toString(v))
        } catch (e) {
          return Promise.reject(new Error($t('Timer.index.5425719-9')));
        }
      } else {
        return Promise.reject(new Error($t('Timer.index.5425719-10')));
      }
      return Promise.resolve();
    }
  }
]

const multiRules = [
  {
    validator: async (_: any, v: string) => {
      if (!v.spec?.length) {
        return Promise.reject($t('Timer.index.5425719-11'));
      } else {
        const index = v.spec.findIndex(item => !item.scheduleTags.length)
        if (index > -1) {
          return Promise.reject($t('Timer.index.5425719-12', [index + 1]));
        }
      }

      return Promise.resolve()
    }
  }
]

const triggerOptions = computed(() => {
  let _options = [
    { label: $t('Timer.index.5425719-13'), value: "week" },
    { label: $t('Timer.index.5425719-14'), value: "month" },
    { label: $t('Timer.index.5425719-15'), value: "cron" },
    { label: $t('Timer.index.5425719-16'), value: "multi" }
  ]

  // if (props.type === 'timer') {
  //   _options = [..._options, {
  //     label: $t('Timer.index.5425719-16'), value: "multi"
  //   }]
  // }
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
