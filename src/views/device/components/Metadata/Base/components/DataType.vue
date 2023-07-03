<template>
    <div class="metadata-type">
        <DataTableTypeSelect v-model:value="type" @change="typeChange" />
        <DataTableArray
            v-if="type === 'array'"
            v-model:value="_valueType.elementType"
        />
        <DataTableObject
            v-else-if="type === 'object'"
            v-model:value="_valueType.properties"
            :columns="[
                { title: '参数标识', dataIndex: 'id', type: 'text', width: 100 },
                { title: '参数名称', dataIndex: 'name', type: 'text', width: 100 },
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
        >
            <template #valueType="{ data }">
                {{ data.record.valueType?.type }}
            </template>
            <template #config="{ data }">
                <OtherConfigInfo :value="data.record.valueType"></OtherConfigInfo>
            </template>
        </DataTableObject>
        <DataTableEnum v-else-if="type === 'enum'" v-model:value="_valueType" />
        <DataTableBoolean v-else-if="type === 'boolean'" v-model:value="_valueType" />
        <DataTableDouble
            v-else-if="['float', 'double'].includes(type)"
            :options="options"
            v-model:value="_valueType"
        />
        <DataTableInteger
            v-else-if="['int', 'long'].includes(type)"
            :options="options"
            v-model:value="_valueType.unit"
        />
        <DataTableFile v-else-if="type === 'file'" v-model:value="_valueType.fileType"/>
        <DataTableDate v-else-if="type === 'date'" v-model:value="_valueType.date"/>
        <!-- <DataTableString
            v-else-if="['string', 'password'].includes(type)"
            v-model:value="data.expands.maxLength"
        /> -->
    </div>
</template>

<script setup lang="ts" name="MetadataDataType">
import { getUnit } from '@/api/device/instance';
import { InputParams, ValueObject, OtherConfigInfo } from '../components'
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

watch(
    () => props.value,
    () => {
        type.value = props.value?.valueType.type;
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

watch(
    () => _valueType.value,
    () => {
      let result = {..._valueType.value};
        // if(type.value == 'boolean') {
        //   result = {...data.value}
        // }
        emit('update:value', {
            ...props.value,
            valueType: {...result, type: type.value},
        });
    },
    { deep: true },
);
</script>

<style scoped lang="less">
.metadata-type {
    display: flex;
    gap: 12px;
    align-items: center;

    .j-data-table-config--icon {
        padding-right: 12px;
    }
}
</style>
