<template>
    <DataTableObject v-model:value="value" :columns="columns" @confirm="confirm" placement="bottomRight">
            <template #valueType="{ data }">
                <span>{{ TypeStringMap[data.record.valueType?.type] }}</span>
            </template>
            <template #config="{ data }">
                <ConfigModal v-model:value="data.record.valueType" :showOther="false" />
            </template>
        <PermissionButton
            key="properties"
            :has-permission="hasPermission"
            style="padding-left: 0;"
            type="link"
        >
          <AIcon type="SettingOutlined" />
          {{ $t('Events.ConfigParams.6916456-0') }}
        </PermissionButton>
        </DataTableObject>
</template>

<script setup lang="ts" name="ConfigParams">
import type { PropType } from 'vue';
import {
  DataTableObject, Form,
} from 'jetlinks-ui-components';
import { ValueObject } from '../index'

import ConfigModal from '@/views/device/components/Metadata/Base/components/ConfigModal.vue'
import ModelButton from '@/views/device/components/Metadata/Base/components/ModelButton.vue'
import {omit} from "lodash-es";
import {TypeStringMap, validatorConfig} from "../../columns";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()


const columns = [
    {
        title: $t('Events.ConfigParams.6916456-1'),
        dataIndex: 'id',
        type: 'text',
      placement: 'Left',
        form: {
            required: true,
            rules: [{
                callback(rule:any,value: any, _dataSource: any[]) {
                    if (value) {
                    const field = rule.field.split('.')
                    const fieldIndex = Number(field[1])
                    const hasId = _dataSource.some((item, index) => item.id === value && fieldIndex !== index)
                    if (hasId) {
                        return Promise.reject($t('Events.ConfigParams.6916456-2'))
                    }
                    return Promise.resolve()
                    }
                    return Promise.reject($t('Events.ConfigParams.6916456-3'))
                }
            },
              { max: 64, message: $t('Events.ConfigParams.6916456-4') },
              {
                pattern: /^[a-zA-Z0-9_\-]+$/,
                message: $t('Events.ConfigParams.6916456-5'),
              },
            ]
        }
    },
    {
        title: $t('Events.ConfigParams.6916456-6'),
        dataIndex: 'name',
        type: 'text',
        form: {
            required: true,
            rules: [{
                required: true,
                message: $t('Events.ConfigParams.6916456-7')
            },
              { max: 64, message: $t('Events.ConfigParams.6916456-4') },
            ]
        }
    },
    {
        title: $t('Events.ConfigParams.6916456-8'),
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
                return Promise.reject($t('Events.ConfigParams.6916456-9'))
              }
              return Promise.resolve()
            }
          }]
        },
      control(newValue: any, oldValue: any) {
        return newValue.valueType?.type !== oldValue?.valueType?.type
      },
    },
    {
        title: $t('Events.ConfigParams.6916456-10'),
        dataIndex: 'config',
        form: {
          required: true,
          rules: [{
            callback(rule: any, value: any, dataSource: any[]) {
              const field = rule.field.split('.')
              const fieldIndex = Number(field[1])
              const record = dataSource[fieldIndex]
              return validatorConfig(record.valueType)
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
        title: $t('Events.ConfigParams.6916456-11'),
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
        type: Object,
        default: () => ({}),
    },
    placeholder: {
        type: String,
    },
    options: {
        type: Array as PropType<{ label: string; value: string }[]>,
        default: () => [],
    },
    hasPermission: String,
});

const value = ref(props.value.properties);
const formItemContext = Form.useInjectFormItemContext();

const confirm = (data: any) => {
  console.log('ConfigParams',data)
  const newObject = data.map((item: any) => {
    return omit(item, ['_sortIndex', 'config', 'action'])
  })

  console.log('ConfigParams',newObject)

  emit('update:value', {
    properties: newObject,
    type: 'object',
  })
  formItemContext.onFieldChange()
}

watch(
    () => props.value,
    (newV) => {
        value.value = props.value.properties;
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
