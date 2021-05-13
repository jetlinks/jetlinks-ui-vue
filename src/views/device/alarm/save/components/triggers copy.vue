<template>
  <div :style="{paddingBottom: '5px'}">
    <a-card :bordered="false" :style="{backgroundColor: '#F5F5F6'}">
      <a-row :style="{marginLeft: '-2px'}">
        <span>触发器: {{ position + 1 }}</span>
        <a-popconfirm
          title="确认删除此触发器"
          cancel-text="取消"
          ok-text="确定"
        >
          <a :style="{paddingLeft: '30px'}">删除</a>
        </a-popconfirm>
      </a-row>

      <a-row :gutter="16" :style="{paddingLeft: '10px'}">
        <a-col :span="6" :style="{paddingBottom: '10px'}">
          <a-select
            placeholder="选择触发器类型"
            @select="setTriggerType"
            :value="trigger? trigger: ''"
          >
            <a-select-option :value="'device'">设备触发</a-select-option>
            <a-select-option :value="'timer'">定时触发</a-select-option>
          </a-select>
        </a-col>
        <a-col v-if="trigger==='timer'" :span="6" :style="{paddingBottom: '10px'}">
          <a-input placeholder="cron表达式" @change="setCron"/>
        </a-col>
        <!-- 新增告警---触发器条件选择栏 -->
        <div v-if="trigger==='device'">
          <a-col :span="24">
            <a-col :span="6" :style="{paddingBottom: '10px', paddingLeft: '-1px', paddingRight: '12px'}">
              <a-select
                placeholder="选择类型，如：属性/事件"
                @change="setCondition"
                :value="triggerType ? triggerType : ''"
              >
                <a-select-option value="online">上线</a-select-option>
                <a-select-option value="offline">离线</a-select-option>
                <a-select-option value="properties">属性</a-select-option>
                <a-select-option value="event">事件</a-select-option>
              </a-select>
            </a-col>
            <a-col v-if="triggerType==='properties'" :span="6" >
              <a-select
                placeholder="物模型属性"
              >
                <!-- <a-select-option value="online">上线</a-select-option> -->
              </a-select>
            </a-col>
            <a-col v-if="triggerType==='event'" :span="6" >
              <a-select
                placeholder="物模型时间"
              >
              </a-select>
            </a-col>
          </a-col>
          <a-col :span="24">
            <div v-for="(item,index) in filters" :key="'filters' + index" class="ant-row">
              <a-col :span="6" :style="{paddingLeft: '-1px', paddingRight: '12px', paddingBottom: '10px'}">
                <!-- <a-auto-complete :data-source="dataSource" placeholder="过滤条件KEY" /> -->
                <a-input
                  placeholder="过滤条件KEY"
                  @change="(e) => setFilterKey(e,index)"
                  :value="item.key"
                />
              </a-col>
              <a-col :span="6" :style="{paddingLeft: '3px', paddingRight: '9px', paddingBottom: '10px'}">
                <a-select
                  placeholder="操作符"
                  @change="(value) => setFilterOperator(value,index)"
                  :default-value="item.operator ? item.operator : ''"
                  :value="item.operator"
                >
                  <a-select-option value="eq">等于(=)</a-select-option>
                  <a-select-option value="not">不等于(!=)</a-select-option>
                  <a-select-option value="gt">大于(&gt;)</a-select-option>
                  <a-select-option value="lt">小于(&lt;)</a-select-option>
                  <a-select-option value="gte">大于等于(&gt;=)</a-select-option>
                  <a-select-option value="lte">小于等于(&lt;=)</a-select-option>
                  <a-select-option value="like">模糊(%)</a-select-option>
                </a-select>
              </a-col>
              <a-col :span="7" :style="{paddingLeft: '7px', paddingRight: '3px', paddingBottom: '10px'}">
                <a-input
                  placeholder="过滤条件值"
                  @change="(e) => setFilterValue(e,index)"
                  :value="item.value ? item.value : ''"
                />
              </a-col>
              <a-col :span="5" :style="{textAlign: 'right', marginTop: '6px', paddingBottom: '10px'}">
                <a :style="{paddingLeft: '10px', paddingTop: '7px'}">删除</a>
              </a-col>
            </div>
          </a-col>
          <a-col :span="24">
            <div>
              <a @click="() => { filters.push({}) }">添加</a>
            </div>
          </a-col>
        </div>
      </a-row>
    </a-card>
  </div>
</template>

<script>
  import { cloneDeep } from 'lodash'
  export default {
    name: 'AlarmTriggers',
    props: {
      position: {
        // eslint-disable-next-line vue/require-prop-type-constructor
        type: String | Number,
        default: 0
      },
      triggerData: {
        type: Object,
        default: () => {}
      },
      dataSource: {
        type: Array,
        default: () => ['Burns Bay Road', 'Downing Street', 'Wall Street']
      }

    },
    computed: {
      getfilters () {
        return function () {
          const cc = [...this.triggerData.filters]
          console.log('@@@@@@@@@', cc)
          return cc
        }
      }
    },
    data () {
      return {
        triggers: {},
        cron: '',
        trigger: '',
        triggerType: '',
        filters: [],
        testnum: 1
      }
    },
    mounted () {
      this.initData(this.triggerData)
    },
    watch: {
      triggerData: {
        handler (newVal, oldVal) {
          console.log('triggerData', newVal)
          this.initData(newVal)
        }
      },
      filters: {
        handler (newVal, oldVal) {
          console.log('filters', newVal)
        },
        deep: true,
        immediate: true
      }
    },
    methods: {
      clear () {
        console.log(111111111111)
        this.triggers = {}
        this.cron = ''
        this.trigger = ''
        this.triggerType = ''
        this.filters = []
      },
      initData (newTriggers) {
        if (Object.keys(newTriggers).length > 0) {
          this.trigger = newTriggers.trigger
          this.triggerType = newTriggers.type
          this.filters = cloneDeep(newTriggers.filters)
        }
      },
      subData () {
        const data = {
          ...this.triggers,
          filters: this.filters
        }
        // console.log('this.triggerData', this.triggerData)
        console.log('data', data)
        this.$emit('save', this.position, data)
      },
      setTriggerType (value) {
        this.trigger = value
        this.$set(this.triggers, 'trigger', value)
        // this.subData()
      },
      setCron (e) {
        this.cron = e.target.value
        this.subData()
      },
      setCondition (value) {
        this.triggerType = value
        this.$set(this.triggers, 'type', value)
        this.subData()
      },
      setFilterKey (e, index) {
        // console.log(this.filters[index])
        this.filters[index] = {}
        this.$set(this.filters[index], 'key', e.target.value)
        // console.log('cccc', this.filters)
        this.subData()
      },
      setFilterOperator (value, index) {
        // this.filters[index] = {}
        this.$set(this.filters[index], 'operator', value)
        this.subData()
      },
      setFilterValue (e, index) {
        this.filters[index] = {}
        this.$set(this.filters[index], 'value', e.target.value)
        this.subData()
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
