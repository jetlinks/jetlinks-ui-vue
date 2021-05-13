<template>
  <div>
    <a-modal
      :title="title"
      :width="'70%'"
      :visible="showModal"
      @ok="SetModalOk"
      @cancel="SetModalCancel"
    >
      <div :style="{maxHeight: '750px', 'overflow-y': 'auto', 'overflow-x': 'hidden'}">
        <a-form :form="form" :wrapperCol="{span: 20}" :labelCol="{span: 4}">
          <a-row :gutter="16" :style="{marginLeft: '0.1%'}">
            <a-col :span="12">
              <a-form-item label="告警名称" key="name">
                <a-input
                  placeholder="输入告警名称"
                  v-decorator="['name',{
                    initialValue: deviceDetailData.name ? deviceDetailData.name: ''
                  }]"
                  @change="setWarnName"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-card :style="{marginBottom: '10px'}" :bordered="false" size="small">
            <p :style="{fontSize: 16}">触发条件
              <a-tooltip>
                <template slot="title">
                  触发条件满足条件中任意一个即可触发
                </template>
                <a-icon type="question-circle-o" :style="{paddingLeft: '10px'}"/>
              </a-tooltip>
              <a-switch
                key="shakeLimit.enabled"
                checkedChildren="开启防抖"
                unCheckedChildren="关闭防抖"
                :style="{marginLeft: '20px'}"
                @change="setShakeLimit"
                :checked="shakeLimit.enabled ? shakeLimit.enabled : false"
              />
              <template v-if="shakeLimit.enabled">
                <a-input
                  :style="{width: '80px', marginLeft: '3px'}"
                  size="small"
                  key="shakeLimit.time"
                  :defaultValue="shakeLimit.time ? shakeLimit.time :''"
                  @change="setShakeLimitTime"
                />秒内发生
                <a-input
                  :style="{width: '80px'}"
                  size="small"
                  key="shakeLimit.threshold"
                  :defaultValue="shakeLimit.threshold ? shakeLimit.threshold :''"
                  @change="setShakeLimitThreshold"
                />次及以上时，处理
                <a-radio-group
                  :default-value="true"
                  button-style="solid"
                  key="shakeLimit.alarmFirst"
                  size="small"
                  :defaultValue="shakeLimit.alarmFirst ? true : shakeLimit.alarmFirst"
                  @change="setShakeLimitAlarmFirst"
                >
                  <a-radio-button :value="true">
                    第一次
                  </a-radio-button>
                  <a-radio-button :value="false">
                    最后一次
                  </a-radio-button>
                </a-radio-group>
              </template>
            </p>
            <div v-for="(item, index) in triggers" :key="index">
              <alarm-triggers
                :key="'triggers' + index"
                :position="index"
                :triggerData="{...item}"
                @save="saveTriggers"
              />
            </div>
            <a-button
              icon="plus"
              type="link"
              @click="() => {
                triggers.push({})
              }"
            >
              新增触发器
            </a-button>
          </a-card>
          <a-card :style="{marginBottom: '10px'}" :bordered="false" size="small">
            <p :style="{fontSize: 16}">转换
              <a-tooltip>
                <template slot="title">
                  将内置的结果字段转换为自定义字段，例如：deviceId 转为 id
                </template>
                <a-icon type="question-circle-o" :style="{paddingLeft: '10px'}"/>
              </a-tooltip>
            </p>
            <div :style="{maxHeight: '200px', overflowY: 'auto', overflowX: 'hidden', backgroundColor: '#F5F5F6', paddingTop: '10px' }">
              <a-row v-for="(item,index) in properties" :key="'properties' + index" :gutter="16" :style="{paddingBottom: '10px', marginLeft: '13px', marginRight: '3px'}">
                <a-col :span="6">
                  <a-input placeholder="请输入属性" @change="(e) => setProperty(e,index)" :value="item.property"/>
                </a-col>
                <a-col :span="6">
                  <a-input placeholder="请输入别名" @change="(e) => setAlias(e,index)" :value="item.alias"/>
                </a-col>
                <a-col :span="12" :style="{textAlign: 'right', marginTop: '6px', paddingRight: '15px'}">
                  <a :style="{paddingTop: '7px'}" >删除</a>
                </a-col>
              </a-row>
              <a-col :span="24" :style="{marginLeft: '20px'}">
                <a @click="() => { properties.push({}) }">添加</a>
              </a-col>
            </div>
          </a-card>
          <a-card :style="{marginBottom: '10px'}" :bordered="false" size="small">
            <p :style="{fontSize: '16px'}">执行动作</p>
            <alarm-actions
              v-for="(item,index) in actions"
              :key="index"
              :position="index"
              :actionsData="item"
              @save="saveActions"
            />
            <a-button icon="plus" type="link" @click="() => { actions.push({}) }">
              执行动作
            </a-button>
          </a-card>
        </a-form>
      </div>
    </a-modal>
  </div>
