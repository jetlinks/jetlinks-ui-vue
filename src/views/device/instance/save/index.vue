<template>
  <com-modal :width="'520px'" :title="GetTitle" :visible="showModal" @SetModalOk="SetModalOk" @SetModalCancel="SetModalCancel">
    <a-form :labelCol="{ span: 4 }" :wrapperCol="{ span: 20 }">
      <a-form-item label="设备id">
        <a-input
          placeholder="请输入设备id"
          v-decorator="['id', {
            rules: [
              { required: true, message: '请输入设备id' },
              { max: 64, message: '设备ID不超过64个字符' },
              { pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'), message: '产品ID只能由数字、字母、下划线、中划线组成' }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item label="设备名称">
        <a-input
          placeholder="请输入设备名称"
          v-decorator="['name', {
            rules: [
              { required: true, message: '请输入设备名称' },
              { max: 200, message: '设备名称不超过200个字符' }
            ]
          }]"
        />
      </a-form-item>
      <a-form-item
        label="产品"
        v-decorator="['productId', {
          rules: [
            { required: true }
          ]
        }]"
      >
        <a-select style="width: 100%" placeholder="请选择产品" >
          <a-select-opt-group>
            <a-select-option value="jack">
              int
            </a-select-option>
            <a-select-option value="lucy">
              long
            </a-select-option>
          </a-select-opt-group>
        </a-select>
      </a-form-item>
      <a-form-item label="所属机构">
        <a-tree-select
          show-search
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="根据机构名称模糊查询"
          allow-clear
          tree-default-expand-all
          v-decorator="['orgId', {
            rules: [
              { required: false }
            ]
          }]"
        >
          <a-tree-select-node key="0-1" value="parent 1" title="parent 1">
            <a-tree-select-node key="0-1-1" value="parent 1-0" title="parent 1-0">
              <a-tree-select-node key="random" :selectable="false" value="leaf1" title="my leaf" />
              <a-tree-select-node key="random1" value="leaf2" title="your leaf" />
            </a-tree-select-node>
            <a-tree-select-node key="random2" value="parent 1-1" title="parent 1-1">
              <a-tree-select-node key="random3" value="sss">
                <b slot="title" style="color: #08c">sss</b>
              </a-tree-select-node>
            </a-tree-select-node>
          </a-tree-select-node>
        </a-tree-select>
      </a-form-item>
      <a-form-item
        label="说明"
        v-decorator="['describe', {
          rules: [
            { required: false }
          ]
        }]"
      >
        <a-textarea placeholder="请输入至少五个字符" rows="4"/>
      </a-form-item>
    </a-form>
  </com-modal>
</template>

<script>
  import ComModal from '@/components/Modal'
  export default {
    name: 'InsSave',
    components: {
      ComModal
    },
    props: {
      type: {
        type: String,
        default: 'add'
      },
      showModal: {
        type: Boolean,
        default: false
      },
      deviceDetailData: {
        type: Object,
        default: () => {}
      }
    },
    computed: {
      GetTitle () {
        return this.type === 'add' ? '新增设备' : '编辑设备'
      }
    },
    methods: {
      SetModalOk () {
        this.$emit('SetModalOk')
        // this.showModal = true
      },
      SetModalCancel () {
        this.$emit('SetModalCancel')
        // this.showModal = false
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
