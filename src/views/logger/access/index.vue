<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="tableList">
        <div>
          <com-search-form :formItems="formItems"></com-search-form>
        </div>
        <div class="StandardTable">
          <a-table
            :loading="loading"
            :columns="columns"
            :data-source="data"
          >
          </a-table>
        </div>
      </div>
    </a-card>
    <save-modal
      :data="ModalData"
      :visible="ModalVisible"
      :width="900"
      @submitData="submitData"
      @close="() => {
        ModalVisible = false
        ModalData = {}
      }"
    />
  </page-header-wrapper>
</template>

<script>
  import ComSearchForm from '@/components/SearchForm'
  import SaveModal from './save'
  import moment from 'moment'

  const data = [
    {
      key: 'id',
      id: '1',
      ip: '192.168.10.10',
      url: '/network/config/_query/no-paging',
      httpMethod: 'GET',
      describe: '网络组件管理-使用GET方式分页动态查询(不返回总数)',
      descend: '2020-10-10',
      responseTime: 20,
      requestTime: 3,
      'context.username': '超级管理员',
      httpHeaders: { 'referer': 'http://192.168.5.3:8000/', 'accept-language': 'zh-CN,zh;q=0.9', 'host': '127.0.0.1:8848', 'connection': 'close', 'cache-control': 'no-cache', 'accept-encoding': 'gzip, deflate', 'pragma': 'no-cache', 'accept': '*/*', 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36', 'x-access-token': '44b476eeaae2ff51112a6131348b3922' }
    }
  ]

  export default {
    name: 'LoggerAccess',
    components: {
      ComSearchForm,
      SaveModal
    },
    data () {
      const columns = [
        {
          title: '序号',
          dataIndex: 'id',
          customRender: (text, record, index) => index + 1
        },

        {
          title: 'IP',
          dataIndex: 'ip'
          // ellipsis: true
        },
        // {
        //     title: '请求方法',
        //     dataIndex: 'httpMethod',
        // },
        {
          title: '请求路径',
          dataIndex: 'url',
          // ellipsis: true,
          customRender: (text, record) => (
            <div>
              <a-tag color="#87d068">{record.httpMethod}</a-tag>
              {record.url}
            </div>
          )
        },
        {
          title: '说明',
          dataIndex: 'describe',
          // ellipsis: true,
          customRender: (text, record) => {
            const action = record.action ? <a-tag color="volcano">{record.action}</a-tag> : ''
            const describe = record.describe ? <a-tag color="#2db7f5">{record.describe}</a-tag> : ''
            return (
              <div>
                {action}
                {describe}
              </div>
            )
          }
        },
        // {
        //     title: "动作",
        //     dataIndex: 'action',
        //     ellipsis: true,
        // },
        {
          title: '请求时间',
          dataIndex: 'requestTime',
          sorter: true,
          defaultSortOrder: 'descend',
          // ellipsis: true,
          customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          title: '请求耗时',
          // width: 100,
          customRender: (record) => (
            <a-tag color="purple">{record.responseTime - record.requestTime}ms</a-tag>
          )
        },
        {
          title: '请求用户',
          dataIndex: 'context.username',
          customRender: text => <a-tag color="geekblue">{text}</a-tag>
        },
        {
          title: '操作',
          customRender: (text, record) => (
            <div>
              <a onClick={() => this.setSaveVisible(record)}>
                详情
              </a>
            </div>
          )
        }
      ]
      return {
        loading: false,
        formItems: [
          {
            label: '请求路径',
            key: 'url$LIKE',
            type: 'string'
          },
          {
            label: 'IP',
            key: 'ip',
            type: 'string'
          },

          {
            label: '操作',
            key: 'action',
            type: 'string'
          },
          {
            label: '请求ID',
            key: 'id',
            type: 'string'
          },
          {
            label: '日志时间',
            key: 'requestTime$btw',
            type: 'dateTimeRange',
            props: {
              showTime: { format: 'HH:mm' },
              format: 'YYYY-MM-DD HH:mm',
              placeholder: ['开始时间', '结束时间']
            }
          }
        ],
        columns,
        data,
        ModalVisible: false,
        ModalData: {}
      }
    },
    methods: {
      setSaveVisible (data) {
        this.ModalVisible = true
        this.ModalData = data
      },
      submitData (data) {
        this.ModalVisible = false
        // 提交数据XXX
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
