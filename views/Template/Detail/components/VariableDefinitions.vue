<!-- 模板内容-变量列表 -->
<template>
    <div class="table-wrapper">
        <a-table
            :columns="columns"
            :data-source="dataSource"
            bordered
            :pagination="false"
        >
            <template #bodyCell="{ column, text, record }">
                <span v-if="column.dataIndex === 'id'">
                    {{ record[column.dataIndex] }}
                </span>
                <template v-if="column.dataIndex === 'name'">
                    <a-input
                        v-model:value="record.name"
                        :class="
                            !record.name || record.name.length > 64
                                ? 'has-error'
                                : ''
                        "
                    />
                    <!-- antd useForm 无table表单校验 手动添加校验 -->
                    <div
                        class="error-text"
                        v-show="!record.name || record.name.length > 64"
                    >
                        <span v-show="!record.name"> {{ $t('components.VariableDefinitions.6401011-0') }} </span>
                        <span v-show="record.name.length > 64">
                            {{ $t('components.VariableDefinitions.6401011-1') }}
                        </span>
                    </div>
                </template>
                <a-select
                    v-if="column.dataIndex === 'type'"
                    v-model:value="record.type"
                    @change="handleTypeChange(record)"
                >
                    <a-select-option value="string">{{ $t('components.VariableDefinitions.6401011-2') }}</a-select-option>
                    <a-select-option value="date">{{ $t('components.VariableDefinitions.6401011-3') }}</a-select-option>
                    <a-select-option value="double">{{ $t('components.VariableDefinitions.6401011-4') }}</a-select-option>
                </a-select>
                <template v-if="column.dataIndex === 'format'">
                    <span v-if="record.type === 'string'">
                        {{ record.format }}
                    </span>
                    <a-select
                        v-if="record.type === 'date'"
                        v-model:value="record.format"
                    >
                        <a-select-option value="timestamp">
                            timestamp
                        </a-select-option>
                        <a-select-option value="yyyy-MM-dd">
                            yyyy-MM-dd
                        </a-select-option>
                        <a-select-option value="yyyy-MM-dd HH:mm:ss">
                            <j-ellipsis>yyyy-MM-dd HH:mm:ss</j-ellipsis>
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-if="record.type === 'double'"
                        v-model:value="record.format"
                    >
                        <template #suffix>
                            <a-tooltip
                                :title="$t('components.VariableDefinitions.6401011-5')"
                            >
                                <AIcon type="QuestionCircleOutlined" />
                            </a-tooltip>
                        </template>
                    </a-input>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
interface IVariable {
    id: string;
    name: string;
    type: string;
    format: string;
}

type Emits = {
    (e: 'update:variableDefinitions', data: IVariable[]): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    variableDefinitions: {
        type: Array as PropType<IVariable[]>,
        default: () => [],
    },
});

const columns = [
    {
        title: $t('components.VariableDefinitions.6401011-6'),
        dataIndex: 'id',
        width: 80,
        ellipsis: true
    },
    {
        title: $t('components.VariableDefinitions.6401011-7'),
        dataIndex: 'name',
        width: 160,
    },
    {
        title: $t('components.VariableDefinitions.6401011-8'),
        dataIndex: 'type',
        // width: 160,
    },
    {
        title: $t('components.VariableDefinitions.6401011-9'),
        dataIndex: 'format',
        width: 240,
    },
];

const dataSource = computed({
    get: () => props.variableDefinitions,
    set: (val) => emit('update:variableDefinitions', val),
});

watch(
    () => dataSource.value,
    (val) => {
        emit('update:variableDefinitions', val);
    },
    { deep: true },
);

const handleTypeChange = (record: IVariable) => {
    switch (record.type) {
        case 'string':
            record.format = '%s';
            break;
        case 'date':
            record.format = 'timestamp';
            break;
        case 'double':
            record.format = '%.2f';
            break;
    }
};
</script>

<style lang="less" scoped>
.table-wrapper {
  background-color: @primary-color;
    .has-error {
        border-color: rgba(255, 77, 79);
        &:focus {
            border-color: rgba(255, 120, 117);
            box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.2);
            border-right-width: 1px !important;
            outline: 0;
        }
    }
    .error-text {
        color: rgba(255, 77, 79);
        font-size: 12px;
    }
}
</style>
