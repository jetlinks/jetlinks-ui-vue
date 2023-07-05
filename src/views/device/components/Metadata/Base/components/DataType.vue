<template>
    <div class="metadata-type">
      <div class="metadata-type-select">
        <DataTableTypeSelect v-model:value="type" @change="typeChange" />
      </div>
        <DataTableArray
            v-if="type === 'array'"
            v-model:value="_valueType.elementType"
            :unitOptions="options"
            @confirm="valueChange"
        />
        <DataTableObject
            v-else-if="type === 'object'"
            v-model:value="_valueType.properties"
            :columns="[
                { title: '参数标识', dataIndex: 'id', type: 'text', width: 100 },
                { title: '参数名称', dataIndex: 'name', type: 'text', width: 100 },
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
        </DataTableObject>
        <DataTableEnum v-else-if="type === 'enum'" v-model:value="_valueType" @confirm="valueChange"/>
        <DataTableBoolean v-else-if="type === 'boolean'" v-model:value="_valueType" @confirm="valueChange"/>
        <DataTableDouble
            v-else-if="['float', 'double'].includes(type)"
            :options="options"
            v-model:value="_valueType"
            @confirm="valueChange"
        />
        <DataTableInteger
            v-else-if="['int', 'long'].includes(type)"
            :options="options"
            v-model:value="_valueType.unit"
            @confirm="valueChange"
        />
        <DataTableFile v-else-if="type === 'file'" v-model:value="_valueType.fileType" @confirm="valueChange"/>
        <DataTableDate v-else-if="type === 'date'" v-model:value="_valueType.date" @confirm="valueChange"/>
        <DataTableString
            v-else-if="['string', 'password'].includes(type)"
            v-model:value="_valueType.maxLength"
        />
    </div>
</template>

<script setup lang="ts" name="MetadataDataType">
import { getUnit } from '@/api/device/instance';
import {InputParams, ValueObject, OtherConfigInfo, ConstraintSelect} from '../components'
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
import DataTypeObjectChild from './DataTypeObjectChild.vue';
import { cloneDeep } from 'lodash-es';

const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});

const options = ref<{ label: string; value: string }[]>([]);
const emit = defineEmits(['update:value']);

const type = ref(props.value?.valueType?.type);
const elements = ref(props.value?.valueType?.elements);
const _valueType = ref(cloneDeep(props.value.valueType));

const typeChange = (e: string) => {
    console.log(e);
    emit('update:value', {
        ...props.value,
        valueType: { ..._valueType.value, type: e }
    });
};

const valueChange = () => {
  console.log({
    ...props.value,
    valueType: {...(_valueType.value || {}), type: type.value},
  })
  emit('update:value', {
    ...props.value,
    valueType: {...(_valueType.value || {}), type: type.value},
  });
}

watch(
    () => JSON.stringify(props.value),
    () => {
        type.value = props.value?.valueType?.type;
        _valueType.value = props.value?.valueType
        // elements.value = props.value?.valueType.elements;
        if (['float', 'double', 'int', 'long'].includes(type.value)) {
            const res = getUnit().then((res) => {
                if (res.success) {
                    options.value = res.result.map((item) => ({
                        label: item.description,
                        value: item.id,
                    }));
                }
            });
        }
    },
    { immediate: true, deep: true },
);

</script>

<style scoped lang="less">
.metadata-type {
    display: flex;
    gap: 12px;
    align-items: center;

    .metadata-type-select {
      flex: 1;
    }

  :deep(.j-data-table-config--icon) {
    padding-right: 12px;
  }
}
</style>
