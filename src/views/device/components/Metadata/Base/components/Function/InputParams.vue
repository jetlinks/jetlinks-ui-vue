<template>
  <DataTableObject :value="dataSource" :columns="columns" :onAdd="addItem" width="700px" @confirm="confirm">
    <template #valueType="{ data }">
      <span>{{ data.record.valueType?.type }}</span>
    </template>
    <template #required="{ data }">
      <span>{{ data.record.expands?.required ? "是": '否' }}</span>
    </template>
    <template #config="{ data }">
      <ConfigModal v-model:value="data.record" />
    </template>
    <j-button>
      <AIcon type="SettingOutlined" />
      配置
    </j-button>
  </DataTableObject>
</template>

<script setup lang="ts" name="InputParams">
import type { PropType } from 'vue';
import ConfigModal from '@/views/device/components/Metadata/Base/components/ConfigModal.vue'
import {
    DataTableObject,
} from 'jetlinks-ui-components';
import { ConstraintSelect, ValueObject } from '../index'


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
    form: {
      required: true,
      rules: [
        { required: true, message: '请输入标识' },
        {
          callback(rule:any,value: any, _dataSource: any[]) {
            if (value) {
              const field = rule.field.split('.')
              const fieldIndex = Number(field[1])
              const hasId = _dataSource.some((item, index) => item.id === value && fieldIndex !== index)
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
      form: {
        required: true
      }
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
])

const dataSource = ref(props.value);

const change = (v: string) => {
    emit('update:value', { ...props.value, async: dataSource.value });
    emit('change', v);
};

watch(
    () => JSON.stringify(props.value),
    (newV) => {
      console.log('inputParams-change')
      dataSource.value = props.value.inputs;
    },
    { immediate: true },
);

const confirm = (v: any) => {
  console.log('inputParams',v)
  emit('update:value', {
    ...props.value,
    inputs: v
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
