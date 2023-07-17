<template>
    <j-form ref="formRef" :model="modelRef">
        <j-table
            :columns="columns"
            :data-source="modelRef.dataSource"
            :pagination="false"
        >
            <template #bodyCell="{ column, text, record, index }">
                <div>
                    <template
                        v-if="['valueType', 'name'].includes(column.dataIndex)"
                    >
                        <span>{{ text }}</span>
                    </template>
                    <template v-else>
                        <j-form-item
                            :name="['dataSource', index, 'value']"
                            :rules="[
                                {
                                    required: !!record.required,
                                    message: '该字段为必填字段',
                                },
                            ]"
                        >
                            <ValueItem
                                v-model:modelValue="record.value"
                                :itemType="record.type"
                                
                                :options="
                                    record.type === 'enum'
                                        ? (
                                              record?.dataType?.elements || []
                                          ).map((item) => {
                                              return {
                                                  label: item.text,
                                                  value: item.value,
                                              };
                                          })
                                        : record.type === 'boolean'
                                        ? [
                                              { label: '是', value: true },
                                              { label: '否', value: false },
                                          ]
                                        : undefined
                                "
                            />
                        </j-form-item>
                    </template>
                </div>
            </template>
        </j-table>
    </j-form>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';

type Emits = {
    (e: 'update:modelValue', data: Record<string, any>[]): void;
};
const _emit = defineEmits<Emits>();

const _props = defineProps({
    modelValue: {
        type: Array as PropType<Record<string, any>[]>,
        default: '',
    },
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

const modelRef = reactive<{
    dataSource: any[];
}>({
    dataSource: [],
});

const formRef = ref<any>(null);

watchEffect(() => {
    modelRef.dataSource = _props?.modelValue || []
})

const onSave = () =>
    new Promise((resolve, reject) => {
        formRef.value?.validate().then((_data: any) => {
            _emit('update:modelValue', modelRef.dataSource)
            resolve(true);
        }).catch(() => {
            reject(false)
        })
    });

defineExpose({ onSave });
</script>

<style lang="less" scoped>
:deep(.ant-form-item) {
    margin: 0 !important;
    height: 30px;
}
</style>