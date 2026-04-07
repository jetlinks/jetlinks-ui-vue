<template>
  <div style="display: flex; flex-direction: column; gap: 16px; height: 100%">
    <div style="flex: 1; min-height: 0; overflow-y: auto">
      <PointEditTable
          :columns="columns"
          :fieldPathMap="fieldPathMap"
          v-model:dataSource="dataSource"
          ref="tableRef"
      >
        <template #headerCell="{ title, column }">
          <template v-if="column.dataIndex === 'interval'">
            采集频率
            <a-tooltip title="仅在访问类型选择读时生效">
              <AIcon type="QuestionCircleOutlined" style="margin-left: 2px"/>
            </a-tooltip>
          </template>
          <template v-if="column.dataIndex === 'writeByteConfig'">
            非标准协议写入配置
            <a-tooltip title="仅在功能码为03且访问类型选择写时生效">
              <AIcon type="QuestionCircleOutlined" style="margin-left: 2px"/>
            </a-tooltip>
          </template>
        </template>
      </PointEditTable>
    </div>
    <div style="display: flex; gap: 16px">
      <a-button type="link" @click="addOne">新增一条</a-button>
      <a-button type="link" @click="visible = true">新增多条</a-button>
    </div>
  </div>
  <a-modal v-if="visible" open title="新增多条" :width="700" @cancel="visible = false" @ok="onSaveData">
    <a-alert
        message="快速生成多行数据, 生成行数 = (结束地址 − 起始地址 + 1) ÷ 寄存器数量，无法整除的剩余寄存器将被忽略"
        type="info"
        show-icon
        style="margin-bottom: 16px"
    />
    <a-form :model="formData" layout="vertical" ref="formRef">
      <a-form-item label="功能码" name="function" :rules="[{required: true, message: '请选择功能码'}]">
        <a-select
            v-model:value="formData.function"
            :options="functionOptions"
            placeholder="请选择功能码"
        />
      </a-form-item>
      <a-form-item label="起始地址" name="startAddress" :rules="[{required: true, message: '请输入起始地址'}]">
        <a-input-number
            style="width: 100%"
            v-model:value="formData.startAddress"
            :controls="false"
            :max="255"
            :min="0"
            :precision="0"
            placeholder="请输入起始地址"
        />
      </a-form-item>
      <a-form-item label="结束地址" name="endAddress" :rules="[{required: true, message: '请输入结束地址'}]">
        <a-input-number
            style="width: 100%"
            v-model:value="formData.endAddress"
            :controls="false"
            :max="255"
            :min="0"
            :precision="0"
            placeholder="请输入结束地址"
        />
      </a-form-item>
      <a-form-item label="寄存器数量(word)" :name="['quantity']"
                   :rules="[{required: true, message: '请输入寄存器数量'}]">
        <a-input-number v-model:value="formData.quantity" :controls="false" :max="65535" :min="1"
                        :precision="0"
                        :placeholder="$lang('MODBUS_RTU.point.20250207-7')" style="width: 100%"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script setup>
import {inject, reactive, ref, computed} from "vue";
import {PointEditTable} from '@components'
import {useLocales} from '@hooks'
import {commandRequest, queryCodecProvider, queryPointMetadata} from 'request'
import {handlePointConfigMetadata} from 'local-utils'
import {EventEmitter, randomString} from '@jetlinks-web/utils'
import {cloneDeep, set, get, omit} from 'lodash-es'

const {$lang} = useLocales('modbus_tcp')

const collector = inject('point-batch-collector-data', ref({}))
const dataSource = ref([])
const formRef = ref()
const formData = reactive({
  quantity: undefined,
  function: undefined,
  startAddress: undefined,
  endAddress: undefined,
})
const requestColumns = ref([])
const requestRecord = ref({})
const fieldPathMap = ref({})
const dataTypeOptions = ref({})
const functionOptions = ref([])
const optionsMap = new Map()

const visible = ref(false)
const tableRef = ref()

const options = computed(() => [
  {label: $lang('MODBUS_TCP.point.20250207-24'), value: 'Coils'},
  {label: $lang('MODBUS_TCP.point.20250207-25'), value: 'DiscreteInputs'},
  {label: $lang('MODBUS_TCP.point.20250207-26'), value: 'HoldingRegisters'},
  {label: $lang('MODBUS_TCP.point.20250207-27'), value: 'InputRegisters'}
])

