<template>
  <div :style="{paddingBottom: '5px'}">
    <a-card :bordered="false" :style="{backgroundColor: '#F5F5F6'}">
      <a-row :style="{marginLeft: '-2px'}">
        <span>执行动作: {{ position + 1 }}</span>
        <a-popconfirm
          title="确认删除此执行动作？"
          cancel-text="取消"
          ok-text="确定"
        >
          <a :style="{paddingLeft: '30px'}">删除</a>
        </a-popconfirm>
      </a-row>

      <a-row :gutter="16" key="1" :style="{paddingLeft: 10}">
        <a-col :span="4">
          <a-select
            placeholder="选择动作类型"
            key="actions"
            @select="setActionsType"
            :value="actionType?actionType:''"
          >
            <a-select-option value="notifier">消息通知</a-select-option>
            <a-select-option value="device-message-sender">设备输出</a-select-option>
          </a-select>
        </a-col>
        <template v-if="actionType === 'notifier'">
          <a-col :span="4">
            <a-select
              placeholder="选择通知类型"
              key="actions"
              :defaultValue="defaultNotifierType"
              @dropdownVisibleChange="getNotifierType"
            >
              <template slot="notFoundContent">
                <a-spin tip="加载内容中"></a-spin>
              </template>
              <a-select-option
                v-for="(item) in notifierType"
                :key="item.id"
                :data="item"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </a-col>
          <a-col :span="4">
            <a-select placeholder="选择通知配置" key="actions">
            </a-select>
          </a-col>
          <a-col :span="4">
            <a-select placeholder="选择通知模板" key="actions">
            </a-select>
          </a-col>
        </template>
        <template v-if="actionType === 'device-message-sender'">
          <a-col :span="4">
            <a-input
              placeholder="点击选择设备"
              :disabled="true"
              :value="configuration.deviceId"
            >
              <a-icon
                slot="addonAfter"
                type="gold"
                title="点击选择设备"
                @click="chooseDevice"
              />
            </a-input>
          </a-col>
          <template v-if="configuration.deviceId">
            <a-col :span="4">
              <a-select
                placeholder="选择类型，如：属性/功能"
                key="useFunc"
                :value="configuration.message.messageType ? configuration.message.messageType :undefined "
                @select="selectMessage"
              >
                <a-select-option value="WRITE_PROPERTY">{{ '设置属性' }}</a-select-option>
                <a-select-option value="INVOKE_FUNCTION">{{ '调用功能' }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :span="4" v-if="messageType === 'WRITE_PROPERTY'">
              <a-select
                key="attribute"
                placeholder="物模型属性"
              >
              </a-select>
            </a-col>
            <a-col :span="4" v-if="messageType === 'INVOKE_FUNCTION'">
              <a-select
                key="func"
                placeholder="物模型功能"
              >
              </a-select>
            </a-col>
          </template>
        </template>
      </a-row>
    </a-card>
    <network-bind
      :visible="showModal"
      @subData="setDeviceId"
      @cancel="cancel"
    >
    </network-bind>
  </div>
</template>

<script>
  // import apis from '@/api'
  import { cloneDeep } from 'lodash'
  import NetworkBind from '@/views/gateway/bind'
  import { mapGetters } from 'vuex'
  const NotifierTypeMap = new Map()
  NotifierTypeMap.set('sms', '短信')
  NotifierTypeMap.set('dingTalk', '钉钉')
  NotifierTypeMap.set('voice', '语音')
  NotifierTypeMap.set('weixin', '微信')
  NotifierTypeMap.set('email', '邮件')

  export default {
    name: 'AlarmActions',
    props: {
      position: {
        // eslint-disable-next-line vue/require-prop-type-constructor
        type: String | Number,
        default: 0
      },
      actionsData: {
        type: Object,
        default: () => {}
      }
    },
    components: {
      NetworkBind
    },
    data () {
      return {
        actionType: '',
        defaultNotifierType: undefined,
        configuration: {},
        // notifierType: [],
        messageType: '',
        showModal: false,
        actions: {}
      }
    },
    mounted () {
      this.InitData(this.InitData)
    },
    watch: {
      actionsData: {
        handler (newVal, oldVal) {
          this.InitData(newVal)
        },
        immediate: true,
        deep: true
      }
    },
    computed: {
      ...mapGetters('device', ['notifierType'])
    },
    methods: {
      InitData (data) {
        if (Object.keys(data).length > 0) {
          this.actionType = cloneDeep(data.executor)
          if (data.configuration) {
            this.configuration = cloneDeep(data.configuration)
            if (data.configuration.message) {
              this.messageType = cloneDeep(data.configuration.message.messageType)
            }
            if (data.configuration.notifyType) {
              this.defaultNotifierType = NotifierTypeMap.get(data.configuration.notifyType)
            }
          }
        }
      },
      subData () {
        const data = {
          configuration: this.configuration,
          executor: this.actionType
        }
        // console.log('this.triggerData', this.triggerData)
        console.log('data', data)
        this.$emit('save', this.position, data)
      },
      getNotifierType () {
        console.log('@@@@@@@@@@@@@')
        if (!this.notifierType.length) {
          this.$store.dispatch('device/getNotifierType')
        }
      },
      setActionsType (value) {
        if (value === 'notifier') {
          this.getNotifierType()
          // apis.deviceInstance.getDeviceNotifierType()
          //   .then(res => {
          //     if (res.status === 200) {
          //       this.notifierType = res.result
          //     }
          //   })
        }
        this.actionType = value
        this.subData()
      },
      chooseDevice () {
        this.showModal = true
      },
      setDeviceId (id) {
        this.$set(this.configuration, 'deviceId', id)
        if (!this.configuration.message) {
          this.configuration.message = {}
        }
        this.showModal = false
        this.subData()
      },
      selectMessage (value) {
        this.$set(this.configuration, 'message', {
          messageType: value
        })
        this.messageType = value
        this.subData()
        this.showModal = false
      },
      cancel () {
        this.showModal = false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
