<template>
  <div id="components-form-demo-vuex">
    <a-form :form="form">
      <a-form-item label="属性标识">
        <a-input
          placeholder="请输入属性标识"
          :disabled="DrawerData.id? true: false"
          v-decorator="['id', {
            rules: [
              { required: true, message: '请输入属性标识' },
              { max: 64, message: '属性标识不超过64个字符' },
              { pattern: new RegExp(/^[0-9a-zA-Z_\-]+$/, 'g'), message: '属性标识只能由数字、字母、下划线、中划线组成' }
            ],
            initialValue: DrawerData.id ? DrawerData.id : undefined
          }]"
        />
      </a-form-item>
      <a-form-item label="属性名称">
        <a-input
          placeholder="请输入属性标识"
          v-decorator="['name', {
            rules: [
              { required: true, message: '请输入属性名称' },
              { max: 200, message: '属性名称不超过200个字符' }
            ],
            initialValue: DrawerData.name ? DrawerData.name : undefined
          }]"
        />
      </a-form-item>
      <!-- <a-form-item label="产品名称">
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
      </a-form-item> -->
      <a-form-item
        label="数据类型"
      >
        <a-select
          style="width: 100%"
          placeholder="请选择数据类型"
          v-decorator="['valueType.type', {
            rules: [
              { required: true, message: '请选择' }
            ],
            initialValue:DrawerData.valueType?DrawerData.valueType.type : undefined
          }]"
          @change="handleChangeType"
        >
          <a-select-opt-group>
            <span slot="label">基本类型</span>
            <a-select-option value="int">int(整数型)</a-select-option>
            <a-select-option value="long">long(长整数型)</a-select-option>
            <a-select-option value="float">float(单精度浮点型)</a-select-option>
            <a-select-option value="double">double(双精度浮点数)</a-select-option>
            <a-select-option value="string">text(字符串)</a-select-option>
            <a-select-option value="boolean">bool(布尔型)</a-select-option>
          </a-select-opt-group>
          <a-select-opt-group>
            <span slot="label">其他类型</span>
            <a-select-option value="date">date(时间型)</a-select-option>
            <a-select-option value="enum">enum(枚举)</a-select-option>
            <a-select-option value="array">array(数组)</a-select-option>
            <a-select-option value="object">object(结构体)</a-select-option>
            <a-select-option value="file">file(文件)</a-select-option>
            <a-select-option value="password">password(密码)</a-select-option>
            <a-select-option value="geoPoint">geoPoint(地理位置)</a-select-option>
          </a-select-opt-group>
        </a-select>
      </a-form-item>
      <value-type
        ref="types"
        v-if="showTypes"
        :type="valueType"
        :typeData="valueTypeData"
      ></value-type>
      <a-form-item label="是否只读">
        <a-radio-group
          v-decorator="[
            'expands.readOnly',
            {
              rules: [
                { required: true , message: '请选择是否只读'},
              ],
              initialValue: DrawerData.expands ? DrawerData.expands.readOnly : undefined
            },
          ]"
        >
          <a-radio value="true">
            是
          </a-radio>
          <a-radio value="false">
            否
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        label="描述"
      >
        <a-textarea
          placeholder="请输入描述"
          rows="4"
          v-decorator="['description', {
            rules: [
              { required: false }
            ],
            initialValue: DrawerData.description ? DrawerData.description : undefined
          }]"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
  import ValueType from './ValueType'
  import { cloneDeep } from 'lodash'
  import { mapGetters } from 'vuex'
  import apis from '@/api'
  export default {
    name: 'DefineAttribute',
    props: {
      edititem: {
        type: Object,
        default: () => {}
      }
    },
    components: {
      ValueType
    },
    data () {
      return {
        form: this.$form.createForm(this, { name: 'DefineEventForm' }),
        DrawerData: {},
        valueTypeData: {},
        valueType: '',
        showTypes: false
      }
    },
    mounted () {
      this.InitData(this.edititem)
    },
    watch: {
      edititem: {
        handler (newVal, oldVal) {
          this.InitData(newVal)
        }
      }
    },
    computed: {
      ...mapGetters('device', ['productDetailData']),
      getDeviceId () {
        return this.$route.params.id
      }
    },
    methods: {
      InitData (data) {
        if (Object.keys(data).length === 0) {
          this.clearData()
          return
        }
        this.DrawerData = cloneDeep(data)
        this.valueTypeData = this.DrawerData.valueType
        this.valueType = this.DrawerData.valueType.type
        this.showTypes = true
      },
      clearData () {
        this.form.resetFields()
        this.DrawerData = {}
        this.valueTypeData = {}
        this.valueType = ''
        this.showTypes = false
      },
      handleChangeType (value) {
        this.showTypes = true
        this.valueType = value
      },
      submitData () {
        const {
          form: { validateFields }
        } = this
        validateFields((err, fileValue) => {
          if (!err) {
            console.log('fileValue!!!', fileValue)

            if (this.valueType === 'object') {
              fileValue.valueType['properties'] = this.$refs.types.JsonData
            }
            const deviceInfo = this.productDetailData(this.getDeviceId)[0]
            const metadata = JSON.parse(deviceInfo.metadata)
            const { properties } = metadata
            let addstatus = false
            properties.forEach((element, index) => {
              if (element.id === fileValue.id) {
                addstatus = true
                properties[index] = { ...fileValue }
              }
            })
            if (!addstatus) {
              properties.push(fileValue)
            }
            apis.deviceProduct.editProduct({
              ...deviceInfo,
              metadata: JSON.stringify(metadata)
            }).then(res => {
              if (res.status === 200) {
                this.$message.info('更新成功')
                this.clearData()
                this.$emit('onEditItem', metadata)
              }
            }).catch(err => {
              this.$message.info('updateData_Err', err)
            })
          }
        })
      }
    }
  }
</script>

<style lang="less" scoped>
#components-form-demo-vuex .language-bash {
  max-width: 400px;
  border-radius: 15px;
  margin-top: 24px;
}
</style>
