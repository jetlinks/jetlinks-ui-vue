<template>
    <div class="metadata-type">
        <DataTableTypeSelect v-model:value="type" @change="typeChange" />
        <DataTableArray
            v-if="type === 'array'"
            v-model:value="data.elementType"
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
        />
        <DataTableEnum v-else-if="type === 'enum'" v-model:value="data" />
        <DataTableBoolean v-else-if="type === 'boolean'" v-model:value="data" />
        <DataTableDouble
            v-else-if="['float', 'double'].includes(type)"
            :options="options"
            v-model:value="data"
        />
        <DataTableInteger
            v-else-if="['int', 'long'].includes(type)"
            :options="options"
            v-model:value="data.unit"
        />
        <DataTableFile v-else-if="type === 'file'" v-model:value="data.fileType"/>
        <DataTableDate v-else-if="type === 'date'" v-model:value="data.date"/>
        <DataTableString
            v-else-if="['string', 'password'].includes(type)"
            v-model:value="data.expands.maxLength"
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

const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});

const options = ref<{ label: string; value: string }[]>([]);
const emit = defineEmits(['update:value']);

const type = ref(props.value?.output.type);
const data = ref(cloneDeep(props.value.output));

const typeChange = () => {
    emit('update:value', {
        ...props.value,
        output: { ...data.value, type: type.value }
    });
};

watch(
    () => props.value,
    () => {
        type.value = props.value?.output.type;
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
    () => data.value,
    (newVal) => {
        emit('update:value', {
            ...props.value,
            output: {...newVal, type: type.value},
        });
    },
    { deep: true },
);
</script>

<style scoped>
.metadata-type {
    display: flex;
    gap: 12px;
    align-items: center;
}
</style>
