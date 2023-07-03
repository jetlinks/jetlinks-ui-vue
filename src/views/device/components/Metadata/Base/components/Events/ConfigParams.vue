<template>
    <div class="metadata-config-params">
      <div class="metadata-config-value">
        {{ value?.map((item: any) => item.name).join(',') }}
      </div>
        <DataTableObject v-model:value="value" :columns="columns" @confirm="confirm">
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
import { OtherConfigInfo, ValueObject } from '../index'

const columns = [
    { title: '参数标识', dataIndex: 'id', type: 'text' },
    { title: '参数名称', dataIndex: 'name', type: 'text' },
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

const value = ref(props.value.valueType?.properties);

const change = (v: string) => {
    emit('update:value', { ...props.value, async: value.value });
    emit('change', v);
};

const confirm = () => {
  emit('update:value', {
    ...props.value,
    valueType: {
      properties: value.value,
      type: props.value.valueType.type,
    }
  })
}

watch(
    () => props.value,
    (newV) => {
        value.value = props.value.valueType?.properties;
    },
    { immediate: true },
);

</script>

<style scoped lang="less">
.metadata-config-params {
  display: flex;
  gap: 12px;
  align-items: center;
  padding-right: 12px;

  .metadata-config-value {
    flex: 1;
  }
}
</style>