const columns = computed(() => [
  {
    title: '名称',
    dataIndex: 'name',
    template: {
      components: 'a-input',
      props: {
        allowClear: true
      },
      check: false
    },
    ellipsis: true,
    form: {
      required: true,
      rules: [{
        asyncValidator(rule, value) {
          if (!value) {
            return Promise.reject('请输入名称')
          }
          return Promise.resolve()
        }
      }]
    },
    fixed: 'left',
    width: 200,
  },
  ...requestColumns.value,
  {
    title: '访问类型',
    dataIndex: 'accessModes',
    template: {
      components: 'AccessModes',
      props: {
        allowClear: true,
        mode: 'multiple',
      },
      getOptions(record, lastRecord) {
        const result = optionsMap.get(lastRecord.id) // 上一个的值
        optionsMap.set(record.id, result)
        EventEmitter.emit(record.id, result)
      }
    },
    ellipsis: true,
    form: {
      required: true,
      rules: [{
        asyncValidator(rule, value) {
          if (!value?.length) {
            return Promise.reject('请选择')
          }
          return Promise.resolve()
        }
      }]
    },
    width: 200,
  },
  {
    title: '采集频率',
    dataIndex: 'interval',
    template: {
      components: 'a-input',
      props: {
        allowClear: true
      },
    },
    ellipsis: true,
    form: {
      required: true,
      rules: [{
        asyncValidator(rule, value) {
          if (!value) {
            return Promise.reject('请输入')
          }
          return Promise.resolve()
        }
      }]
    },
    width: 200,
  },
  {
    title: '说明',
    dataIndex: 'description',
    template: {
      components: 'a-input',
      props: {
        allowClear: true
      },
      check: false
    },
    ellipsis: true,
    width: 220,
  },
  {
    title: '非标准协议写入配置',
    dataIndex: 'writeByteConfig',
    key: 'writeByteConfig',
    ellipsis: true,
    template: {
      components: 'a-switch',
      props: {
        allowClear: true
      }
    },
    width: 180,
  },
  {
    title: '只推送变化数据',
    dataIndex: 'features',
    key: 'features',
    ellipsis: true,
    template: {
      components: 'a-switch',
      getValue(data) {
        return data.some(key => key === 'changedOnly')
      },
      handleChange: (value, index) => {
        let _features = dataSource.value[index].features
        if (value) {
          _features = [..._features, 'changedOnly']
        } else {
          _features = _features.filter(key => key !== 'changedOnly')
        }
        return _features
      }
    },
    width: 160,
  },
  {
    title: '数据类型',
    dataIndex: 'codec',
    key: 'codec',
    ellipsis: true,
    template: {
      components: 'AccessModes',
      props: {
        parseKey: 'supportCodecs'
      },
      getOptions(record, lastRecord) {
        const result = optionsMap.get(lastRecord.id) // 上一个的值
        optionsMap.set(record.id, result)
        EventEmitter.emit(record.id, result)
      }
    },
    width: 220,
  },
  {
    title: '内存布局',
    dataIndex: 'byteLayout',
    key: 'byteLayout',
    ellipsis: true,
    template: {
      components: 'a-select',
      props: {
        style: {width: '100%'},
        options: [
          {
            "label": "AB",
            "value": "AB"
          },
          {
            "label": "BA",
            "value": "BA"
          },
          {
            "label": "AB_CD",
            "value": "AB_CD"
          },
          {
            "label": "CD_AB",
            "value": "CD_AB"
          },
          {
            "label": "BA_DC",
            "value": "BA_DC"
          },
          {
            "label": "DC_BA",
            "value": "DC_BA"
          },
          {
            "label": "AB_CD_EF_GH",
            "value": "AB_CD_EF_GH"
          },
          {
            "label": "GH_EF_CD_AB",
            "value": "GH_EF_CD_AB"
          },
          {
            "label": "BA_DC_FE_HG",
            "value": "BA_DC_FE_HG"
          },
          {
            "label": "HG_FE_DC_BA",
            "value": "HG_FE_DC_BA"
          }
        ]
      }
    },
    width: 220,
  },
])

/**
 * 初始化同上状态
 * @returns {{features: boolean, quantity: boolean, writeByteCount: boolean, byteCount: boolean, dataType: boolean, writeByteConfig: boolean, interval: boolean, memoryLayout: boolean}}
 */
