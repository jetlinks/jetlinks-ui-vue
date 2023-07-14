<template>
  <DataTableArray
      v-if="type === 'array'"
      v-model:value="myValue.elementType"
      :unitOptions="unitOptions"
      placement="topRight"
      @confirm="valueChange"
  >
    <ModelButton />
  </DataTableArray>
  <DataTableObject
      v-else-if="type === 'object' && showOther"
      :value="myValue.properties"
      placement="topRight"
      :onAdd="objectAdd"
      :columns="columns"
      @confirm="valueChange"
  >
    <template #valueType="{ data }">
      {{ TypeStringMap[data.record.valueType?.type] }}
    </template>
    <template #config="{ data }">
      <OtherConfigInfo :value="data.record.valueType"></OtherConfigInfo>
    </template>
    <ModelButton />
  </DataTableObject>
  <DataTableEnum
      v-else-if="type === 'enum'"
      v-model:value="myValue"
      placement="topRight"
      @confirm="valueChange"
  >
    <ModelButton />
  </DataTableEnum>
  <DataTableBoolean
      v-else-if="type === 'boolean'"
      v-model:value="myValue"
      placement="topRight"
      @confirm="valueChange"
  >
    <ModelButton />
  </DataTableBoolean>
  <DataTableDouble
      v-else-if="['float', 'double'].includes(type)"
      :options="unitOptions"
      :showUnit="false"
      v-model:value="myValue"
      placement="topRight"
      @confirm="valueChange"
  >
    <ModelButton />
  </DataTableDouble>
  <DataTableInteger
      v-else-if="['int', 'long'].includes(type)  && showOther"
      :options="unitOptions"
      v-model:value="myValue.unit"
      placement="topRight"
      @confirm="valueChange"
  >
    <ModelButton />
  </DataTableInteger>
  <DataTableFile
      v-else-if="type === 'file'"
      v-model:value="myValue.fileType"
      placement="topRight"
      @confirm="valueChange"
  >
    <ModelButton />
  </DataTableFile>
  <DataTableDate
      v-else-if="type === 'date'"
      v-model:value="myValue.format"
      placement="topRight"
      @confirm="valueChange"
  >
    <ModelButton />
  </DataTableDate>
  <DataTableString
      v-else-if="['string', 'password'].includes(type)"
      v-model:value="myValue.maxLength"
      placement="topRight"
  >
    <ModelButton />
  </DataTableString>
  <span v-else>
    无
  </span>
</template>

<script setup lang="ts" name="ConfigModal">
import {
  DataTableTypeSelect,
  DataTableArray,
  DataTableString,
  DataTableInteger,
  DataTableDouble,
  DataTableBoolean,
  DataTableEnum,
  DataTableFile,
  DataTableDate,
  DataTableObject,
  Form
} from 'jetlinks-ui-components';
import ValueObject from '@/views/device/components/Metadata/Base/components/Events/ValueObject.vue'
import DataTypeObjectChild from '@/views/device/components/Metadata/Base/components/DataTypeObjectChild.vue'
import OtherConfigInfo from './Events/OtherConfigInfo.vue'
import {handleTypeValue, TypeStringMap, useUnit} from "@/views/device/components/Metadata/Base/columns";
import ModelButton from '@/views/device/components/Metadata/Base/components/ModelButton.vue'
import {omit} from "lodash-es";

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
  valueKey: {
    type: String,
    default: 'valueType'
  },
  showOther: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:value'])

const formItemContext = Form.useInjectFormItemContext();
const objectAdd = () => {
  return {
    id: undefined,
    name: undefined,
    valueType: {
      type: undefined
    }
  }
}

const options = ref([])

const type = ref(props.value?.type)

const { unitOptions } = useUnit(type)

const myValue = ref(props.value)

const columns = [
  {
    title: '参数标识',
    dataIndex: 'id',
    type: 'text',
    width: 100,
    form: {
      required: true,
      rules: [
        {
          callback(rule:any,value: any, _dataSource: any[]) {
            if (value) {
              const field = rule.field.split('.')
              const fieldIndex = Number(field[1])
              const hasId = _dataSource.some((item, index) => item.id === value && fieldIndex !== index)
              if (hasId) {
                return Promise.reject('该标识已存在')
              }
              return Promise.resolve()
            }
            return Promise.reject('请输入标识')
          }
        },
        { max: 64, message: '最多可输入64个字符' },
        {
          pattern: /^[a-zA-Z0-9_\-]+$/,
          message: 'ID只能由数字、字母、下划线、中划线组成',
        },
      ]
    }
  },
  {
    title: '参数名称',
    dataIndex: 'name',
    type: 'text',
    width: 100,
    form: {
      required: true,
      rules: [{
        required: true,
        message: '请输入参数名称'
      },
        { max: 64, message: '最多可输入64个字符' }
      ]
    }
  },
  {
    title: '数据类型',
    type: 'components',
    dataIndex: 'valueType',
    components: {
      name: ValueObject,
    },
    form: {
      required: true,
      rules: [{
        validator(_: any, value: any) {
          if (!value?.type) {
            return Promise.reject('请选择数据类型')
          }
          return Promise.resolve()
        }
      }]
    },
    control(newValue: any, oldValue: any) {
      return newValue.valueType.type !== oldValue?.valueType?.type
    },
    width: 100
  },
  {
    title: '其他配置',
    type: 'components',
    dataIndex: 'config',
    components: {
      name: DataTypeObjectChild
    },
    width: 100,
    control(newValue: any, oldValue: any) {
      if (newValue && !oldValue) {
        return true
      } else if (newValue && oldValue) {
        const newObj = omit(newValue.valueType, ['type'])
        const oldObj = omit(oldValue.valueType, ['type'])
        return JSON.stringify(newObj) !== JSON.stringify(oldObj)
      }
      return false
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 60
  }
]

const valueChange = (data: any) => {
  const newObj = handleTypeValue(type.value, data)


  emit('update:value', {
    type: type.value,
    ...newObj
  })
  formItemContext.onFieldChange()
}

watch(() => JSON.stringify(props.value), () => {
  console.log(props.value)
  type.value = props.value?.type
  myValue.value = props.value
})

</script>

<style scoped>

</style>