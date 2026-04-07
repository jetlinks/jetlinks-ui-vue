<template>
    <a-form ref="formRef" :model="modelRef">
        <a-table
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
                        <a-form-item
                            :name="['dataSource', index, 'value']"
                            :rules="[
                                {
                                    required: !!record.required,
                                    message: $t('Function.EditTable.273732-0'),
                                },
                            ]"
                        >
                            <j-value-item
                                v-model:modelValue="record.value"
                                :itemType="record.valueType.type"
                                style="width: 100%"
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
                                              { label: $t('Function.EditTable.273732-1'), value: true },
                                              { label: $t('Function.EditTable.273732-2'), value: false },
                                          ]
                                        : undefined
                                "
                            />
                        </a-form-item>
                    </template>
                </div>
            </template>
        </a-table>
    </a-form>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

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
        title: $t('Function.EditTable.273732-3'),
        dataIndex: 'name',
        with: '33%',
    },
    {
        title: $t('Function.EditTable.273732-4'),
        dataIndex: 'valueType',
        with: '33%',
    },
    {
        title: $t('Function.EditTable.273732-5'),
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

watch(() => _props?.modelValue, () => {
  modelRef.dataSource = _props?.modelValue || [];
  formRef.value?.clearValidate?.();
}, {
  deep: true,
  immediate: true
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
    height: 38px;
}
</style>
