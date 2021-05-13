<template>
  <page-header-wrapper title="证书管理">
    <a-card :bordered="false">
      <div class="tableList">
        <com-search-form :formItems="formItems"></com-search-form>
        <div class="tableListOperator">
          <a-button icon="plus" type="primary" @click="() => { ModalVisible = true }">
            新建
          </a-button>
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

  const data = [
    {
      key: 'id',
      name: '1',
      id: '1',
      instance: '1',
      description: '1',
      actions: {
        alarmData: JSON.stringify({
          alarmData: 'id',
          description: '1'
        })
      }
    }
  ]

  export default {
    name: 'NetworkCertificate',
    components: {
      ComSearchForm,
      SaveModal
    },
    data () {
      const columns = [
        {
          title: '名称',
          dataIndex: 'name'
        },

        {
          title: '类型',
          dataIndex: 'instance'
        },
        {
          title: '描述',
          dataIndex: 'description'
        },
        {
          title: '操作',
          dataIndex: 'actions',
          customRender: (text, record) => (
            <div>
              <a onClick={() => this.edit(record)}>编辑</a>
              <a-divider type="vertical" />
              <a-popconfirm title="确认删除？">
                <a>删除</a>
              </a-popconfirm>
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
            label: '类型',
            key: 'instance$IN',
            type: 'list',
            options: {
              mode: 'multiple',
              data: ['PFX', 'JKS', 'PEM']
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
      edit (data) {
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
