import { cloneDeep } from 'lodash'
import { mapGetters } from 'vuex'
import apis from '@/api'

const pyhModelMixin = {
  props: {
    tabKey: {
      type: String,
      default: '1'
    },
    edititem: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
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
      this.initTypeData(this.tabKey, data)
    },
    /**
     * @described 根据类型初始化数据
     * @params {typeKey}  1 :属性定义 2 :功能定义 3 :事件定义 4 :标签定义
     */
    initTypeData (typeKey, data) {
      if (typeKey === '1') {
        this.DrawerData = cloneDeep(data)
        console.log('this.DrawerData 11111', this.DrawerData)
        this.valueTypeData = this.DrawerData.valueType
        this.valueType = this.DrawerData.valueType.type
        this.showTypes = true
      } else if (typeKey === '2') {
        this.DrawerData = cloneDeep(data)
        console.log('this.DrawerData 22222', this.DrawerData)
        this.valueTypeData = this.DrawerData.output
        this.valueType = this.DrawerData.output.type
        this.showTypes = true
        this.JsonData = cloneDeep(this.DrawerData.inputs)
      } else if (typeKey === '3' || typeKey === '4') {
        this.DrawerData = cloneDeep(data)
        console.log('this.DrawerData 33333', this.DrawerData)
        this.valueTypeData = this.DrawerData.valueType
        this.valueType = this.DrawerData.valueType.type
        this.showTypes = true
        if (this.valueType === 'object') {
          this.JsonData = cloneDeep(this.DrawerData.valueType.properties)
        }
      }
    },
    clearData () {
      this.form.resetFields()
      this.DrawerData = {}
      this.valueTypeData = {}
      this.valueType = ''
      this.showTypes = false
      // other - func
      this.JsonData = []
      this.paramsData = {}
      this.paramsPos = 0
      this.showJsonDrawer = false
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
          console.log('this.$refs.types.JsonData!!!', this.$refs.types.JsonData)
          console.log('this.$refs.types.JsonData!!!', this.JsonData)
          if (this.tabKey === '1') {
            this.submitAttrData(fileValue)
          } else if (this.tabKey === '2') {
            this.submitFuncData(fileValue)
          } else if (this.tabKey === '3') {
            this.submitEventData(fileValue)
          } else if (this.tabKey === '4') {
            this.submitTagData(fileValue)
          }
        }
      })
    },
    // todo: 提取为公共函数
    submitAttrData (fileValue) {
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
    },
    submitFuncData (fileValue) {
      // 处理输出参数
      if (this.valueType === 'object') {
        fileValue.output['properties'] = this.$refs.types.JsonData
      } else {
        fileValue.output = { ...fileValue.output, ...fileValue.valueType }
        delete fileValue.valueType
      }
      // 处理输入参数
      if (this.JsonData.length > 0) {
        fileValue.inputs = this.JsonData
      }
      // 提交数据
      const deviceInfo = this.productDetailData(this.getDeviceId)[0]
      const metadata = JSON.parse(deviceInfo.metadata)
      const { functions } = metadata
      let addstatus = false
      functions.forEach((element, index) => {
        if (element.id === fileValue.id) {
          addstatus = true
          functions[index] = { ...fileValue }
        }
      })
      if (!addstatus) {
        functions.push(fileValue)
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
    },
    submitEventData (fileValue) {
      // 处理输出参数
      if (this.valueType === 'object') {
        fileValue.valueType['properties'] = this.$refs.types.JsonData
      }

      // 提交数据
      const deviceInfo = this.productDetailData(this.getDeviceId)[0]
      const metadata = JSON.parse(deviceInfo.metadata)
      const { events } = metadata
      let addstatus = false
      events.forEach((element, index) => {
        if (element.id === fileValue.id) {
          addstatus = true
          events[index] = { ...fileValue }
        }
      })
      if (!addstatus) {
        events.push(fileValue)
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
    },
    submitTagData (fileValue) {
      // 处理输出参数
      if (this.valueType === 'object') {
        fileValue.valueType['properties'] = this.$refs.types.JsonData
      }

      // 提交数据
      const deviceInfo = this.productDetailData(this.getDeviceId)[0]
      const metadata = JSON.parse(deviceInfo.metadata)
      const { tags } = metadata
      let addstatus = false
      tags.forEach((element, index) => {
        if (element.id === fileValue.id) {
          addstatus = true
          tags[index] = { ...fileValue }
        }
      })
      if (!addstatus) {
        tags.push(fileValue)
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
  }
}

export default pyhModelMixin
