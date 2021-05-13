<template>
  <a-spin tip="加载中..." :spinning="loading">
    <page-header-wrapper
      :title="false"
      :tabList="tableList"
      :tab-active-key="ActiveTabKey"
      :style="{marginTop: '0px', backgroundColor: '#F0F2F5', paddingBottom: '10px'}"
      :tab-change="onTabChange"
    >
      <template v-slot:extra>
        <a-tooltip title="刷新">
          <a-icon type="sync" :style="{fontSize: '20px'}"/>
        </a-tooltip>
      </template>
      <template v-slot:content>
        <div class="deviceInsTitle">
          <div >
            <span :style="{paddingRight: '20px'}">
              {{ `设备：${GetDeviceId}` }}
            </span>
            <a-badge :status="GetDeviceStatus" :text="GetDeviceStatusText"/>
            <a-popconfirm v-if="GetDeviceStatus === 'success'" title="确认让此设备断开连接？" >
              <a>{{ '断开连接' }}</a>
            </a-popconfirm>
            <a-popconfirm v-if="GetDeviceStatus === 'processing'" title="确认激活此设备？" >
              <a>{{ '激活设备' }}</a>
            </a-popconfirm>
          </div>
          <div :style="{marginTop: '30px'}">
            <a-descriptions :column="4">
              <a-descriptions-item label="ID">{{ detailData.id }}</a-descriptions-item>
              <a-descriptions-item label="产品">
                <div>
                  {{ detailData.productId }}
                  <a
                    :style="{marginLeft: '10px'}"
                    @click="() => {
                      router.push(`/device/product/save/${detailData.productId}`);
                    }"
                  >查看</a>
                </div>
              </a-descriptions-item>
            </a-descriptions>
          </div>
        </div>
      </template>
      <template v-if="ActiveTabKey ==='info' ">
        <ins-editor-detail :data="detailData"></ins-editor-detail>
      </template>
      <template v-if="ActiveTabKey ==='status' ">
        <ins-editor-status></ins-editor-status>
      </template>
      <template v-if="ActiveTabKey ==='function' ">
        <ins-editor-function></ins-editor-function>
      </template>
      <template v-if="ActiveTabKey ==='log' ">
        <ins-editor-log></ins-editor-log>
      </template>
      <template v-if="ActiveTabKey ==='alarm' ">
        <device-alarm :target="'device'"></device-alarm>
      </template>
    </page-header-wrapper>
  </a-spin>
</template>

<script>
  import InsEditorDetail from './detail'
  import InsEditorStatus from './detail/Status'
  import InsEditorFunction from './detail/Function'
  import InsEditorLog from './detail/Log'
  import DeviceAlarm from '../../alarm'
  import { mapActions, mapGetters } from 'vuex'

  const statusMap = new Map()
  statusMap.set('online', 'success')
  statusMap.set('offline', 'error')
  statusMap.set('notActive', 'processing')
  export default {
    name: 'InsEditor',
    components: {
      InsEditorDetail,
      InsEditorStatus,
      InsEditorFunction,
      InsEditorLog,
      DeviceAlarm
    },
    data () {
      return {
        loading: true,
        detailData: {},
        tableList: [
          {
            key: 'info',
            tab: '实例信息'
          },
          {
            key: 'status',
            tab: '运行状态'
          },
          {
            key: 'function',
            tab: '设备功能'
          },
          {
            key: 'log',
            tab: '日志管理'
          },
          {
            key: 'alarm',
            tab: '告警设置'
          },
          {
            key: 'visualization',
            tab: '可视化'
          },
          {
            key: 'shadow',
            tab: '设备影子'
          }
        ],
        ActiveTabKey: 'info'
      }
    },
    mounted () {
      const { id } = this.$route.params
      this.getDeviceDetail(id).then(result => {
        if (result) {
          this.detailData = this.deviceDetailData
          this.loading = false
        }
      })
    },
    computed: {
      ...mapGetters('device', ['deviceDetailData']),
      GetDeviceId () {
        return this.$route.params.id
      },
      GetDeviceStatus () {
        const status = this.detailData.state ? this.detailData.state.value : ''
        return statusMap.get(status)
      },
      GetDeviceStatusText () {
        return this.detailData.state ? this.detailData.state.text : ''
      }
    },
    methods: {
      ...mapActions('device', ['getDeviceDetail']),
      onTabChange (key) {
        // if (!data.metadata) {
        //     message.error('请检查产品物模型');
        //     return;
        // }
        this.ActiveTabKey = key
      }
    }
  }
</script>

<style lang="less" scoped>
  .deviceInsTitle{
    display: flex;
    flex-direction: column;
  }
</style>
