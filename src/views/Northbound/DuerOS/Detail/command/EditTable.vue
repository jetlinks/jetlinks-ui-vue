<template>
    <div class="inputs">
        <j-form ref="formRef" :model="modelRef">
            <j-table
                rowKey="id"
                :columns="columns"
                :data-source="modelRef.dataSource"
                bordered
                :pagination="false"
            >
                <template #bodyCell="{ column, record, index }">
                    <template v-if="column.dataIndex === 'value'">
                        <j-form-item
                            :name="['dataSource', index, 'value']"
                            :rules="[
                                {
                                    required: record.required,
                                    message:
                                        record.type === 'enum' ||
                                        record.type === 'boolean'
                                            ? $t('command.EditTable.613236-0')
                                            : $t('command.EditTable.613236-1'),
                                },
                            ]"
                        >
                            <ValueItem
                                v-model:modelValue="record.value"
                                :itemType="record.type || record.valueType"
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
                                        : record.type === 'boolean' || record.valueType === 'boolean'
                                        ? [
                                              { label: $t('command.EditTable.613236-2'), value: true },
                                              { label: $t('command.EditTable.613236-3'), value: false },
                                          ]
                                        : undefined
                                "
                                @change="onChange"
                            />
                        </j-form-item>
                    </template>
                    <template v-else>
                        <j-form-item
                            :name="['dataSource', index, column.dataIndex]"
                        >
                            <j-input
                                readonly
                                :bordered="false"
                                v-model:value="record[column.dataIndex]"
                            />
                        </j-form-item>
                    </template>
                </template>
            </j-table>
        </j-form>
    </div>
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
    // {
    //     title: 'ID',
    //     dataIndex: 'id',
    //     with: '33%',
    // },
    {
        title: $t('command.EditTable.613236-4'),
        dataIndex: 'name',
        with: '33%',
    },
    {
        title: $t('command.EditTable.613236-5'),
        dataIndex: 'valueType',
        with: '33%',
    },
    {
        title: $t('command.EditTable.613236-6'),
        dataIndex: 'value',
        with: '34%',
    },
];

const modelRef = reactive<{
    dataSource: any[];
}>({
    dataSource: [],
});
const formRef = ref();

watchEffect(() => {
    modelRef.dataSource = _props.modelValue || [];
});

const onChange = () => {
    _emit('update:modelValue', modelRef.dataSource);
};

const onSave = () =>
    new Promise((resolve, reject) => {
        formRef.value
            .validate()
            .then(() => {
                resolve([...modelRef.dataSource]);
            })
            .catch(() => {
                reject(false);
            });
    });

defineExpose({ onSave });
</script>

<style lang="less" scoped>
</style>