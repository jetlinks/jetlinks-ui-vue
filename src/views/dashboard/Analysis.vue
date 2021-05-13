<template>
  <div>
    <a-row :gutter="24">
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="当前在线" :total="getDeviceOnline | NumberFormat">
          <a-tooltip title="刷新" slot="action">
            <a-icon type="sync" />
          </a-tooltip>
          <div>
            <mini-bar :dataSource="getDeviceHistoryOnline"/>
          </div>
          <template slot="footer">
            设备总数
            <span>
              {{ getDeviceTotal }}
            </span>
            未激活设备
            <span>
              {{ getDeviceNotActive }}
            </span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="今日设备消息量" :total="getDeviceTodayMessageNum | NumberFormat">
          <a-tooltip title="刷新" slot="action">
            <a-icon type="sync" />
          </a-tooltip>
          <div>
            <mini-area :dataSource="getDeviceMonthMessageData"/>
          </div>
          <template slot="footer">
            当月设备消息量
            <span>
              {{ getDeviceMonthMessageNum | NumberFormat }}
            </span>
          </template>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="CPU使用率" :showFooter="false" :contentStyle="{ height: '78px' }">
          <div>
            <mini-dashboard :height="169" :warnLevel="[5, 8, 10]" :showData="10"/>
          </div>
        </chart-card>
      </a-col>
      <a-col :sm="24" :md="12" :xl="6" :style="{ marginBottom: '24px' }">
        <chart-card :loading="loading" title="JVM内存" :showFooter="false" :contentStyle="{ height: '78px' }">
          <div>
            <mini-dashboard :height="169" :dashboardMax="4" :warnColor="['#2F9CFF']" :showData="3.3" :dataUnit="'G'"/>
          </div>
        </chart-card>
      </a-col>
    </a-row>
    <a-card :loading="false" :bordered="false" :bodyStyle="{ padding: '0' }">
      <div class="salesCard">
        <a-tabs default-active-key="sales" size="large" :tabBarStyle="{ marginBottom: '24px' }">
          <div slot="tabBarExtraContent" class="salesExtraWrap">
            <div class="salesExtra">
              <a-radio-group :defaultValue="startTime" @change="setStartTime">
                <a-radio-button value="1h">
                  1小时
                </a-radio-button>
                <a-radio-button value="1d">
                  1天
                </a-radio-button>
                <a-radio-button value="7d">
                  7天
                </a-radio-button>
                <a-radio-button value="30d">
                  30天
                </a-radio-button>
              </a-radio-group>
            </div>
            <a-datePicker
              showTime
              :defaultValue="GetDate"
              placeholder="结束时间"
              format="YYYY-MM-DD HH:mm:ss"
              @ok="setEndTime"
            />
          </div>
          <a-tab-pane key="sales" tab="设备消息">
            <a-row>
              <a-col>
                <div class="salesBar">
                  <mini-message :dataSource="DeviceMessageData" :ticksList="ticksList"/>
                </div>
              </a-col>
            </a-row>
          </a-tab-pane>
        </a-tabs>
      </div>
    </a-card>
  </div>
</template>

<script>
import moment from 'moment'
import { baseMixin } from '@/store/app-mixin'
import apis from '@/api'
import messageInfoData from './message.json'
import messageData from './messageData.json'
import {
  deviceInfoParams,
  deviceMessageInfoParams,
  deviceMessageDateParams,
  handleDeviceInfo,
  handleDeviceMessageInfo,
  handleDeviceMessageData
} from './service.js'

import {
  ChartCard,
  MiniArea,
  MiniBar,
  MiniDashboard,
  MiniMessage
} from '@/components'
import { cloneDeep } from 'lodash'

const timeMap = new Map()
timeMap.set('1h', '1m')
timeMap.set('1d', '24m')
timeMap.set('7d', '168m')
timeMap.set('30d', '12h')

