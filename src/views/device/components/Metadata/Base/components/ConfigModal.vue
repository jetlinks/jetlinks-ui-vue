<template>
  <DataTableArray
      v-if="type === 'array'"
      v-model:value="myValue.elementType"
      :unitOptions="options"
      placement="topRight"
      @confirm="valueChange"
  >
    <j-button>
      <AIcon type="SettingOutlined" />
      配置
    </j-button>
  </DataTableArray>
  <DataTableObject
      v-else-if="type === 'object'"
      :value="myValue.properties"
      placement="topRight"
      :onAdd="objectAdd"
      :columns="[
                { title: '参数标识', dataIndex: 'id', type: 'text', width: 100 },
                { title: '参数名称', dataIndex: 'name', type: 'text', width: 100 },
                {
                    title: '数据类型',
                    type: 'components',
                    dataIndex: 'valueType',
                    components: {
                      name: ValueObject,
                      props: {
                        filter: ['object']
                      }
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
                  width: 100
                },
                {
                  title: '操作',
                  dataIndex: 'action',
                  width: 60
                }
            ]"
      @confirm="valueChange"
  >
    <template #valueType="{ data }">
      {{ data.record.valueType?.type }}
    </template>
    <template #config="{ data }">
      <OtherConfigInfo :value="data.record.valueType"></OtherConfigInfo>
    </template>
    <j-button>
      <AIcon type="SettingOutlined" />
      配置
    </j-button>
  </DataTableObject>
  <DataTableEnum
      v-else-if="type === 'enum'"
      v-model:value="myValue"
      placement="topRight"
      @confirm="valueChange"
  >
    <j-button>
      <AIcon type="SettingOutlined" />
      配置
    </j-button>
  </DataTableEnum>
  <DataTableBoolean
      v-else-if="type === 'boolean'"
      v-model:value="myValue"
      placement="topRight"
      @confirm="valueChange"
  >
    <j-button>
      <AIcon type="SettingOutlined" />
      配置
    </j-button>
  </DataTableBoolean>
  <DataTableDouble
      v-else-if="['float', 'double'].includes(type)"
      :options="options"
      v-model:value="myValue"
      placement="topRight"
      @confirm="valueChange"
  >
    <j-button>
      <AIcon type="SettingOutlined" />
      配置
    </j-button>
  </DataTableDouble>
  <DataTableInteger
      v-else-if="['int', 'long'].includes(type)"
      :options="options"
      v-model:value="myValue.unit"
      placement="topRight"
      @confirm="valueChange"
  >
    <j-button>
      <AIcon type="SettingOutlined" />
      配置
    </j-button>
  </DataTableInteger>
  <DataTableFile
      v-else-if="type === 'file'"
      v-model:value="myValue.fileType"
      placement="topRight"
      @confirm="valueChange"
  >
    <j-button>
      <AIcon type="SettingOutlined" />
      配置
    </j-button>
  </DataTableFile>
  <DataTableDate
      v-else-if="type === 'date'"
      v-model:value="myValue.format"
      placement="topRight"
      @confirm="valueChange"
  >
    <j-button>
      <AIcon type="SettingOutlined" />
      配置
    </j-button>
  </DataTableDate>
  <DataTableString
      v-else-if="['string', 'password'].includes(type)"
      v-model:value="myValue.maxLength"
      placement="topRight"
  >
    <j-button>
      <AIcon type="SettingOutlined" />
      配置
    </j-button>
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
} from 'jetlinks-ui-components';
import ValueObject from '@/views/device/components/Metadata/Base/components/Events/ValueObject.vue'
import DataTypeObjectChild from '@/views/device/components/Metadata/Base/components/DataTypeObjectChild.vue'
import OtherConfigInfo from './Events/OtherConfigInfo.vue'

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
  valueKey: {
    type: String,
    default: 'valueType'
  }
})

const emit = defineEmits(['update:value'])

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

const type = ref(props.value?.[props.valueKey]?.type)

const myValue = ref(props.value?.[props.valueKey])

const valueChange = () => {

}

watch(() => JSON.stringify(props.value), () => {
  console.log(props.value)
  type.value = props.value?.[props.valueKey]?.type
  myValue.value = props.value?.[props.valueKey]
})

</script>

<style scoped>

</style>