const handleSames = () => {
  const _sames = {
    quantity: true,
    writeByteConfig: true,
    writeByteCount: true,
    byteCount: true,
    features: true,
    dataType: true,
    memoryLayout: true,
    interval: true,
    accessModes: true,
  }

  requestColumns.value.forEach(column => {
    if (column.dataIndex !== 'address') {
      _sames[column.dataIndex] = true
    }
  })
  return _sames
}

const handleAccessModes = (record) => {
  queryPointMetadata(collector.value.provider, record).then(resp => {
    if (resp.success) {
      const result = {
        ...resp.result,
        accessModes: resp.result.accessModes.map(item => ({label: item.text, value: item.value})),
        supportCodecs: (resp.result.supportCodecs || []).map(code => {
          return dataTypeOptions.value.find(item => item.value === code)
        }),
      }
      optionsMap.set(record.id, result)
      EventEmitter.emit(record.id, result)
    }
  })
}

const handleRecord = () => {
  const sames = handleSames()
  const record = {
    id: randomString(),
    name: undefined,
    provider: collector.value.provider,
    collectorId: collector.value.id,
    collectorName: collector.value.name,
    channelId: collector.value.channelId,
    channelName: collector.value.channelName,
    description: undefined,
    interval: 3000,
    inheritBreaker: false, // 是否继承熔断
    circuitBreaker: undefined, // 错误处理方式
    priority: undefined, // 优先级
    features: [],
    accessModes: [], // 可选值： read , write ,subscribe
    managedConfiguration: {}, // 点位管理配置
    configuration: {}, // cloneDeep(requestRecord.value),
    sames: {...sames}
  }
  if (dataSource.value.length >= 1) {
    //  默认同上
    const lastRecord = dataSource.value[dataSource.value.length - 1]

    Object.keys(sames).forEach(key => {
      const column = columns.value.find(item => item.dataIndex === key)
      const formName = column?.form?.name || key
      set(record, formName, get(lastRecord, formName))
    })

    setTimeout(() => {
      const result = optionsMap.get(lastRecord.id) // 上一个的值
      optionsMap.set(record.id, result)
      EventEmitter.emit(record.id, result)
    }, 300)
  } else {
    handleAccessModes(record)
  }
  return record
}

const onSaveData = () => {
  formRef.value.validate().then(() => {
    const arr = []
    for (let i = formData.startAddress; i <= formData.endAddress; i++) {
      arr.push({
        ...handleRecord(),
        configuration: {
          function: formData.function,
          "parameter": {
            address: i,
            quantity: formData.quantity
          }
        }
      })
    }
    dataSource.value.push(...arr)
    visible.value = false
  })
}

/**
 * 新增单条数据
 */
const addOne = () => {
  dataSource.value.push(handleRecord())
}

const getConfigMetadata = async () => {
  const resp = await commandRequest.pointConfigMetadata('modbus_tcp')
  if (resp.success) {
    const {
      values,
      columns: _columns,
      fieldPathMap: _fieldPathMap
    } = handlePointConfigMetadata(resp.result, 'configuration')
    requestColumns.value = _columns.map(item => {
      if (item.dataIndex === 'address') {
        item.template.check = false
      } else if (['function', 'quantity'].includes(item.dataIndex)) {
        if (item.dataIndex === 'function') {
          functionOptions.value = item.template.props.options
        }
        item.template.handleOptions = (record) => {
          handleAccessModes(record)
        }
      }
      item.ellipsis = true
      return item
    })
    requestRecord.value = values
    fieldPathMap.value = _fieldPathMap
  }

  queryCodecProvider().then(res => { // 数据类型
    if (res.success) {
      dataTypeOptions.value = res.result.map(item => ({
        label: item.name,
        value: item.id,
      }))
    }
  })
}

getConfigMetadata()

defineExpose({
  onSave: async () => {
    const result = await tableRef.value.onSave?.()
    if (result) {
      return result.map(i => {
        return {
          ...i,
          managedConfiguration: {
            ...i.managedConfiguration,
            byteLayout: i.byteLayout,
            codec: i.codec,
          }

        }
      })
    }
    return false
  }
})
</script>

<style lang="less" scoped>

</style>
