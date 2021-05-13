<template>
  <page-header-wrapper>
    <a-card :bordered="false">
      <div class="tableList">
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
      :width="760"
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
  import SaveModal from './save'

  const data = [
    {
      key: 'id',
      name: '1',
      provider: '1',
      networkId: '1',
      state: {
        value: 'disabled',
        text: 1
      },
      actions: {
        alarmData: JSON.stringify({
          alarmData: 'id',
          description: '1'
        })
      }
    }
  ]

  export default {
    name: 'NetworkGateway',
    components: {
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
          dataIndex: 'provider',
          customRender: text => {
            // const temp = providerList.find((item) => item.id === text)
            // return temp ? temp.name : text
          }
        },
        {
          title: '网络组件',
          dataIndex: 'networkId',
          customRender: text => {
            // const temp = networkList.find((item) => item.id === text)
            // return temp ? temp.type?.name : text
          }
        },
        {
          title: '状态',
          dataIndex: 'state',
          customRender: text => text?.text
        },
        {
          title: '操作',
          width: '250px',
          align: 'center',
          dataIndex: 'actions',
          customRender: (text, record) => (
            <div>
              <a onClick={() => this.edit(record)}>
                编辑
              </a>
              <a-divider type="vertical" />
              {record.state && record.state.value === 'disabled' && (
                <span>
                  <a>
                    启动
                  </a>
                  <a-divider type="vertical" />
                  <a-popconfirm title="确认删除？">
                    <a>删除</a>
                  </a-popconfirm>
                </span>
              )}
              {record.state && record.state.value === 'enabled' && (
                <span>
                  <a>
                    暂停
                  </a>
                  <a-divider type="vertical" />
                  <a>
                    停止
                  </a>
                </span>
              )}
              {record.state && record.state.value === 'paused' && (
                <a>
                  恢复
                </a>
              )}
            </div>
          )
        }
      ]
      return {
        loading: false,
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
