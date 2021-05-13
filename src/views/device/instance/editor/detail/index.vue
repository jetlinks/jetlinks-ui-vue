<template>
  <div>
    <a-card :style="{marginBottom: '20px'}">
      <a-descriptions style="{marginBottom: 20}" bordered :column="3" size="small">
        <template slot="title">
          <span>设备信息
            <a-button icon="edit" :style="{marginLeft: '20px'}" type="link">编辑</a-button>
          </span>
        </template>
        <a-descriptions-item label="产品名称" span="1">
          {{ data.productName }}
        </a-descriptions-item>
        <a-descriptions-item label="设备类型" span="1">
          {{ data.deviceType ? data.deviceType.text : '' }}
        </a-descriptions-item>
        <a-descriptions-item label="所属机构" span="1">
          {{ data.orgName }}
        </a-descriptions-item>
        <a-descriptions-item label="连接协议" span="1">
          {{ data.transport }}
        </a-descriptions-item>
        <a-descriptions-item label="消息协议" span="1">
          {{ data.protocolName || data.protocol }}
        </a-descriptions-item>
        <a-descriptions-item label="IP地址" span="1">
          {{ data.orgName }}
        </a-descriptions-item>
        <a-descriptions-item label="创建时间" span="1">
          {{ GetCreateTime }}
        </a-descriptions-item>
        <a-descriptions-item label="注册时间" span="1">
          {{ GetRegisterTime }}
        </a-descriptions-item>
        <a-descriptions-item label="最后上线时间" span="1">
          {{ GetLastOnlineTime }}
        </a-descriptions-item>
        <a-descriptions-item label="说明" span="2">
          {{ data.describe || data.description }}
        </a-descriptions-item>
        <!-- 循环的tags -->
        <!-- <a-descriptions-item label="云对云接入" :span="3">
          <a-tag color="blue" >
            <a-tooltip :title="23414">
              <span>{{ 1234 }}</span>
            </a-tooltip>
            <a-popconfirm title="`是否解绑234接入`">
              <span :style="{display: 'inline-block', marginLeft: '10px'}">{{ 33 }}</span>
            </a-popconfirm>
          </a-tag>
        </a-descriptions-item> -->
      </a-descriptions>
      <div :style="{width: '100%'}">
        <a-descriptions>
          <template slot="title" v-if="DeviceConfigList.length">
            <span>配置
              <a-button icon="edit" :style="{marginLeft: '20px'}" type="link">编辑</a-button>
              <a-popconfirm title="确认重新应用该配置？">
                <a-button icon="check" type="link">应用配置</a-button>
                <a-tooltip title="修改配置后需重新应用后才能生效。">
                  <a-icon type="question-circle-o"/>
                </a-tooltip>
              </a-popconfirm>
              <a-popconfirm title="确认恢复默认配置？">
                <a-button icon="undo" type="link">恢复默认</a-button>
                <a-tooltip title="`该设备单独编辑过${props.configuration.name}，点击此将恢复成默认的配置信息，请谨慎操作。`">
                  <a-icon type="question-circle-o"/>
                </a-tooltip>
              </a-popconfirm>
            </span>
          </template>
        </a-descriptions>
      </div>
      <div :style="{marginBottom: '20px'}" v-for="(item,index) in DeviceConfigList" :key="'DeviceConfigList' + index">
        <h3>{{ item.name }}</h3>
        <a-descriptions bordered :column="2" title="">
          <a-descriptions-item :span="1" v-for="(property, inx) in item.properties" :key="item.property + inx">
            <template slot="label">
              <div>
                <span :style="{marginRight: '10px'}">{{ property.name }}</span>
                <a-tooltip :title="property.description">
                  <a-icon type="question-circle-o"/>
                </a-tooltip>
              </div>
            </template>
          </a-descriptions-item>
        </a-descriptions>
      </div>
    </a-card>
  </div>
</template>

<script>
  import moment from 'moment'
  import apis from '@/api'
  export default {
    name: 'InsEditorDetail',
    props: {
      data: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        DeviceConfigList: []
      }
    },
    watch: {
      data (newVal, oldVal) {
        if (Object.keys(newVal).length > 0) {
          this.GetData()
        }
      }
    },
    computed: {
      GetCreateTime () {
        return moment(this.data.createTime).format('YYYY-MM-DD HH:mm:ss')
      },
      GetRegisterTime () {
        if (this.data.state) {
          return this.data.state.value !== 'notActive' ? moment(this.data.registerTime).format('YYYY-MM-DD HH:mm:ss') : '/'
        }
        return ''
      },
      GetLastOnlineTime () {
        if (this.data.state) {
          return this.data.state.value !== 'notActive' ? moment(this.data.onlineTime).format('YYYY-MM-DD HH:mm:ss') : '/'
        }
        return ''
      },
      GetConfigurationList () {
        if (this.data.configuration.length !== 0) {
          return this.data.configuration
        }
        return []
      }
    },
    methods: {
      GetData () {
        const { protocol, transport } = this.data
        apis.deviceInstance.getDeviceConfig(protocol, transport)
          .then(res => {
            if (res.status === 200) {
              this.DeviceConfigList.push(res.result)
            }
          })
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
