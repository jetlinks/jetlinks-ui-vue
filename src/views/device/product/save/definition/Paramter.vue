<template>
  <a-drawer
    title="新增参数"
    placement="right"
    :closable="false"
    @close="onClose"
    visible
    width="30%"
  >
    <a-form :form="form" class="paramterForm">
      <a-form-item label="参数标识">
        <a-input
          placeholder="请输入属性标识"
          v-decorator="['id',{
            initialValue: DrawerData.id ? DrawerData.id : undefined
          }]"
        />
      </a-form-item>
      <a-form-item label="参数名称">
        <a-input
          placeholder="请输入参数名称"
          v-decorator="['name',{
            initialValue: DrawerData.name ? DrawerData.name : undefined
          }]"
        />
      </a-form-item>
      <a-form-item label="数据类型">
        <a-select
          style="width: 100%"
          placeholder="请选择数据类型"
          v-decorator="['valueType.type',{
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
        v-if="showTypes"
        :type="valueType"
        :typeData="valueTypeData"
      ></value-type>
      <a-form-item label="描述">
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
    <div
      :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }"
    >
      <a-button :style="{ marginRight: '8px' }" @click="onClose">
        关闭
      </a-button>
      <a-button type="primary" @click="setObjectDada">
        保存
      </a-button>
    </div>
  </a-drawer>
</template>

<script>
  import { cloneDeep } from 'lodash'
  export default {
    name: 'DefineParamter',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      paramsPos: {
        type: Number,
        default: 0
      },
      paramsData: {
        type: Object,
        default: () => {}
      }
    },
    data () {
      return {
        form: this.$form.createForm(this, { name: 'DefineParamterForm' + Math.round() * 10 }),
        valueType: '',
        showTypes: false,
        DrawerData: {}
      }
    },
    mounted () {
      this.InitData(this.paramsData)
    },
    watch: {
      paramsData: {
        handler (newVal, oldVal) {
          this.InitData(newVal)
        }
      }
    },
    methods: {
      InitData (data) {
        console.log('paramsData', data)
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
        console.log('this.valueType', value)
        this.showTypes = true
        this.valueType = value
      },
      onClose () {
        this.showTypes = false
        this.$emit('close')
      },
      setObjectDada () {
        const {
          form: { validateFields }
        } = this
        validateFields((err, fileValue) => {
          if (!err) {
            console.log('@@@ fileValue @@@@', fileValue)
            if (Object.keys(this.paramsData).length > 0) {
              this.$emit('editObjectDada', this.paramsPos, fileValue)
            } else {
              this.$emit('addObjectDada', fileValue)
              this.clearData()
            }
          }
        })
        this.showTypes = false
      }
    }
  }
</script>

<style lang="less" scoped>
 @import './index.less';
</style>
