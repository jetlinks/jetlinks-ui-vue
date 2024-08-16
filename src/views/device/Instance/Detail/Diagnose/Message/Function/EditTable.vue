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
                        v-if="['name'].includes(column.dataIndex)"
                    >
                        <span>{{ text }}</span>
                    </template>
                    <template v-else-if="['valueType'].includes(column.dataIndex)">
                        <span>{{ text.type }}</span>
                    </template>
                    <template v-else>
                        <j-form-item
                            :name="['dataSource', index, 'value']"
                            :rules="[
                                {
                                    required: !!record.required,
                                    message: $t('Function.EditTable.5856011-0'),
                                },
                            ]"
                        >
                            <ValueItem
                                v-model:modelValue="record.value"
                                :itemType="record.valueType.type"
                                
                                :options="
                                    record.valueType.type === 'enum'
                                        ? (
                                              record?.valueType?.elements || []
                                          ).map((item) => {
                                              return {
                                                  label: item.text,
                                                  value: item.value,
                                              };
                                          })
                                        : record.valueType.type  === 'boolean'
                                        ? [
                                              { label: $t('Function.EditTable.5856011-1'), value: true },
                                              { label: $t('Function.EditTable.5856011-2'), value: false },
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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
        title: $t('Function.EditTable.5856011-3'),
        dataIndex: 'name',
        with: '33%',
    },
    {
        title: $t('Function.EditTable.5856011-4'),
        dataIndex: 'valueType',
        with: '33%',
    },
    {
        title: $t('Function.EditTable.5856011-5'),
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
    console.log(modelRef.dataSource);
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