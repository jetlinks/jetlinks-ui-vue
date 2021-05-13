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
      threadName: 'reactor-http-nio-6',
      name: 'org.elasticsearch.deprecation.cluster.metadata.IndexTemplateMetadata',
      level: 'ERROR',
      exceptionStack: 'Index template device_gateway_monitor_template contains multiple typed mappings; templates in 8x will only support a single mapping',
      'context.server': 'jetlinks-platform',
      createTime: '2020-10-10'
    }
  ]

  export default {
    name: 'LoggerSystem',
    components: {
      ComSearchForm,
      SaveModal
    },
    data () {
      const columns = [
        {
          title: '线程',
          dataIndex: 'threadName',
          ellipsis: true
        },
        {
          title: '名称',
          dataIndex: 'name',
          ellipsis: true
        },
        {
          title: '级别',
          dataIndex: 'level',
          width: 80,
          customRender: text => <a-tag color={text === 'ERROR' ? 'red' : 'orange'}>{text}</a-tag>
        },
        {
          title: '日志内容',
          dataIndex: 'exceptionStack',
          ellipsis: true
        },
        {
          title: '服务名',
          dataIndex: 'context.server',
          width: 150,
          ellipsis: true
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          width: 200,
          sorter: true,
          ellipsis: true,
          defaultSortOrder: 'descend',
          customRender: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
        },
        {
          title: '操作',
          customRender: (_, record) => (
            <div>
              <a
                onClick={() => this.setSaveVisible(record) }
              >
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
            label: '名称',
            key: 'name$LIKE',
            type: 'string'
          },
          {
            label: '日志级别',
            key: 'level$IN',
            type: 'list',
            options: {
              data: ['ERROR', 'INFO', 'WARN', 'DEBUG'],
              mode: 'multiple'
            }
          },
          {
            label: '日志时间',
            key: 'createTime$btw',
            type: 'time'
          },
          {
            label: '日志内容',
            key: 'message$LIKE',
            type: 'string'
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

<style lang="less" scoped>
@import '~@/utils/table.less';

</style>