</template>

<script>
  import ComModal from '@/components/Modal'
  import AlarmTriggers from './components/triggers'
  import AlarmActions from './components/actions'
  import { cloneDeep } from 'lodash'
  export default {
    name: 'DefineAlarm',
    props: {
      showModal: {
        type: Boolean,
        default: false
      },
      deviceDetailData: {
        type: Object,
        default: () => {}
      }
    },
    components: {
      ComModal,
      AlarmTriggers,
      AlarmActions
    },
    data () {
      return {
        title: '查看',
        form: this.$form.createForm(this, { name: 'DefineAlarmFrom' }),
        name: '',
        shakeLimit: {},
        triggers: [],
        properties: [],
        actions: [],
        pos: 1
      }
    },
    watch: {
      deviceDetailData: {
        handler (newVal, oldVal) {
          this.GetData(newVal)
        }
      }
    },
    methods: {
      GetData (initData) {
        if (Object.keys(initData).length > 0) {
          // this.triggers = [...initData.alarmRule.triggers]
          this.shakeLimit = cloneDeep(initData.alarmRule.shakeLimit)
          this.triggers = cloneDeep(initData.alarmRule.triggers)
          this.properties = cloneDeep(initData.alarmRule.properties)
          this.actions = cloneDeep(initData.alarmRule.actions)
        } else {
          this.clearData()
        }
      },
      clearData () {
        this.form.resetFields()
        this.name = ''
        this.triggers = []
        this.shakeLimit = {}
        this.properties = []
        this.actions = []
      },
      setWarnName (e) {
        this.name = e.target.value
      },
      setShakeLimit (value) {
        console.log('setShakeLimit', value)
        this.$set(this.shakeLimit, 'enabled', value)
      },
      setShakeLimitTime (e) {
        this.$set(this.shakeLimit, 'time', e.target.value)
      },
      setShakeLimitThreshold (e) {
        this.$set(this.shakeLimit, 'threshold', e.target.value)
      },
      setShakeLimitAlarmFirst (e) {
        this.$set(this.shakeLimit, 'alarmFirst', e.target.value)
      },
      setProperty (e, pos) {
        this.$set(this.properties[pos], 'property', e.target.value)
      },
      setAlias (e, pos) {
        this.$set(this.properties[pos], 'alias', e.target.value)
      },
      saveTriggers (pos, data) {
        console.log('data', data)
        this.$set(this.triggers, pos, data)
        // this.triggers = this.triggers.splice(pos, 1, data)
        // console.log('this.triggers', this.triggers)
      },
      saveActions (pos, data) {
        console.log('this.actions', data)
        this.$set(this.actions, pos, data)
      },
      SetModalOk () {
        const submitData = {
          name: this.name,
          triggers: this.triggers,
          properties: this.properties,
          actions: this.actions,
          shakeLimit: this.shakeLimit
        }
        console.log('******* submitData *********', submitData)
        this.$emit('SetModalOk', submitData)
      },
      SetModalCancel () {
        this.$emit('SetModalCancel')
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
