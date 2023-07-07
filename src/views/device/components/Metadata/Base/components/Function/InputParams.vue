<template>
  <DataTableObject v-model:value="dataSource" :columns="columns" :onAdd="addItem" width="700px" @confirm="confirm">
    <template #valueType="{ data }">
      <span>{{ data.record.valueType?.type }}</span>
    </template>
    <template #required="{ data }">
      <span>{{ data.record.expands?.required ? "是": '否' }}</span>
    </template>
    <template #config="{ data }">
      <OtherConfigInfo :value="data.record.valueType"></OtherConfigInfo>
    </template>
    <j-button>
      <AIcon type="SettingOutlined" />
      配置
    </j-button>
  </DataTableObject>
</template>

<script setup lang="ts" name="InputParams">
import type { PropType } from 'vue';
import DataTypeObjectChild from '../DataTypeObjectChild.vue'
import {
    DataTableObject,
} from 'jetlinks-ui-components';
import { ConstraintSelect, OtherConfigInfo, ValueObject } from '../index'

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

const columns = ref()

type Emits = {
    (e: 'update:value', data: Record<string, any>): void;
    (e: 'change', data: string): void;
};

const emit = defineEmits<Emits>();
const props = defineProps({
    value: {
        type: Object as PropType<Record<string, any>>,
        default: () => {},
    },
    placeholder: {
        type: String,
        default: '请选择',
    },
    options: {
        type: Array as PropType<{ label: string; value: string }[]>,
        default: () => [],
    },
});

const dataSource = ref(props.value);

const change = (v: string) => {
    emit('update:value', { ...props.value, async: dataSource.value });
    emit('change', v);
};

watch(
    () => props.value,
    (newV) => {
      dataSource.value = props.value.inputs;
    },
    { immediate: true },
);

watch(() => JSON.stringify(dataSource.value), () => {
  columns.value = [
    {
      title: '参数标识',
      dataIndex: 'id',
      type: 'text',
      form: {
        required: true,
        rules: [
          { required: true, message: '请输入标识' },
          {
            validator(va:any,value: any) {
              const fieldIndex = va.field.split('.')[1]
              const oldValue = (dataSource!.value || []).filter((_, index) => index != fieldIndex)
              console.log(dataSource!.value)
              const hasId = oldValue.some((item) => item.id === value)
              if (value) {
                if (hasId) {
                  return Promise.reject('该标识存在')
                }
                return Promise.resolve()
              }
              return Promise.reject('请输入标识')
            }
          },
        ]
      }
    },
    { title: '参数名称', dataIndex: 'name', type: 'text', form: { required: true, rules: [{ required: true, message: '请输入名称'}]} },
    {
      title: '填写约束',
      dataIndex: 'required',
      type: 'components',
      width: 100,
      components: {
        name: ConstraintSelect,
      }
    },
    {
      title: '数据类型',
      type: 'components',
      dataIndex: 'valueType',
      components: {
        name: ValueObject,
      },
    },
    {
      title: '其他配置',
      dataIndex: 'config',
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 60
    },
  ]
}, { immediate: true})

const confirm = (v: any) => {
  console.log(v)
  emit('update:value', {
    ...props.value,
    inputs: dataSource.value
  })
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
