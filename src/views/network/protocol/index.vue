<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="tableList">
        <com-search-form :formItems="formItems"></com-search-form>
        <div class="tableListOperator">
          <a-button icon="plus" type="primary" @click="() => { DrawerVisible = true }">
            新建
          </a-button>
        </div>
        <div class="StandardTable">
          <a-table
            :rowKey="record => record.id"
            :loading="loading"
            :columns="columns"
            :data-source="data"
            :pagination="{
              current: current+1,
              total: total,
              pageSize: pageSize,
              showQuickJumper: true,
              showSizeChanger: true,
              pageSizeOptions: ['10', '20', '50', '100'],
              showTotal:total => `共${total}条记录
                                第${current + 1}/${Math.ceil(total / pageSize) }页`
            }"
          >
          </a-table>
        </div>
      </div>
    </a-card>
    <save-drawer
      :data="DrawerData"
      :visible="DrawerVisible"
      @onClose="() => {
        DrawerVisible = false
        DrawerData = {}
      }"
    />
  </page-header-wrapper>
</template>

<script>
  import ComSearchForm from '@/components/SearchForm'
  import SaveDrawer from './save'
  import apis from '@/api'
  import { HandleProtocolList } from './service'
  import { ExixtKeys } from '@/utils/util'

  export default {
    name: 'NetworkProtocol',
    components: {
      ComSearchForm,
      SaveDrawer
    },
    data () {
      const columns = [
        {
          title: 'ID',
          dataIndex: 'id'
        }, {
          title: '名称',
          dataIndex: 'name'
        },
        {
          title: '状态',
          dataIndex: 'state',
          align: 'center',
          customRender: text =>
            text === 1 ? <a-tag color="#87d068">已发布</a-tag> : <a-tag color="#f50">未发布</a-tag>
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '操作',
          width: '250px',
          align: 'center',
          dataIndex: 'actions',
          customRender: (text, record) => (
            <div>
              <a onClick={() => this.edit(record)}>编辑</a>
              <a-divider type="vertical" />
              {record.state === 1 ? (
                  <a-popconfirm title="确认重新发布？" >
                    <a>重新发布</a>
                  </a-popconfirm>
                ) : (
                <a-popconfirm title="确认删除？" >
                  <a>删除</a>
                </a-popconfirm>
              ) }
              <a-divider type="vertical" />
              {record.state === 1 ? (
                <a-popconfirm title="确认取消发布？" >
                  <a>取消发布</a>
                </a-popconfirm>
              ) : (
                  <a-popconfirm title="确认发布？" >
                    <a>发布</a>
                  </a-popconfirm>
                )}
            </div>
          )
        }
      ]
      return {
        loading: false,
        formItems: [
          {
            label: '协议名称',
            key: 'name$LIKE',
            type: 'string'
          }
        ],
        columns,
        data: [],
        pageSize: 10,
        current: 0,
        total: 0,
        DrawerVisible: false,
        DrawerData: {}
      }
    },
    created () {
      this.Init()
    },
    methods: {
      async Init () {
        const result = await apis.network.GetProtocolList({
          pageSize: this.pageSize
        })
        const handleData = HandleProtocolList(result)
        this.data = ExixtKeys(handleData, 'data')
      },
      edit (data) {
        this.DrawerVisible = true
        this.DrawerData = data
      },
      submitData (data) {
        this.DrawerVisible = false
        // 提交数据XXX
      }
    }
  }
</script>

<style lang="less" scoped>
@import '~@/utils/table.less';
</style>
