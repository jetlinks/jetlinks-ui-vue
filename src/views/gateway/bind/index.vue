<template>
  <a-modal
    :visible="visible"
    title="绑定子设备"
    okText="确定"
    cancelText="取消"
    width="60%"
    :style="{marginTop: '-30px'}"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="tableList" :style="{maxHeight: '600px', overflowY: 'auto', overflowX: 'hidden'}">
      <div class="tableListForm">
        <gateway-search></gateway-search>
      </div>
      <div class="StandardTable">
        <a-table
          :columns="columns"
          :dataSource="deviceData"
          rowKey="id"
          :row-selection="rowSelection"
        >
        </a-table>
      </div>
    </div>
  </a-modal>
</template>

<script>
  import moment from 'moment'
  import GatewaySearch from '../search'
  import apis from '@/api'
  import { tableMixin } from '@/core/mixins/tableMixin'
  const statusMap = new Map()
  statusMap.set('在线', 'success')
  statusMap.set('离线', 'error')
  statusMap.set('未激活', 'processing')
  export default {
    name: 'NetworkBind',
    mixins: [tableMixin],
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    components: {
      GatewaySearch
    },
    data () {
      const columns = [
        {
          title: 'ID',
          dataIndex: 'id',
          ellipsis: true
        },
        {
          title: '设备名称',
          dataIndex: 'name',
          ellipsis: true
        },
        {
          title: '产品名称',
          dataIndex: 'productName',
          ellipsis: true
        },
        {
          title: '注册时间',
          dataIndex: 'registryTime',
          width: '200px',
          ellipsis: true,
          customRender: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
          sorter: true,
          defaultSortOrder: 'descend'
        },
        {
          title: '状态',
          dataIndex: 'state',
          width: '120px',
          customRender: record =>
            record ? <a-badge status={statusMap.get(record.text)} text={record.text}/> : ''
        }
      ]
      return {
        columns,
        type: 'radio',
        selectId: '',
        deviceData: []
      }
    },
    mounted () {
      this.GetData()
    },
    computed: {
      rowSelection () {
        return {
          type: this.type,
          onChange: (Rowid, Rowitem) => {
            // eslint-disable-next-line vue/no-side-effects-in-computed-properties
            this.selectId = Rowid[0]
          }
        }
      }
    },
    methods: {
      GetData () {
        apis.deviceInstance.getDeviceListData({
          pageSize: this.pageSize
        })
          .then(res => {
            if (res.status === 200) {
              this.deviceData = res.result.data
            }
          })
      },
      handleOk () {
        this.$emit('subData', this.selectId)
      },
      handleCancel () {
        this.$emit('cancel')
      }
    }
  }
</script>

<style lang="less" scoped>
@import '~@/utils/table.less';
</style>
