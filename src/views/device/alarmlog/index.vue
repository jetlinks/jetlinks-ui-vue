<template>
  <page-header-wrapper title="告警记录">
    <a-card :bordered="false" :style="{ marginBottom: '16px' }">
      <div>
        <com-search-form :formItems="formItems"></com-search-form>
      </div>
    </a-card>
    <a-card >
      <per-com-table :columns="columns" :data="data"></per-com-table>
    </a-card>
  </page-header-wrapper>
</template>

<script>
  import ComSearchForm from '@/components/SearchForm'
  import PerComTable from '@/views/system/component/PerComTable'
  import moment from 'moment'

  const data = [
    {
      key: 'id',
      deviceId: '1',
      deviceName: '1',
      alarmName: '1',
      alarmTime: '2020-10-20',
      state: 'solve',
      option: {
        alarmData: JSON.stringify({
          alarmData: 'id',
          description: '1'
        })
      }
    }
  ]

  export default {
    name: 'DeviceAlarm',
    components: {
      ComSearchForm,
      PerComTable
    },
    data () {
      const columns = [
        {
          title: '设备ID',
          dataIndex: 'deviceId'
        },
        {
          title: '设备名称',
          dataIndex: 'deviceName'
        },
        {
          title: '告警名称',
          dataIndex: 'alarmName'
        },
        {
          title: '告警时间',
          dataIndex: 'alarmTime',
          width: '300px',
          customRender: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/',
          sorter: true,
          defaultSortOrder: 'descend'
        },
        {
          title: '处理状态',
          dataIndex: 'state',
          align: 'center',
          width: '100px',
          customRender: text => text === 'solve' ? <a-tag color="#87d068">已处理</a-tag> : <a-tag color="#f50">未处理</a-tag>
        },
        {
          title: '操作',
          dataIndex: 'option',
          width: '120px',
          align: 'center',
          customRender: (record) => (
                <div>
                    <a onClick={() => {
                        let content
                        try {
                            content = JSON.stringify(record.alarmData, null, 2)
                        } catch (error) {
                            content = record.alarmData
                        }
                        this.$confirm({
                            width: '40VW',
                            title: '告警数据',
                            content: <pre>{content}
                                {record.state === 'solve' && (
                                    <template>
                                      <br /><br />
                                      <span style={{ fontSize: 16 }}>处理结果：</span>
                                      <br />
                                      <p>{record.description}</p>
                                    </template>
                                )}
                            </pre>,
                            okText: '确定',
                            cancelText: '关闭'
                        })
                    }}>详情</a>
                    {
                        record.state !== 'solve' ? <a-divider type="vertical" /> : ''
                    }
                    {
                        record.state !== 'solve' && (
                            <a>处理</a>
                        )
                    }
                </div>
            )
        }
      ]
      return {
        formItems: [{
            label: '设备ID',
            key: 'deviceId$like',
            type: 'string'
          },
          {
            label: '产品',
            key: 'productId$IN',
            type: 'list',
            options: {
                // data: productList.current,
                mode: 'tags'
            }
          },
          {
            label: '告警时间',
            key: 'alarmTime$btw',
            type: 'time'
          }
        ],
        columns,
        data
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
