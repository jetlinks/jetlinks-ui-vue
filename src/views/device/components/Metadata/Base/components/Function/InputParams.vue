<template>
  <DataTableObject :value="value" :columns="columns" :onAdd="addItem" width="700px" @confirm="confirm" placement="bottomRight">
    <template #valueType="{ data }">
      <span>{{ TypeStringMap[data.record.valueType?.type] }}</span>
    </template>
    <template #required="{ data }">
      <span>{{ data.record.expands?.required ? "必填": '不必填' }}</span>
    </template>
    <template #config="{ data }">
      <ConfigModal v-model:value="data.record.valueType" :showOther="false" />
    </template>
    <PermissionButton
        key="properties"
        :has-permission="hasPermission"
        type="link"
    >
      <AIcon type="SettingOutlined" />
      配置
    </PermissionButton>
  </DataTableObject>
</template>

<script setup lang="ts" name="InputParams">
import type { PropType } from 'vue';
import ConfigModal from '@/views/device/components/Metadata/Base/components/ConfigModal.vue'
import {
    DataTableObject, Form
} from 'jetlinks-ui-components';
import { ConstraintSelect, ValueObject } from '../index'
import {TypeStringMap, validatorConfig} from "../../columns";
import ModelButton from '@/views/device/components/Metadata/Base/components/ModelButton.vue'
import {omit} from "lodash-es";

type Emits = {
    (e: 'update:value', data: Record<string, any>): void;
    (e: 'change', data: string): void;
};

const emit = defineEmits<Emits>();
const props = defineProps({
    value: {
        type: Array,
        default: () => [],
    },
    placeholder: {
        type: String,
        default: '请选择',
    },
    options: {
        type: Array as PropType<{ label: string; value: string }[]>,
        default: () => [],
    },
  hasPermission: String,
});
const formItemContext = Form.useInjectFormItemContext();

const addItem = () => {
  return {
    id: undefined,
    name: undefined,
    valueType: {

    },
    expands: {
      required: false
    }
  }
}

const columns = ref([
  {
    title: '参数标识',
    dataIndex: 'id',
    type: 'text',
    placement: 'Left',
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
          message: '标识只能由数字、字母、下划线、中划线组成',
        },
      ]
    }
  },
  {
    title: '参数名称',
    dataIndex: 'name',
    type: 'text',
    form: {
      required: true,
      rules: [{ required: true, message: '请输入名称'}, { max: 64, message: '最多可输入64个字符' },]
    }
  },
  {
    title: '填写约束',
    dataIndex: 'required',
    type: 'components',
    width: 100,
    components: {
      name: ConstraintSelect,
    },
    control(newValue: any, oldValue: any) {
      return newValue.expands.required !== oldValue?.expands?.required
    },
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
  },
  {
    title: '其他配置',
    dataIndex: 'config',
    form: {
      required: true,
      rules: [{
        callback(rule:any,value: any, dataSource: any[]) {
          const field = rule.field.split('.')
          const fieldIndex = Number(field[1])

          const values = dataSource.find((item, index) => index === fieldIndex)
          return validatorConfig(values.valueType)
        }
      }]
    },
    control(newValue: any, oldValue: any) {
      if (newValue && !oldValue) {
        return true
      } else if (newValue && oldValue) {
        const newObj = omit(newValue.valueType, ['type', 'required'])
        const oldObj = omit(oldValue.valueType, ['type', 'required'])
        return JSON.stringify(newObj) !== JSON.stringify(oldObj)
      }
      return false
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 60
  },
])

// const dataSource = ref(props.value.inputs);

// watch(
//     () => JSON.stringify(props.value),
//     (newV) => {
//       console.log('inputParams-change', props.value.inputs)
//       dataSource.value = props.value.inputs;
//     },
//     { immediate: true },
// );

const confirm = (v: any) => {
  console.log('inputParams',v)
  emit('update:value', v)
  formItemContext.onFieldChange()
}
</script>

<style scoped lang="less">
.input-params{
  display: flex;
  gap: 12px;
  align-items: center;

  .input-params-text {
    flex: 1;
  }

  :deep(.j-data-table-config--icon) {
    padding-right: 12px;
  }
}
</style>
