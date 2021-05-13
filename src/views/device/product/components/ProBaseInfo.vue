<template>
  <a-form :form="form" :label-col="{ span: 5 }" :wrapper-col="{ span: 12 }">
    <a-form-item label="图标" v-if="showIcon">
      <div>
        <div>
          <a-avatar :size="80" :src="require('../../../../assets/product_avater.png')" />
        </div>
        <div style="margin-top:10px;margin-left:10px">
          <a-upload
            v-bind="uploadOptions"
            @change="uploadAvatar"
          >
            <a-button> <a-icon type="upload" /> 更换图片 </a-button>
          </a-upload>
        </div>
      </div>
    </a-form-item>
    <a-form-item label="产品ID">
      <a-input
        v-decorator="['id', {
          rules: [
            { required: true, message: '请输入产品ID' },
            { max: 64, message: '产品ID不超过64个字符' },
            { pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'), message: '产品ID只能由数字、字母、下划线、中划线组成' }
          ]
        }]"
      />
    </a-form-item>
    <a-form-item label="产品名称">
      <a-input
        v-decorator="[
          'name',
          {
            rules: [
              { required: true, message: '请输入产品名称' },
              { max: 200, message: '产品名称不超过200个字符' }
            ]
          },
        ]"
      />
    </a-form-item>
    <a-form-item label="所属品类">
      <a-cascader
        @click="setClassifiedData"
        :field-names="{label: 'name', value: 'id', children: 'children'}"
        placeholder="点击选择品类"
        :options="classified"
        style="width: 100%"
        :popupVisible="false"
        v-decorator="['classifiedId', {
          rules: [
            { required: true, message: '请选择所属品类' }
          ]
        }]"
      />
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
      label="消息协议"
    >
      <a-select
        style="width: 100%"
        placeholder="请选择消息协议"
        v-decorator="['messageProtocol', {
          rules: [
            { required: true, message: '请选择消息协议' }
          ]
        }]"
        @change="setMessage"
      >
        <a-select-option v-for="(item, index) in MessageOptions" :key="item.id + index" :value="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item
      label="传输协议"
    >
      <a-select
        style="width: 100%"
        placeholder="请选择传输协议"
        v-decorator="['transportProtocol', {
          rules: [
            { required: true, message: '请选择传输协议' }
          ]
        }]"
      >
        <a-select-option v-for="(item, index) in transportOptions" :key="item.id + index" :value="item.id">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <!-- <a-form-item
      v-decorator="['label', {
        rules: [
          { required: false }
        ]
      }]"
    >
      <span slot="label">
        存储策略&nbsp;
        <a-tooltip title="使用指定的存储策略来存储设备数据">
          <a-icon type="question-circle-o" />
        </a-tooltip>
      </span>
      <a-select style="width: 100%" placeholder="请选择传输协议">
      </a-select>
    </a-form-item> -->
    <a-form-item
      label="设备类型"
    >
      <a-radio-group
        name="radioGroup"
        @change="setDeviceType"
        v-decorator="['deviceType', {
          rules: [
            { required: true, message: '请选择设备类型' }
          ]
        }]"
      >
        <a-radio value="device">直连设备</a-radio>
        <a-radio value="childrenDevice">网关子设备</a-radio>
        <a-radio value="gateway">网关设备</a-radio>
      </a-radio-group>
    </a-form-item>
    <a-form-item label="描述" >
      <a-textarea
        v-decorator="['describe', {
          rules: [
            { required: false }
          ]
        }]"
        placeholder="请输入描述"
        rows="4"
      />
    </a-form-item>
    <classfied :visiable="classifiedVisible" :chooseData="chooseData" @select="selectClassfied" @close="closeDrawer" ></classfied>
  </a-form>
</template>

<script>
  import ProductAddClassfied from '../add/classified'
  import { uploadMixin } from '@/core/mixins/uploadMixin'
  import apis from '@/api'
  export default {
    name: 'ProBaseInfo',
    mixins: [uploadMixin],
    props: {
      showIcon: {
        type: Boolean,
        default: false
      }
    },
    components: {
      'classfied': ProductAddClassfied
    },
    data () {
      return {
        form: this.$form.createForm(this, { name: 'ProBaseInfoTable' }),
        classified: [],
        classifiedVisible: false,
        chooseData: {},
        MessageOptions: [],
        MessageType: '',
        transportOptions: [],
        transportType: '',
        deviceType: '',
        defaultMetadata: '{"events":[],"properties":[],"functions":[],"tags":[]}'

      }
    },
    mounted () {
      this.InitData()
    },
    watch: {
      MessageType: {
        async handler (newVal, oldVal) {
          switch (newVal) {
            case 'jetlinks.v1.0':
              await apis.deviceProduct.GetProtocolTransports(this.MessageType).then(res => {
                this.transportOptions = res.result
              })
              break
            default:
              break
          }
        }
      }
    },
    methods: {
      InitData () {
        apis.deviceProduct.GetMessageList().then(res => {
          this.MessageOptions = res.result
        })
      },
      setClassifiedData () {
        this.classifiedVisible = true
      },
      closeDrawer () {
        this.classifiedVisible = false
      },
      selectClassfied (data) {
        this.chooseData = data
        this.classifiedVisible = false
        this.classified = [{
          name: data.superParentName,
          id: data.categoryId[0],
          children: [{
            name: data.parentName,
            id: data.categoryId[1],
            children: [
              {
                name: data.name,
                id: data.categoryId[2]
              }
            ]
          }]
        }]
        this.form.setFieldsValue({ 'classifiedId': data.categoryId })
      },
      setMessage (value) {
        this.MessageType = value
      },
      setDeviceType (e) {
        this.deviceType = e.target.value
      },
      addProduct (photoUrl) {
        const {
          form: { validateFields }
        } = this
        validateFields((err, fileValue) => {
          if (!err) {
            const protocol = this.MessageOptions.find(i => i.id === fileValue.messageProtocol) || {}
            const data = {
              ...fileValue,
              photoUrl: photoUrl || '',
              orgId: '',
              protocolName: protocol.name,
              state: 0,
              metadata: this.defaultMetadata,
              classifiedId: this.chooseData.id,
              classifiedName: this.chooseData.name
            }
            apis.deviceProduct.SaveProduct(data).then(res => {
              if (res.status === 200) {
                const { result } = res
                const listData = []
                listData.push(result)
                this.$store.commit('device/SET_PRODUCT_ALLLIST', listData)
                this.$router.push({
                  path: `/device/product/save/${result.id}`
                })
              }
            // eslint-disable-next-line handle-callback-err
            }).catch(err => {
              this.$message.info(err)
            })
          }
        })
      }

    }
  }
</script>

<style lang="scss" scoped>

</style>
