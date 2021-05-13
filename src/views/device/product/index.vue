<template>
  <page-header-wrapper :title="GetMetaTitle">
    <template v-slot:extra v-if="GetDetailStatus">
      <div class="page-header-extra">
        <div class="content">
          <div class="content-status">
            <a-badge
              :style="{ marginLeft: '20px' }"
              :status="getState === 0 ? 'error' : 'success' "
            />{{ getState === 0 ? "未发布" : "已发布" }}
            <a-button type="link">
              {{ getState === 0 ? "发布" : "停用" }}
            </a-button>
          </div>
          <div class="content-restart">
            <a-button type="primary"><a-icon type="sync" />应用配置</a-button>
          </div>
        </div>
      </div>
    </template>
    <template v-slot:content v-if="GetDetailStatus">
      <div class="page-header-product-num">
        <div class="content">
          <div class="content-title">
            设备数量 {{ deviceNum }}
            <a-button type="link">
              查看
            </a-button>
          </div>
        </div>
      </div>
    </template>
    <div v-if="GetRouteShow">
      <a-card :bordered="false">
        <com-search-form :formItems="formItems"></com-search-form>

        <div class="table-operator">
          <a-button type="primary" icon="plus" @click="handleAdd">新建</a-button>
          <a-divider type="vertical" />
          <a-upload
            name="file"
            :multiple="true"
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          >
            <a-button> <a-icon type="upload" /> 快速导入 </a-button>
          </a-upload>
        </div>
      </a-card>
      <div class="ant-pro-pages-list-applications-filterCardList">
        <a-list :loading="loading" :data-source="productAllList" :grid="{ gutter: 24, xl: 4, lg: 3, md: 3, sm: 2, xs: 1 }" style="margin-top: 24px;">
          <a-list-item slot="renderItem" slot-scope="item" :key="item.id">
            <a-card :body-style="{ paddingBottom: '20px' }" :hoverable="true">
              <a-card-meta :title="item.name">
                <template slot="avatar">
                  <a-avatar size="small" :src="item.photoUrl ? item.photoUrl : require('../../../assets/product_avater.png')" style="width: 40px; height: 40px; line-height: 40px; font-size: 18px;"/>
                </template>
                <template slot="description">
                  {{ item.describe }}
                </template>
              </a-card-meta>
              <template slot="actions">
                <a-tooltip title="查看">
                  <a-icon type="eye" @click="() => $router.push({ path: `/device/product/save/${item.id}` })"/>
                </a-tooltip>
                <a-tooltip title="编辑">
                  <a-icon type="edit" />
                </a-tooltip>
                <a-tooltip title="下载">
                  <a-icon type="download" />
                </a-tooltip>
                <a-dropdown>
                  <a class="ant-dropdown-link">
                    <a-icon type="ellipsis" />
                  </a>
                  <a-menu slot="overlay">
                    <a-menu-item :key="'manage'">
                      <a-popconfirm
                        placement="topRight"
                        :title="item.state !== 0 ? '确定停用此组件吗？' : '确定发布此组件吗？'"
                        @confirm="manageProduct(item.state, item)"
                      >
                        <a-button :icon="item.state !== 0 ? 'close' : 'check'" type="link">
                          {{ item.state !== 0 ? '停用' : '发布' }}
                        </a-button>
                      </a-popconfirm>
                    </a-menu-item>
                    <a-menu-item v-if="item.state === 0" :key="2">
                      <a-popconfirm
                        placement="topRight"
                        :title="'确定删除此组件吗？'"
                        @confirm="delProduct(item.state, item)"
                      >
                        <a-button icon="delete" type="link">
                          删除
                        </a-button>
                      </a-popconfirm>
                    </a-menu-item>
                    <a-menu-item v-else :key="'del'">
                      <a-tooltip placement="bottom" title="该产品已发布，无法删除">
                        <a-utton icon="stop" type="link">
                          删除
                        </a-utton>
                      </a-tooltip>
                    </a-menu-item>
                  </a-menu>
                </a-dropdown>
              </template>
              <div class="">
                <card-info :product-num="deviceCount[item.id]" :product-state="item.state" :product-type="item.deviceType.text"></card-info>
              </div>
            </a-card>
          </a-list-item>
        </a-list>
      </div>
    </div>
    <router-view></router-view>
  </page-header-wrapper>
</template>

