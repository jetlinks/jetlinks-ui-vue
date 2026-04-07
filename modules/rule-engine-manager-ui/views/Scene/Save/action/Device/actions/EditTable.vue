<template>
    <EditTable
        ref="tableRef"
        rowKey="id"
        :columns="columns"
        :data-source="dataSource"
        bordered
        :pagination="false"
    >
        <template #name="{record}">
            <j-ellipsis>
                {{ record.name }}
            </j-ellipsis>
        </template>
        <template #valueType="{record}">
            {{ record.valueType.type }}
            <a-tooltip
                v-if="record.type === 'object'"
            >
                <template slot="title">
                {{ $t('FunctionCall.FunctionCall.9093413-0') }}
                </template>

                <AIcon
                type="QuestionCircleOutlined"
                :style="{
                    marginLeft: '5px',
                    cursor: 'help',
                    }"
                />
            </a-tooltip>
        </template>
        <template #value="{record, index}">
            <JEditTableFormItem
                :name="[index, 'value']"
                :required="record.expands.required"
            >
              <FunctionItem
                :builtInList="builtInList"
                v-model:source="record.source"
                v-model:value="record.value"
                v-model:upperKey="record.upperKey"
                :data="record"
                @change="itemChange"
              />
<!--                <j-value-item-->
<!--                    v-model:modelValue='record.value'-->
<!--                    :itemType="itemType(record.valueType.type)"-->
<!--                    :options="record.options"-->
<!--                    :extraProps="{-->
<!--                        style: { width: '100%'}-->
<!--                    }"-->
<!--                />-->
            </JEditTableFormItem>
        </template>
    </EditTable>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import FunctionItem from './FunctionItem.vue';
import { useI18n } from 'vue-i18n'
import {EditTable} from '@jetlinks-web/components'

const { t: $t } = useI18n()
const _props = defineProps({
    value: {
        type: Array as PropType<Record<string, any>[]>,
        default: () => undefined,
    },
    builtInList: {
        type: Array,
        default: () => [],
    },
    functions: {
        type: Array,
        default: () => [],
    },
    columnMap: {
        type: Object,
        default: () => ({})
    }
});

const tableRef = ref()
const emit = defineEmits(['update:value', 'update:columnMap']);

const columns = [
    {
        title: $t('actions.EditTable.9667833-0'),
        dataIndex: 'name',
        with: '33%',
    },
    {
        title: $t('actions.EditTable.9667833-1'),
        dataIndex: 'valueType',
        with: '33%',
    },
    {
        title: $t('actions.EditTable.9667833-2'),
        dataIndex: 'value',
        align: 'center',
        form: {
            required: true,
            rules:[{
                asyncValidator(rule: any, value: any, ...setting: any){
                    const record = setting[1]
                    if (value !== undefined && value !== null && value !== '' || record.expands.required === false) {
                        return Promise.resolve();
                    }
                    const errorMsg = ['enum',].includes(record.valueType.type) ? $t('Device.InvokeFunction.372523-7') : $t('Device.InvokeFunction.372523-4')
                    return Promise.reject(errorMsg);
                }
            }]
        },
    },
];

const dataSource = ref<any[]>([]);
const columnMap = ref(_props.columnMap || {})

watchEffect(() => {
    const list = (_props.functions || []).map((item: any) => {
        const _item = _props.value?.find((i) => i.name === item?.id) || {};
        return {
            ...item,
            ...{
               name: _item.id,
               ..._item.value
            },
            name: item.name,
        };
    });
    dataSource.value = list;
});


const itemType = (type: string) => {

if (type === 'date') {
  return 'time'
}

if (['short', 'byte', 'word'].includes(type)) {
  return 'int'
}

if (['array','object'].includes(type)) {
  return 'object'
}

if (type === 'file') {
  return 'string'
}

return type
}

const itemChange = (v: any, obj: any, option: any, record: any) => {
  const _column = obj.metadata ? obj.column : obj.id
  columnMap.value[record.id] = v.source === 'fixed' ? undefined : _column
}

const onChange = () => {
    const arr = [...dataSource.value]
      .filter((item) => {
        return item.value
    }).map((item) => {
        return {
            name: item.id,
            value: {
                source: item.source,
                upperKey: item.upperKey || item.value,
                value: item.value,
            },
        };
    });
    emit('update:value', arr);
    emit('update:columnMap', columnMap.value);
};

defineExpose({
  validate: async () => {
    const resp = await tableRef.value.validate()
    if (resp) {
        onChange()
    }
    return resp
  }
})
</script>
