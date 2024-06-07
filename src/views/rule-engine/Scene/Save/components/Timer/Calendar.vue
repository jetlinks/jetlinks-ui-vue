<template>
  <div class="calendar-form-item-content">
    <div class="header">
      <a-button type="link" @click="onView" style="padding-right: 2px">预览日历</a-button>
    </div>
    <div class="calendar-items">
      <j-scrollbar :maxHeight="350">
        <div class="calendar-item" v-for="(item, index) in myValue.spec">
          <div class="calendar-item-tags">
            <div class="calendar-item-name">
              规则：{{ index + 1 }}
            </div>
            <div>
              <j-select
                placeholder="请选择日期类型"
                v-model:value="item.scheduleTags"
                :options="options"
              />
            </div>
          </div>
          <div class="calendar-item-content">
            <div class="calendar-item-top">
              <div>
                <j-radio-group
                  v-model:value='item.mod'
                  :options='[
                    { label: "周期执行", value: "period" },
                    { label: "执行一次", value: "once" },
                  ]'
                  option-type='button'
                  button-style='solid'
                  @change='(e) => modChange(e, index)'
                />
              </div>
              <div class="calendar-item-delete">
                <AIcon type="DeleteOutlined" style="" @click="() => deleteItem(index)"/>
              </div>
            </div>
            <div class="calendar-item-bottom">
              <template v-if="item.mod !== 'period'">
                <j-time-picker
                  valueFormat='HH:mm:ss'
                  v-model:value='item.once.time'
                  style='width: 180px'
                  format='HH:mm:ss'
                  @change='updateValue'
                />
                <div>执行一次</div>
              </template>
              <template v-else>
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
                <span>每</span>
                <j-input-number
                  placeholder='请输入时间'
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
                      :options='[
                        { label: "秒", value: "seconds" },
                        { label: "分", value: "minutes" },
                        { label: "小时", value: "hours" },
                      ]'
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
      新增规则
    </a-button>
  </div>
</template>

<script setup name="Calendar">
import dayjs from "dayjs";

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})
const emit = defineEmits(['update:value'])

const myValue = reactive({
  type: 'and',
  spec: []
})

const options = ref([])

const updateValue = () => {
  emit('update:value', myValue)
}

const onView = () => {

}

const addItem = () => {
  myValue.spec.push({
    trigger: "calender",
    scheduleTags: [],
    mod: "period",
    once: {
      time: dayjs(new Date()).format('HH:mm:ss')
    },
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
    top: 0;
    transform: translateY(-120%);
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

      .calendar-item-tags {
        display: flex;
        gap: 12px;
        align-items: center;
        height: max-content;
      }

      .calendar-item-delete {
        position: absolute;
        right: 12px;
        color: #e50012;
      }

      .calendar-item-top {
        display: flex;
        gap: 12px;
        align-items: center;
        margin-bottom: 12px;
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
