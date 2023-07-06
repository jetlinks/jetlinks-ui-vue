<template>
    <DataTableObject v-model:value="value" :columns="columns" @confirm="confirm">
            <template #valueType="{ data }">
                <span>{{ data.record.valueType?.type }}</span>
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
import { OtherConfigInfo, ValueObject } from '../index'

const columns = [
    { 
        title: '参数标识',
        dataIndex: 'id',
        type: 'text',
        form: {
            required: true,
            rules: [{
                required: true,
                message: '请输入参数标识'
            }]
        }
    },
    { 
        title: '参数名称',
        dataIndex: 'name',
        type: 'text',
        form: {
            required: true,
            rules: [{
                required: true,
                message: '请输入参数标识名称'
            }]
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

const value = ref(props.value.valueType?.properties);

const change = (v: string) => {
    emit('update:value', { ...props.value, async: value.value });
    emit('change', v);
};

const confirm = () => {
  const newObject = value.value.map((item) => {
    const { config, action, ...extra } = item
    return extra
  })

  emit('update:value', {
    ...props.value,
    valueType: {
      properties: newObject,
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