export default {
  name: 'Analysis',
  mixins: [baseMixin],
  components: {
    ChartCard,
    MiniArea,
    MiniBar,
    MiniDashboard,
    MiniMessage
  },
  data () {
    return {
      DeviceInfo: {},
      DeviceMessageInfo: {},
      DeviceMessageData: [],
      ticksList: [],
      loading: true,
      startTime: '1h',
      endTime: ''
    }
  },
  computed: {
    getDeviceTotal () {
      return Object.keys(this.DeviceInfo).length ? this.DeviceInfo.total : 0
    },
    getDeviceOnline () {
      return Object.keys(this.DeviceInfo).length ? this.DeviceInfo.online : 0
    },
    getDeviceNotActive () {
      return Object.keys(this.DeviceInfo).length ? this.DeviceInfo.notActive : 0
    },
    getDeviceHistoryOnline () {
      return Object.keys(this.DeviceInfo).length ? this.DeviceInfo.historyOnline : []
    },
    getDeviceTodayMessageNum () {
      return Object.keys(this.DeviceMessageInfo).length ? this.DeviceMessageInfo.todayNum : 0
    },
    getDeviceMonthMessageNum () {
      return Object.keys(this.DeviceMessageInfo).length ? this.DeviceMessageInfo.monthNum : 0
    },
    getDeviceMonthMessageData () {
      return Object.keys(this.DeviceMessageInfo).length ? this.DeviceMessageInfo.monthData : 0
    },
    GetDate () {
      return moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
    }
  },
  mounted () {
    this.GetData()
    setTimeout(() => {
      this.loading = !this.loading
    }, 1000)
  },
  methods: {
    GetData () {
      this.getDeviceInfo()
      this.getDeviceTodayMessageInfo()
      const params = this.initTime(this.startTime)
      this.getDeviceMessageInfo(params)
    },
    getDeviceInfo () {
      apis.dashboard.getBaseInfo(deviceInfoParams).then(res => {
        if (res.status === 200) {
          this.DeviceInfo = handleDeviceInfo(res.result)
        }
      })
    },
    getDeviceTodayMessageInfo () {
      apis.dashboard.getBaseInfo(deviceMessageInfoParams).then(res => {
        if (res.status === 200) {
          this.DeviceMessageInfo = res.result.length === 0
            ? handleDeviceMessageInfo(messageInfoData.result)
            : handleDeviceMessageInfo(res.result)
        }
      })
    },
    getDeviceMessageInfo (params) {
      const { from, to, time } = params
      apis.dashboard.getBaseInfo(deviceMessageDateParams(from, to, time)).then(res => {
        if (res.status === 200) {
          const result = handleDeviceMessageData(messageData.result)
          this.DeviceMessageData = res.result.length === 0
            ? result.Data
            : handleDeviceMessageData(res.result)
          this.ticksList = result.ticksList
        }
      })
    },
    initTime (value) {
      // 需要深复制一份，不然会同时更改
      const dd = cloneDeep(this.endTime) || new Date(this.GetDate)
      const toTime = this.endTime || new Date(this.GetDate)
      if (timeMap.get(value) === '1m') {
        dd.setHours(dd.getHours() - 1)
      } else if (timeMap.get(value) === '24m') {
        dd.setDate(dd.getDate() - 1)
      } else if (timeMap.get(value) === '168m') {
        dd.setDate(dd.getDate() - 7)
      } else if (timeMap.get(value) === '12h') {
        dd.setDate(dd.getDate() - 30)
      }
      return {
        from: this.formatData(dd),
        to: this.formatData(toTime),
        time: timeMap.get(this.startTime)
      }
    },
    formatData (value) {
      const dd = new Date(value)
      return `${dd.getFullYear()}-${(dd.getMonth() + 1) < 10 ? `0${dd.getMonth() + 1}`
        : (dd.getMonth() + 1)}-${dd.getDate() < 10 ? `0${dd.getDate()}`
        : dd.getDate()} ${dd.getHours() < 10 ? `0${dd.getHours()}`
        : dd.getHours()}:${dd.getMinutes() < 10 ? `0${dd.getMinutes()}`
        : dd.getMinutes()}:${dd.getSeconds() < 10 ? `0${dd.getSeconds()}`
        : dd.getSeconds()}`
    },
    setEndTime (date) {
      this.endTime = new Date(date)
      const parmas = this.initTime(this.startTime)
      this.getDeviceMessageInfo(parmas)
    },
    setStartTime (e) {
      const { value } = e.target
      this.startTime = value
      const parmas = this.initTime(value)
      this.getDeviceMessageInfo(parmas)
    }
  }
}
</script>

<style lang="less" scoped>
  @media screen and (max-width: 576px) {
    .salesExtraWrap {
      display: none !important;
    }

    .salesCard {
      :global {
        .ant-tabs-content {
          padding-top: 30px;
        }
      }
    }
  }
  .salesCard {
    .salesBar {
      padding: 0 0 32px 32px;
    }
    .salesRank {
      padding: 0 32px 32px 72px;
    }
    /deep/.ant-tabs-bar {
      padding-left: 16px;
      .ant-tabs-nav .ant-tabs-tab {
        padding-top: 16px;
        padding-bottom: 14px;
        line-height: 24px;
      }
    }
    /deep/.ant-tabs-extra-content {
      padding-right: 24px;
      line-height: 55px;
    }
    /deep/.ant-card-head {
      position: relative;
    }
    /deep/.ant-card-head-title {
      align-items: normal;
    }
  }

  .salesExtra {
    display: inline-block;
    margin-right: 24px;
    a {
      margin-left: 24px;
      color: #fff;
      &:hover {
        color: #1890ff;
      }
      &.currentDate {
        color: #1890ff;
      }
    }
  }
</style>