<script>
import CardInfo from './components/CardInfo'
import ComSearchForm from '@/components/SearchForm'
// import apis from '@/api'
import { tableMixin } from '@/core/mixins/tableMixin'
// import { HandleProductList } from './service'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'DeviceProduct',
  mixins: [tableMixin],
  components: {
    CardInfo,
    ComSearchForm
  },
  data () {
    return {
      // productAllList: [],
      // deviceCount: {},
      deviceNum: 10,
      selectedRowKeys: [],
      selectedRows: [],
      formItems: [
        {
          label: '产品名称',
          key: 'name$LIKE',
          type: 'string'
        },
        {
          label: '所属品类',
          key: 'classifiedId$LIKE',
          type: 'treeSelect',
          options: {
            data: [
              {
                title: 'Node1',
                value: '0-0',
                key: '0-0',
                children: [
                  {
                    value: '0-0-1',
                    key: '0-0-1',
                    scopedSlots: {
                      // custom title
                      title: 'title'
                    }
                  },
                  {
                    title: 'Child Node2',
                    value: '0-0-2',
                    key: '0-0-2'
                  }
                ]
              },
              {
                title: 'Node2',
                value: '0-1',
                key: '0-1'
              }
            ],
            dropdownStyle: { maxHeight: 500 }
          }
        },
        {
          label: '产品类型',
          key: 'deviceType',
          type: 'list',
          options: {
            data: [
              { id: 'device', name: '直连设备' },
              { id: 'childrenDevice', name: '网关子设备' },
              { id: 'gateway', name: '网关设备' }
            ],
            mode: 'tags'
          }
        },
        {
          label: '消息协议',
          key: 'messageProtocol$IN',
          type: 'list',
          options: {
            data: [
              { id: 'device', name: '直连设备' },
              { id: 'childrenDevice', name: '网关子设备' },
              { id: 'gateway', name: '网关设备' }
            ],
            mode: 'tags'
          }
        }
      ],
      searchParam: { pageSize: 8, terms: location?.query?.terms, sorts: { field: 'id', order: 'desc' } }

    }
  },
  watch: {
    $route: {
      handler (newRoute, oldRoute) {
        if (this.$route.path.includes('/device/product/save')) {
          const params = this.$route.params.id
          this.deviceNum = this.deviceCount[params]
        }
      }
    },
    deviceCount (newVal, oldVal) {
      if (newVal) {
        const params = this.$route.params.id
        this.deviceNum = this.deviceCount[params]
      }
    }
  },
  computed: {
    ...mapGetters('device', ['productAllList', 'deviceCount']),
    rowSelection () {
      return {
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    },
    GetMetaTitle () {
      if (this.$route.path.includes('/device/product/save')) {
        return `产品：${this.$route.params.id}`
      }
      // return this.$route.meta.title || ''
      return '产品管理'
    },
    GetDetailStatus () {
      return this.$route.path.includes('/device/product/save')
    },
    GetRouteShow () {
      return this.$route.path === '/device/product'
    },
    // eslint-disable-next-line vue/return-in-computed-property
    getState () {
      if (this.$route.path.includes('/device/product/save')) {
        const data = this.productAllList.length ? this.productAllList.filter(i => i.id === this.$route.params.id)[0] : {}
        if (!Object.keys(data).length) {
          return ''
        }
        return data.state
      }
    }
  },
  mounted () {
    this.getProductList()
  },
  methods: {
    ...mapActions('device', ['getProductAllList', 'getDeviceCount']),
    async getProductList () {
      if (this.productAllList.length !== 0) {
        this.loading = false
        return
      }
      const result = await this.getProductAllList({
        pageSize: this.pageSize,
        terms: this.searchParam.terms,
        sorts: this.searchParam.sorts
      })
      if (result && result !== undefined) {
        await this.getDeviceCount().then(result => {
          if (result) {
            this.loading = false
          }
        })
        // const res = await this.getDeviceCount()
        // if (res) {
        //   this.loading = false
        //   console.log(this.deviceCount['test'])
        // }
      }
      // apis.deviceProduct.GetProductList({
      //   pageSize: this.pageSize,
      //   terms: this.searchParam.terms,
      //   sorts: this.searchParam.sorts
      // }).then(async (res) => {
      //   const resolve = await HandleProductList(res)
      //   this.productAllList = resolve.productData
      //   this.deviceCount = resolve.deviceCount
      //   this.loading = false
      // }).catch(() => {
      //   this.loading = false
      // })
    },
    handleAdd () {
      this.$router.push({
        path: '/device/product/add'
      })
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    manageProduct (state, item) {
      if (state === 0) {
        // deploy(item)
      } else {
        // unDeploy(item)
      }
    },
    delProduct (state, item) {
      if (item.state === 0 && Number(this.deviceCount[item.id]) === 0) {
        // handleDelete(item);
      } else {
        this.$message.error('产品以发布，无法删除')
      }
    }
  }
}
</script>
<style lang="less" scoped>
  /deep/ .ant-page-header-heading {
    display: flex;
    justify-content: flex-start;
  }
  /deep/ .ant-page-header-heading-title {
    flex-grow: 0;
  }
  /deep/ .ant-page-header-heading-extra {
    flex-grow: 5;
  }
  .page-header-extra{
    .content{
      display: flex !important;
      justify-content: space-between;
    }
  }
</style>
