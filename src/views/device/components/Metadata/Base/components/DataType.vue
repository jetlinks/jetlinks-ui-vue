<template>
    <div class="metadata-type">
      <div class="metadata-type-select">
        <DataTableTypeSelect v-model:value="type" @change="typeChange" />
      </div>
        <DataTableArray
            v-if="type === 'array'"
            v-model:value="_valueType.elementType"
            :unitOptions="unitOptions"
            placement="bottomRight"
            @confirm="(data) => {valueChange(data, 'array')}"
        />
        <DataTableObject
            v-else-if="type === 'object'"
            :value="_valueType.properties"
            placement="bottomRight"
            :columns="columns"
            @confirm="(data) => {valueChange(data, 'object')}"
        >
            <template #valueType="{ data }">
                {{ TypeStringMap[data.record.valueType?.type] }}
            </template>
            <template #config="{ data }">
              <ConfigModal v-model:value="data.record.valueType" :showOther="false" />
            </template>
        </DataTableObject>
        <DataTableEnum v-else-if="type === 'enum'" v-model:value="_valueType" placement="bottomRight" @confirm="(data) => {valueChange(data, 'enum')}"/>
        <DataTableBoolean v-else-if="type === 'boolean'" v-model:value="_valueType" placement="bottomRight" @confirm="(data) => {valueChange(data, 'boolean')}" />
        <DataTableDouble
            v-else-if="['float', 'double'].includes(type)"
            :options="unitOptions"
            v-model:value="_valueType"
            placement="bottomRight"
            @confirm="(data) => {valueChange(data, 'float')}"
        />
        <DataTableInteger
            v-else-if="['int', 'long'].includes(type)"
            :options="unitOptions"
            v-model:value="_valueType.unit"
            placement="bottomRight"
            @confirm="(data) => {valueChange(data, 'int')}"
        />
        <DataTableFile v-else-if="type === 'file'" v-model:value="_valueType.bodyType" placement="bottomRight" @confirm="(data) => {valueChange(data, 'file')}"/>
        <DataTableDate v-else-if="type === 'date'" v-model:value="_valueType.format" placement="bottomRight" @confirm="(data) => {valueChange(data, 'date')}"/>
        <DataTableString
            v-else-if="['string', 'password'].includes(type)"
            v-model:value="_valueType.maxLength"
            placement="bottomRight"
            @confirm="(data) => {valueChange(data, 'string')}"
        />
    </div>
</template>

<script setup lang="ts" name="MetadataDataType">
import { getUnit } from '@/api/device/instance';
import {DataType, ValueObject} from '../components'
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
import { cloneDeep } from 'lodash-es';
import {handleTypeValue, typeSelectChange, TypeStringMap, useUnit, validatorConfig} from '../columns'
import ConfigModal from './ConfigModal.vue'
import { Form } from 'jetlinks-ui-components'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()


const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});

const formItemContext = Form.useInjectFormItemContext();

const columns = [{
  title: $t('components.DataType.6916446-0'),
  dataIndex: 'id',
  type: 'text',
  width: 100,
  placement: 'Left',
  form: {
    required: true,
    rules: [{
      callback(rule:any,value: any, dataSource: any[]) {
        if (value) {
          const field = rule.field.split('.')
          const fieldIndex = Number(field[1])
          const hasId = dataSource.some((item, index) => item.id === value && fieldIndex !== index)
          if (hasId) {
            return Promise.reject($t('components.DataType.6916446-1'))
          }
          return Promise.resolve()
        }
        return Promise.reject($t('components.DataType.6916446-2'))
      },
    },
      { max: 64, message: $t('components.DataType.6916446-3') },
      {
        pattern: /^[a-zA-Z0-9_\-]+$/,
        message: $t('components.DataType.6916446-4'),
      },
    ]
  }
},
  {
    title: $t('components.DataType.6916446-5'),
    dataIndex: 'name',
    type: 'text',
    width: 100,
    form: {
      required: true,
      rules: [{
        required: true,
        message: $t('components.DataType.6916446-6')
      },
        { max: 64, message: $t('components.DataType.6916446-3') },
      ]
    }
  },
  {
    title: $t('components.DataType.6916446-7'),
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
            return Promise.reject($t('components.DataType.6916446-8'))
          }
          return Promise.resolve()
        }
      }]
    },
    width: 100
  },
  {
    title: $t('components.DataType.6916446-9'),
    dataIndex: 'config',
    width: 100,
    // components: {
    //   name: ConfigModal,
    //   props: {
    //     showOther: false
    //   }
    // },
    form: {
      rules: [{
        callback(rule: any, value: any, dataSource: any[]) {
          const field = rule.field.split('.')
          const fieldIndex = Number(field[1])
          const values = dataSource.find((item, index) => index === fieldIndex)
          return validatorConfig(values?.valueType)
        }
      }]
    },
  },
  {
    title: $t('components.DataType.6916446-10'),
    dataIndex: 'action',
    width: 60
  }]

const options = ref<{ label: string; value: string }[]>([]);
const emit = defineEmits(['update:value']);

const type = ref(props.value?.valueType?.type);
const elements = ref(props.value?.valueType?.elements);
const _valueType = ref(cloneDeep(props.value.valueType));

const typeChange = (e: string) => {

    let obj: any = typeSelectChange(e)
    _valueType.value = obj
    emit('update:value', {
        ...props.value,
        valueType: { ...obj, type: e }
    });
    formItemContext.onFieldChange()
};

const valueChange = (_data: any, _type: string) => {
  const newData = handleTypeValue(_type, _data)
  emit('update:value', {
    ...props.value,
    valueType: {...newData, type: type.value},
  });
  formItemContext.onFieldChange()
}

const { unitOptions } = useUnit(type)

watch(
    () => JSON.stringify(props.value),
    () => {
        type.value = props.value?.valueType?.type;
        _valueType.value = props.value?.valueType
        console.log(props.value)
        // elements.value = props.value?.valueType.elements;
        // if (['float', 'double', 'int', 'long'].includes(type.value)) {
        //     const res = getUnit().then((res) => {
        //         if (res.success) {
        //             options.value = res.result.map((item) => ({
        //                 label: item.description,
        //                 value: item.id,
        //             }));
        //         }
        //     });
        // }
    },
    { immediate: true },
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
