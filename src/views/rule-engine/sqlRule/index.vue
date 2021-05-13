<template>
  <page-header-wrapper>
    <a-card
      :bordered="false"
    >
      <div class="tableList">
        <div>
          <com-search-form :formItems="formItems"/>
        </div>
        <div class="tableListOperator">
          <a-button
            icon="plus"
            type="primary"
            @click="setSaveVisible"
          >
            新建
          </a-button>
          <a-upload
            :showUploadList="false"
            accept=".json"
          >
            <a-button>
              <a-icon type="upload" />导入
            </a-button>
          </a-upload>
        </div>
      </div>
      <div class="StandardTable">
        <a-table
          :loading="loading"
          :columns="columns"
          :data-source="data"
        >
        </a-table>
      </div>
    </a-card>
    <save-drawer
      :visible="DrawerVisible"
      :data="DrawerData"
      @onClose="() => {
        DrawerVisible = false
        DrawerData= {}
      }"
    >
    </save-drawer>
  </page-header-wrapper>
</template>

<script>
  import ComSearchForm from '@/components/SearchForm'
  import SaveDrawer from './save'
  import moment from 'moment'
  const data = [
    {
      key: 'id',
      id: '1',
      name: '1',
      createTime: '2020-10-20',
      state: {
        text: '已启动'
      },
      option: {
        alarmData: JSON.stringify({
          alarmData: 'id',
          description: '1'
        })
      }
    }
  ]
  const statusMap = new Map()
  statusMap.set('已启动', 'success')
  statusMap.set('已停止', 'error')
  statusMap.set('已禁用', 'processing')

  export default {
    name: 'RuleEngineSqlrule',
    components: {
      ComSearchForm,
      SaveDrawer
    },
    data () {
      const columns = [
        {
          title: 'ID',
          dataIndex: 'id'
        },

        {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '创建时间',
          dataIndex: 'createTime',
          sorter: true,
          defaultSortOrder: 'descend',
          customRender: (text) => text ? moment(text).format('YYYY-MM-DD HH:mm:ss') : '/'
        },
        {
          title: '状态',
          dataIndex: 'state',
          customRender: record => record ? <a-badge status={statusMap.get(record.text)} text={record.text} /> : ''
        },
        {
          title: '操作',
          width: '25%',
          customRender: (text, record) => (
            <div>
              <a onClick={() => {}}>编辑</a>
              <a-divider type="vertical" />
              {record.state?.value === 'started' ? (
                <span>
                  <a-popconfirm title="确认停止？" >
                    <a>停止</a>
                  </a-popconfirm>
                </span>
              ) : (
                  <span>
                    <a-popconfirm title="确认启用?" >
                      <a>启动</a>
                    </a-popconfirm>
                    <a-divider type="vertical" />
                    <a-popconfirm title="确认删除?" >
                      <a>删除</a>
                    </a-popconfirm>
                  </span>
                )}
              <a-divider type="vertical" />
              <a onClick={() => {}}>下载配置</a>
            </div>
          )
        }
      ]
      return {
        formItems: [
          {
            label: '名称',
            key: 'name$LIKE',
            type: 'string'
          }
        ],
        columns,
        data,
        DrawerVisible: false,
        DrawerData: {}
      }
    },
    methods: {
      setSaveVisible () {
        this.DrawerVisible = true
        this.DrawerData = {}
      }
    }
  }
</script>

<style lang="less" scoped>
@import '~@/utils/table.less';
</style>
