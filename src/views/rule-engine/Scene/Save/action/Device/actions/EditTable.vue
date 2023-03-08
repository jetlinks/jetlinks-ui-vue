<template>
    <j-table
        rowKey="id"
        :columns="columns"
        :data-source="dataSource"
        bordered
        :pagination="false"
    >
        <template #bodyCell="{ column, text, record }">
            <div>
                <template v-if="['valueType', 'name'].includes(column.dataIndex)">
                    <span>{{ text }}</span>
                </template>
                <template v-else>
                    <j-input />
                    <!-- TODO -->
                </template>
            </div>
        </template>
    </j-table>
</template>

<script lang="ts" setup>
import { PropType } from "vue";

type Emits = {
    (e: 'update:modelValue', data: Record<string, any>[]): void;
};
const _emit = defineEmits<Emits>();

const _props = defineProps({
    modelValue: {
        type: Array as PropType<Record<string, any>[]>,
        default: '',
    }
});
const columns = [
    {
        title: '参数名称',
        dataIndex: 'name',
        with: '33%',
    },
    {
        title: '类型',
        dataIndex: 'valueType',
        with: '33%',
    },
    {
        title: '值',
        dataIndex: 'value',
        with: '34%',
    },
];

const dataSource = computed({
    get: () => {
        return _props.modelValue || []
    },
    set: (val: any) => {
        _emit('update:modelValue', val);
    }
})

</script>