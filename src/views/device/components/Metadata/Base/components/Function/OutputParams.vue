<template>
    <div class="metadata-type">
      <div class="metadata-type-select">
        <DataTableTypeSelect v-model:value="type" @change="typeChange" />
      </div>
        <DataTableArray
            v-if="type === 'array'"
            v-model:value="data.elementType"
            @confirm="valueChange"
        />
        <DataTableObject
            v-else-if="type === 'object'"
            v-model:value="data.properties"
            :columns="[
                { title: '参数标识', dataIndex: 'id', type: 'text' },
                { title: '参数名称', dataIndex: 'name', type: 'text' },

                {
                    title: '数据类型',
                    type: 'components',
                    dataIndex: ['valueType', 'type'],
                    components: {
                      name: DataTableTypeSelect,
                    }
                },
                {
                  title: '其他配置',
                  type: 'components',
                  dataIndex: 'valueType',
                  components: {
                    name: DataTypeObjectChild
                  }
                },
                {
                  title: '操作'
                }
            ]"
            @confirm="valueChange"
        />
        <DataTableEnum v-else-if="type === 'enum'" v-model:value="data" @confirm="valueChange"/>
        <DataTableBoolean v-else-if="type === 'boolean'" v-model:value="data" @confirm="valueChange"/>
        <DataTableDouble
            v-else-if="['float', 'double'].includes(type)"
            :options="options"
            v-model:value="data"
            @confirm="valueChange"
        />
        <DataTableInteger
            v-else-if="['int', 'long'].includes(type)"
            :options="options"
            v-model:value="data.unit"
            @confirm="valueChange"
        />
        <DataTableFile v-else-if="type === 'file'" v-model:value="data.fileType" @confirm="valueChange"/>
        <DataTableDate v-else-if="type === 'date'" v-model:value="data.date" @confirm="valueChange"/>
        <DataTableString
            v-else-if="['string', 'password'].includes(type)"
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
    DataTableObject,
} from 'jetlinks-ui-components';

import DataTypeObjectChild from '../DataTypeObjectChild.vue';
import { cloneDeep } from 'lodash-es';
import {typeSelectChange} from "@/views/device/components/Metadata/Base/columns";

const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});

const options = ref<{ label: string; value: string }[]>([]);
const emit = defineEmits(['update:value']);

const type = ref(props.value?.output?.type);
const data = ref(cloneDeep(props.value?.output));

const typeChange = (e: string) => {
    data.value = typeSelectChange(e)
    emit('update:value', {
        ...props.value,
        output: { ...data.value, type: type.value }
    });
};

watch(
    () => props.value,
    () => {
        type.value = props.value?.output?.type;
        data.value = props.value?.output
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

const valueChange = () => {

  emit('update:value', {
    ...props.value,
    output: {...data.value, type: type.value},
  });
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
