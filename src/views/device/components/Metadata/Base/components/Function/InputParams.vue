<template>
  <div class="input-params">
    <div class="input-params-text">
      {{ value?.map((item) => item.name).join(',') }}
    </div>
    <DataTableObject v-model:value="value" :columns="columns">
      <template #valueType="{ data }">
        <span>{{ data.record.valueType?.type }}</span>
      </template>
      <template #config="{ data }">
        <OtherConfigInfo :value="data.record.valueType"></OtherConfigInfo>
      </template>
    </DataTableObject>
  </div>


</template>

<script setup lang="ts" name="InputParams">
import type { PropType } from 'vue';
import DataTypeObjectChild from '../DataTypeObjectChild.vue'
import {
    DataTableObject,
} from 'jetlinks-ui-components';
import { ConstraintSelect, OtherConfigInfo, ValueObject } from '../index'

const columns = [
    { title: '参数标识', dataIndex: 'id', type: 'text' },
    { title: '参数名称', dataIndex: 'name', type: 'text' },
    {
      title: '填写约束',
      dataIndex: 'required',
      type: 'components',
      width: 100,
      components: {
        name: ConstraintSelect,
        props: {
          name: ['expands', 'required']
        }
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
        type: 'components',
        components: {
            name: DataTypeObjectChild
        }
    },
    {
        title: '操作',
        dataIndex: 'action',
        width: 80
    },
];

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

const value = ref(props.value);

const change = (v: string) => {
    emit('update:value', { ...props.value, async: value.value });
    emit('change', v);
};

watch(
    () => props.value,
    (newV) => {
        value.value = props.value.inputs;
    },
    { immediate: true },
);

watch(() => value.value, () => {
    console.log(value.value);
    emit('update:value', {
        ...props.value,
        inputs: value.value
    })
})
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
