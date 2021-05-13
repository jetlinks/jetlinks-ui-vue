<template>
  <page-header-wrapper>
    <div class="filterCardList">
      <a-card :bordered="false">
        <a-form layout="inline">
          <standard-form-row :title="'组件类型'" :block="true" :styles="{paddingBottom: '11px'}">
            <a-form-item>
              <tag-select :expandable="true">
                <a-checkable-tag v-model="checked1" >
                  Tag1
                </a-checkable-tag>
                <a-checkable-tag v-model="checked2" >
                  Tag2
                </a-checkable-tag>
                <a-checkable-tag v-model="checked3" >
                  Tag3
                </a-checkable-tag>
              </tag-select>
            </a-form-item>
          </standard-form-row>
          <standard-form-row :title="'其它选项'" :grid="true" :last="true">
            <a-row :gutter="16">
              <a-col :lg="8" :md="10" :sm="10" :xs="24">
                <a-form-item
                  label="配置名称"
                  :xs=" { span: 24 }"
                  :sm="{ span: 16 }"
                >
                  <a-input/>
                </a-form-item>
              </a-col>
            </a-row>
          </standard-form-row>
        </a-form>
      </a-card>
      <br/>
      <a-card>
        <a-button
          type="primary"
          :style="{ marginBottom: '16px' }"
          @click="setSaveVisible"
        >
          新建
        </a-button>
        <a-divider type="vertical" />
        <a-button
          style="{ marginBottom: 16 }"
        >
          导出配置
        </a-button>
        <a-divider type="vertical" />
        <a-upload
          :showUploadList="false"
          :accept="'.json'"
        >
          <a-button>
            <a-icon type="upload" />导入配置
          </a-button>
        </a-upload>
        <a-table
          rowKey="id"
          :loading="loading"
          :columns="columns"
          :data-source="data"
        >
        </a-table>
      </a-card>
    </div>
    <save-modal
      :data="ModalData"
      :visible="ModalVisible"
      :width="900"
      @submitData="submitData"
      @close="() => {
        ModalVisible = false
        ModalData = {}
      }"
    >

    </save-modal>
  </page-header-wrapper>
</template>

<script>
  import StandardFormRow from '../components/standard-form-row'
  import TagSelect from '../components/tag-select'
  import SaveModal from './save'

  const data = [
    {
      key: 'id',
      id: 'reactor-http-nio-6',
      name: 'org',
      type: 'ERROR',
      provider: 'jetlinks-platform'
    }
  ]

  export default {
    name: 'NoticeTemplate',
    components: {
      StandardFormRow,
      SaveModal,
      TagSelect
    },
    data () {
      const columns = [
        {
          dataIndex: 'id',
          title: 'ID',
          defaultSortOrder: 'descend'
        },
        {
          dataIndex: 'name',
          title: '配置名称'
        },
        {
          dataIndex: 'type',
          title: '通知类型'
        },
        {
          dataIndex: 'provider',
          title: '服务商'
        },
        {
          dataIndex: 'option',
          title: '操作',
          customRender: (text, record) => (
            <div>
              <a
                onClick={() => {
                }}
              >
                编辑
              </a>
              <a-divider type="vertical" />
              <a-popconfirm
                title="确认删除？"
              >
                <a>删除</a>
              </a-popconfirm>
              <a-divider type="vertical" />
              <a onClick={() => {}}>下载配置</a>
              <a-divider type="vertical" />
              <a
                onClick={() => {
                }}
              >
                调试
              </a>
            </div>
          )
        }
      ]
      return {
        checked1: false,
        checked2: false,
        checked3: false,
        loading: false,
        columns,
        data,
        ModalVisible: false,
        ModalData: {}
      }
    },
    methods: {
      setSaveVisible (data) {
        this.ModalVisible = true
        this.ModalData = {}
      },
      submitData (data) {
        this.ModalVisible = false
        // 提交数据XXX
      }
    }
  }
</script>

<style lang="less" scoped>
@import '../index.less';
</style>
