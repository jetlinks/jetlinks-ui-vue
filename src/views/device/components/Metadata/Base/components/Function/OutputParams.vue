<template>
    <div class="metadata-type">
      <div class="metadata-type-select">
        <DataTableTypeSelect v-model:value="type" :allowClear="true" @change="typeChange" />
      </div>
        <DataTableArray
            v-if="type === 'array'"
            placement="bottomRight"
            v-model:value="data.elementType"
            @confirm="valueChange"
        />
        <DataTableObject
            v-else-if="type === 'object'"
            v-model:value="data.properties"
            placement="bottomRight"
            :columns="columns"
            @confirm="valueChange"
            :onAdd="addItem"
        >
          <template #valueType="{ data }">
            <span>{{ TypeStringMap[data.record.valueType?.type] }}</span>
          </template>
          <template #config="{ data }">
            <ConfigModal v-model:value="data.record.valueType" :showOther="false"/>
          </template>
        </DataTableObject>
        <DataTableEnum v-else-if="type === 'enum'"   placement="bottomRight" v-model:value="data" @confirm="valueChange"/>
        <DataTableBoolean v-else-if="type === 'boolean'"  placement="bottomRight"  v-model:value="data" @confirm="valueChange"/>
        <DataTableDouble
            v-else-if="['float', 'double'].includes(type)"
            placement="bottomRight"
            :options="unitOptions"
            v-model:value="data"
            @confirm="valueChange"
        />
        <DataTableInteger
            placement="bottomRight"
            v-else-if="['int', 'long'].includes(type)"
            :options="unitOptions"
            v-model:value="data.unit"
            @confirm="valueChange"
        />
        <DataTableFile v-else-if="type === 'file'"  placement="bottomRight"  v-model:value="data.bodyType" @confirm="valueChange"/>
        <DataTableDate v-else-if="type === 'date'"  placement="bottomRight" v-model:value="data.date" @confirm="valueChange"/>
        <DataTableString
            v-else-if="['string', 'password'].includes(type)"
            placement="bottomRight"
            v-model:value="data.maxLength"
            @confirm="valueChange"
        />
    </div>
</template>

<script setup lang="ts" name="OutPutParams">
import { getUnit } from '@/api/device/instance';
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
  DataTableObject, Form,
} from 'jetlinks-ui-components';

import ConfigModal from '@/views/device/components/Metadata/Base/components/ConfigModal.vue'
import {cloneDeep, omit} from 'lodash-es';
import {
  typeSelectChange,
  TypeStringMap,
  useUnit,
  validatorConfig
} from "@/views/device/components/Metadata/Base/columns";
import Type from './Type.vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()


const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});

const formItemContext = Form.useInjectFormItemContext();
const options = ref<{ label: string; value: string }[]>([]);
const emit = defineEmits(['update:value']);

const type = ref(props.value?.output?.type);
const data = ref(props.value?.output);

const { unitOptions } = useUnit(type)

const typeChange = (e: string) => {
    data.value = typeSelectChange(e)
    emit('update:value', {
        ...props.value,
        output: { ...data.value, type: type.value }
    });
};

const columns = [
  {
    title: $t('Function.OutputParams.6916450-0'),
    dataIndex: 'id',
    type: 'text',
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
              return Promise.reject($t('Function.OutputParams.6916450-1'))
            }
            return Promise.resolve()
          }
          return Promise.reject($t('Function.OutputParams.6916450-2'))
        }
      },
        { max: 64, message: $t('Function.OutputParams.6916450-3') },
        {
          pattern: /^[a-zA-Z0-9_\-]+$/,
          message: $t('Function.OutputParams.6916450-4'),
        },
      ]
    }
  },
  {
    title: $t('Function.OutputParams.6916450-5'),
    dataIndex: 'name',
    type: 'text',
    form: {
      required: true,
      rules: [{
        required: true,
        message: $t('Function.OutputParams.6916450-6')
      },
        { max: 64, message: $t('Function.OutputParams.6916450-3') },
      ]
    }
  },
  {
    title: $t('Function.OutputParams.6916450-7'),
    type: 'components',
    dataIndex: 'valueType',
    components: {
      name: Type,
    },
    form: {
      required: true,
      rules: [{
        validator(_: any, value: any) {
          console.log('validator',value)
          if (!value?.type) {
            return Promise.reject($t('Function.OutputParams.6916450-8'))
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
    title: $t('Function.OutputParams.6916450-9'),
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
        const newObj = omit(newValue.valueType, ['type'])
        const oldObj = omit(oldValue.valueType, ['type'])
        return JSON.stringify(newObj) !== JSON.stringify(oldObj)
      }
      return false
    },
  },
  {
    title: $t('Function.OutputParams.6916450-10'),
    dataIndex: 'action',
    width: 60
  }
]

watch(
    () => props.value,
    () => {
        type.value = props.value?.output?.type;
        data.value = props.value?.output
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
    { immediate: true, deep: true },
);

const addItem = () => {
  return {
    id: undefined,
    name: undefined,
    valueType: {
      type: undefined
    }
  }
}

const valueChange = () => {

  emit('update:value', {
    ...props.value,
    output: {...data.value, type: type.value},
  });
  formItemContext.onFieldChange()
}

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
