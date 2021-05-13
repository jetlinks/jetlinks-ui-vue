<template>
  <div>
    <a-card :bordered="false">
      <div>
        <a-form :labelCol="{ span: 6 }" :wrapperCol="{ span: 18 }">
          <a-row :gutter="{ md: 8, lg: 4, xl: 48 }">
            <a-col :md="8" :sm="24">
              <a-form-item label="日志类型">
                <a-select mode="multiple">
                  <a-select-option v-for="(item, index) in SelectOptions" :key="'SelectOptions'+index">{{ item.name }}
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="10" :sm="24">
              <a-form-item label="日期">
                <a-range-picker
                  :show-time="{ format: 'HH:mm' }"
                  :format="'YYYY-MM-DD HH:mm'"
                  :placeholder="['开始时间', '结束时间']"
                />
              </a-form-item>
            </a-col>
            <a-col :md="6" :sm="24">
              <div :style="{ overflow: 'hidden' }">
                <div :style="{ float: 'right', marginBottom: '24px' }">
                  <a-button
                    icon="search"
                    type="primary"
                  >
                    查询
                  </a-button>
                  <a-button
                    :style="{ marginLeft: '8px' }"
                  >
                    重置
                  </a-button>
                </div>
              </div>
            </a-col>
          </a-row>
        </a-form>
      </div>
      <a-table
        :loading="false"
        :columns="columns"
        :dataSource="data"
        rowKey="key"
      >
      </a-table>
    </a-card>
  </div>
</template>

<script>
  import moment from 'moment'
  const data = [
    {
      key: '1',
      'type.text': '调用功能',
      timestamp: '2010-10-10',
      content: JSON.stringify({
        'headers': {
          'async': false,
          'productId': 'testpro',
          'members': [
            '1354249282351763456'
          ],
          'tenantId': [
            'e86cea037cfc50dc86a8056da89a1774'
          ],
          'deviceName': '测试产品'
        },
        'functionId': 'test',
        'messageType': 'INVOKE_FUNCTION',
        'inputs': [
          {
            'name': 'par1',
            'value': '参数1'
          },
          {
            'name': 'par2',
            'value': '参数2'
          }
        ],
        'messageId': '1363765355063894016',
        'deviceId': 'testpro00001',
        'timestamp': 1613981972839
      }),
      option: JSON.stringify({
        'headers': {
          'async': false,
          'productId': 'testpro',
          'members': [
            '1354249282351763456'
          ],
          'tenantId': [
            'e86cea037cfc50dc86a8056da89a1774'
          ],
          'deviceName': '测试产品'
        },
        'functionId': 'test',
        'messageType': 'INVOKE_FUNCTION',
        'inputs': [
          {
            'name': 'par1',
            'value': '参数1'
          },
          {
            'name': 'par2',
            'value': '参数2'
          }
        ],
        'messageId': '1363765355063894016',
        'deviceId': 'testpro00001',
        'timestamp': 1613981972839
      })
    }
  ]

  export default {
    name: 'InsEditorLog',
    data () {
      const columns = [
        {
          dataIndex: 'type.text',
          title: '类型'
        },
        {
          dataIndex: 'timestamp',
          title: '时间',
          defaultSortOrder: 'descend',
          customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          dataIndex: 'content',
          title: '内容',
          ellipsis: true
        },
        {
          dataIndex: 'option',
          title: '操作',
          width: '250px',
          align: 'center',
          customRender: (text, record) => {
            let content = ''
            try {
              content = JSON.stringify(JSON.parse(record.content), null, 2)
            } catch (error) {
              // eslint-disable-next-line prefer-destructuring
              content = record.content
            }
            return (
              <div>
                <a
                  onClick={() =>
                    this.$confirm({
                      width: '50VW',
                      title: '详细信息',
                      content: <pre>{content}</pre>,
                      okText: '确定',
                      cancelText: '关闭'
                    })
                  }
                >
                  查看
                </a>
              </div>
            )
          }
        }
      ]
      return {
        SelectOptions: [
          { id: 'event', name: '事件上报' },
          { id: 'readProperty', name: '属性读取' },
          { id: 'writeProperty', name: '属性修改' },
          { id: 'reportProperty', name: '属性上报' },
          { id: 'call', name: '调用' },
          { id: 'reply', name: '回复' },
          { id: 'offline', name: '下线' },
          { id: 'online', name: '上线' },
          { id: 'other', name: '其它' }
        ],
        data,
        columns
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
