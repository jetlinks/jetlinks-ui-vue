<template>
  <a-spin tip="加载中..." :spinning="spinning">
    <a-card :style="{ marginTop: '16px' }">
      <a-tabs default-active-key="1">
        <a-tab-pane key="1" tab="告警设置">
          <a-card :bordered="false">
            <a-button
              slot="title"
              icon="plus"
              type="primary"
              @click="() => { showModal = true; DetailData={} }"
            >
              新增告警
            </a-button>
            <a-table
              rowKey="id"
              :columns="attributeColumns"
              :data-source="showData"
              :pagination="false"
            >
            </a-table>
            <define-alarm
              ref="alramList"
              :showModal="showModal"
              :deviceDetailData="DetailData"
              @SetModalOk="SetModalOk"
              @SetModalCancel="SetModalCancel">
            </define-alarm>
            <!-- <com-table :attributeColumns="attributeColumns" :showData="showData" :actions="actions" @setAlarmActiveKey="setAlarmActiveKey">
              <define-alarm v-if="AlarmActiveKey==='edit'" :showModal="showModal" @SetModalOk="SetModalOk" @SetModalCancel="SetModalCancel">
              </define-alarm>
            </com-table> -->
          </a-card>
        </a-tab-pane>
        <a-tab-pane key="2" tab="告警记录">
          <a-card :bordered="false">
            <a-select default-value="lucy" style="width: 300px;marginBottom:10px;">
              <a-select-option value="jack">
                Jack
              </a-select-option>
              <a-select-option value="lucy">
                Lucy
              </a-select-option>
              <a-select-option value="disabled" disabled>
                Disabled
              </a-select-option>
              <a-select-option value="Yiminghe">
                yiminghe
              </a-select-option>
            </a-select>
            <!-- <com-table :attributeColumns="attributeColumns" :showData="showData" :actions="actions">
              <template slot="operation">
                <a-button type="link" style="padding: 0;">编辑</a-button>
                <a-divider type="vertical" />
                <a-button type="link" style="padding: 0;">删除</a-button>
              </template>
            </com-table> -->
          </a-card>
        </a-tab-pane>
      </a-tabs>
    </a-card>
  </a-spin>
</template>

<script>
  import moment from 'moment'
  import apis from '@/api'
  import { mapGetters } from 'vuex'
  import ComTable from '@/components/Table'
  import DefineAlarm from './save'
  const actions = [
    {
      name: '查看',
      type: 'edit'
    },
    {
      name: '告警日志',
      type: 'link'
    },
    {
      name: '启动',
      type: 'function'
    },
    {
      name: '删除',
      type: 'delete'
    }
  ]
  export default {
    name: 'DeviceAlarm',
    props: {
      target: {
        type: String,
        default: ''
      }
    },
    components: {
      ComTable,
      DefineAlarm
    },
    data () {
      const columns = [
        {
          title: '告警名称',
          key: 'name',
          dataIndex: 'name'
        },
        {
          title: '创建时间',
          key: 'createTime',
          dataIndex: 'createTime',
          customRender: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'
        },
        {
          title: '运行状态',
          key: 'state',
          dataIndex: 'state',
          customRender: (record) => {
            const statusMap = new Map()
            statusMap.set('运行中', 'success')
            statusMap.set('已停止', 'error')
            return (
              record ? <a-badge status={statusMap.get(record.text)} text={record.text} /> : ''
            )
          }
        },
        {
          title: '操作',
          width: '250px',
          align: 'center',
          key: 'operation',
          customRender: (record) => (
            <div>
              <a onClick={ () => {
                this.showModal = true
                this.DetailData = record
              }}>查看</a>
              <a-divider type="vertical"/>
              <a >告警日志</a>
              <a-divider type="vertical"/>
              {record.state?.value === 'stopped' ? (
                <span>
                  <a-popconfirm
                    title="确认启动此告警？"
                    onConfirm={() => {
                    }}
                  >
                    <a>启动</a>
                  </a-popconfirm>
                  <a-divider type="vertical"/>
                  <a-popconfirm
                    title="确认删除此告警？"
                    onConfirm={() => {
                    }}
                  >
                    <a>删除</a>
                  </a-popconfirm>
                </span>
              ) : (
                <a-popconfirm
                  title="确认停止此告警？"
                  onConfirm={() => {
                  }}
                >
                  <a>停止</a>
                </a-popconfirm>
              )}
            </div>
          )
          // scopedSlots: { customRender: 'operation' }
        }
      ]
      return {
        spinning: true,
        attributeColumns: columns,
        showData: [],
        actions,
        showModal: false,
        DetailData: {}
      }
    },
    mounted () {
      this.GetData()
      // setTimeout(() => {
      //   this.spinning = false
      // }, 30)
    },
    computed: {
      ...mapGetters('device', ['deviceDetailData', 'productDetailData'])
    },
    methods: {
      GetData () {
        const { id } = this.$route.params
        apis.deviceInstance.getDeviceAlarmList(this.target, id)
          .then(res => {
            if (res.status === 200) {
              this.showData = res.result
              this.spinning = false
            }
          })
      },
      setAlarmActiveKey (item) {
        this.AlarmActiveKey = item.type
        this.showModal = true
      },
      addAlarmInfo (alarmRuleData) {
        const { id } = this.$route.params
        let paramsData = {}
        if (this.$route.meta.title === '产品详情') {
          const {
            name = '',
            productId = '',
            productName = ''
          } = this.productDetailData(id)[0]
          paramsData = {
            alarmRule: {
              name,
              productId,
              productName,
              ...alarmRuleData
            },
            name: alarmRuleData.name,
            target: this.target,
            targetId: id
          }
        } else if (this.$route.meta.title === '设备详情') {
          const {
            name = '',
            deviceName = '',
            deviceId = '',
            productId = '',
            productName = ''
          } = this.deviceDetailData
          paramsData = {
            alarmRule: {
              name,
              deviceId,
              deviceName,
              productId,
              productName,
              ...alarmRuleData
            },
            name: alarmRuleData.name,
            target: this.target,
            targetId: id
          }
        }
        apis.deviceInstance.addDeviceAlarmInfo(this.target, id, paramsData).then(res => {
          if (res.status === 200) {
            this.GetData()
          }
        }).catch((err) => {
          this.$message.error(err)
        })
      },
      editAlarmInfo (alarmRuleData) {
        const { id } = this.$route.params
        const defalutData = this.DetailData
        apis.deviceInstance.addDeviceAlarmInfo(this.target, id, {
          ...defalutData,
          alarmRule: {
            ...defalutData.alarmRuleData,
            ...alarmRuleData
          },
          name: alarmRuleData.name
        }).then(res => {
          if (res.status === 200) {
            this.GetData()
          }
        }).catch((err) => {
          this.$message.error(err)
        })
      },
      SetModalOk (data) {
        console.log('################', data)
        if (Object.keys(this.DetailData).length) {
          this.editAlarmInfo(data)
        } else {
          this.addAlarmInfo(data)
        }
        this.showModal = false
      },
      SetModalCancel () {
        this.DetailData = {}
        this.showModal = false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
