<template>
  <div class="calendar-form-item-content">
    <div class="header">
      <a-button type="link" @click="onView" style="padding-right: 2px">{{ $t('Timer.Calendar.5425721-0') }}</a-button>
    </div>
    <div class="calendar-items">
      <j-scrollbar :maxHeight="350">
        <div class="calendar-item" v-for="(item, index) in myValue.spec">
          <div class="calendar-item-delete">
            <AIcon type="DeleteOutlined" style="" @click="() => deleteItem(index)"/>
          </div>
          <div class="calendar-item-tags">
            <div class="calendar-item-name">
              {{ $t('Timer.Calendar.5425721-1') }}{{ index + 1 }}
            </div>
            <div style="flex: 1 1 0;min-width: 0">
              <j-select
                :placeholder="$t('Timer.Calendar.5425721-2')"
                v-model:value="item.scheduleTags"
                style="width: calc(100% - 30px)"
                mode="multiple"
                :options="options"
                :fieldNames="{
                    label: 'name',
                    value: 'id'
                  }"
                :filterOption="filterOption"
                @change='updateValue'
              />
            </div>
          </div>
          <div class="calendar-item-content">
            <div class="calendar-item-top">
              <div>
                <j-radio-group
                  :value='item.mod'
                  :options="[
                    { label: $t('Timer.Calendar.5425721-3'), value: 'period' },
                    { label: $t('Timer.Calendar.5425721-4'), value:'once'},
                  ]"
                  option-type='button'
                  button-style='solid'
                  @change='(e) => modChange(e, index)'
                />
              </div>
            </div>
            <div class="calendar-item-bottom">
              <template v-if="item.mod === 'once'">
                <j-time-picker
                  valueFormat='HH:mm:ss'
                  v-model:value='item.once.time'
                  style='width: 180px'
                  format='HH:mm:ss'
                  @change='updateValue'
                />
                <div>{{ $t('Timer.Calendar.5425721-4') }}</div>
              </template>
              <template v-if="item.mod === 'period'">
                <j-time-range-picker
                  valueFormat='HH:mm:ss'
                  :value='[
                    item.period.from,
                    item.period.to,
                  ]'
                  @change='(v) => {
                          item.period.from = v[0]
                          item.period.to = v[1]
                          updateValue()
                    }'
                />
                <span>{{ $t('Timer.Calendar.5425721-5') }}</span>
                <j-input-number
                  :placeholder="$t('Timer.Calendar.5425721-6')"
                  style='max-width: 170px'
                  :precision='0'
                  :min='1'
                  :max="item.period.unit === 'hours' ? 99999 : 99 "
                  v-model:value='item.period.every'
                  @change='updateValue'
                >
                  <template #addonAfter>
                    <j-select
                      v-model:value='item.period.unit'
                      :options="[
                        { label: $t('Timer.Calendar.5425721-7'), value: 'seconds' },
                        { label: $t('Timer.Calendar.5425721-8'), value: 'minutes' },
                        { label: $t('Timer.Calendar.5425721-9'), value: 'hours' },
                      ]"
                      @select='e => periodUnitChange(e, index)'
                    />
                  </template>
                </j-input-number>
              </template>
            </div>

          </div>
        </div>
      </j-scrollbar>
    </div>
    <a-button @click="addItem" style="width: 100%;">
      {{ $t('Timer.Calendar.5425721-10') }}
    </a-button>
    <j-modal
      v-model:visible="visible"
      :width="1000"
      :okText="$t('Timer.Calendar.5425721-11')"
    >
      <div>
        {{ $t('Timer.Calendar.5425721-12') }}
      </div>
      <FullCalendar  :preview="true"/>
      <template #footer>
        <a-button type="primary" @click="visible = false">
          {{ $t('Timer.Calendar.5425721-11') }}
        </a-button>
      </template>
    </j-modal>
  </div>
</template>

<script setup name="Calendar">
import dayjs from "dayjs";
import { useRequest } from '@/hook'
import {queryTags} from "@/api/system/calendar";
import FullCalendar from '@/views/system/Calendar/FullCalendar/index.vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:value', 'change'])
const { data:options } = useRequest(queryTags)
const visible = ref(false)

const myValue = reactive({
  type: 'or',
  spec: []
})

const updateValue = () => {
  emit('update:value', myValue)
  emit('change', myValue)
}

const onView = () => {
  visible.value = true
}

const filterOption = (value, option) => {
  return option.name?.includes(value)
}

const addItem = () => {
  myValue.spec.push({
    trigger: "calender",
    scheduleTags: [],
    mod: "period",
    // once: {
    //   time: dayjs(new Date()).format('HH:mm:ss')
    // },
    period: {
      from: dayjs(new Date()).startOf('day').format('HH:mm:ss'),
      to: dayjs(new Date()).endOf('day').format('HH:mm:ss'),
      every: 1,
      unit: 'seconds'
    }
  })
  updateValue()
}

const deleteItem = (index) => {
  myValue.spec.splice(index, 1)
  updateValue()
}

const modChange = (e, index) => {
  let mod = e.target.value

  if (mod === 'once') {
    myValue.spec[index].once = {
      time: dayjs(new Date()).format('HH:mm:ss')
    }
    delete myValue.spec[index].period
  } else {
    myValue.spec[index].period = {
      from: dayjs(new Date()).startOf('day').format('HH:mm:ss'),
      to: dayjs(new Date()).endOf('day').format('HH:mm:ss'),
      every: 1,
      unit: 'seconds'
    }
    delete myValue.spec[index].once
  }
  myValue.spec[index].mod = mod
  updateValue()
}

const periodUnitChange = (e, index) => {
  myValue.spec[index].period.every = 1
  updateValue()
}

watch(() => props.value, () => {
  myValue.spec = props.value?.spec || []
}, { immediate: true, deep: true})

</script>

<style scoped lang="less">
.calendar-form-item-content {
  position: relative;
  .header {
    position: absolute;
    right: 0;
    top: -55px;
  }
  .calendar-items {
    max-height: 350px;

    .calendar-item {
      position: relative;
      margin-bottom: 12px;
      border: 1px solid #cfcfcf;
      border-radius: 4px;
      padding: 12px;
      display: flex;
      gap: 16px;
      flex-direction: column;

      .calendar-item-tags {
        display: flex;
        gap: 12px;
        align-items: center;
        //height: max-content;
      }

      .calendar-item-delete {
        position: absolute;
        right: 12px;
        color: #e50012;
      }

      .calendar-item-content {
        display: flex;
        gap: 24px;
      }

      .calendar-item-top {
        display: flex;
        gap: 12px;
        align-items: center;
        //margin-bottom: 12px;
      }
      .calendar-item-bottom {
        display: flex;
        gap: 12px;
        align-items: center;
      }
    }
  }
}
</style>
