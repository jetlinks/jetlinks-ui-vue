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
                <a-input
                    v-if="column.dataIndex === 'name'"
                    v-model:value="record.name"
                />
                <a-select
                    v-if="column.dataIndex === 'type'"
                    v-model:value="record.type"
                    @change="handleTypeChange(record)"
                >
                    <a-select-option value="string">字符串</a-select-option>
                    <a-select-option value="date">时间</a-select-option>
                    <a-select-option value="double">数字</a-select-option>
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
                            yyyy-MM-dd HH:mm:ss
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-if="record.type === 'double'"
                        v-model:value="record.format"
                    >
                        <template #suffix>
                            <a-tooltip
                                title="格式为：%.xf x代表数字保留的小数位数。当x=0时,代表格式为整数"
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
        title: '变量',
        dataIndex: 'id',
        width: 80,
    },
    {
        title: '名称',
        dataIndex: 'name',
        // width: 160,
    },
    {
        title: '类型',
        dataIndex: 'type',
        // width: 160,
    },
    {
        title: '格式',
        dataIndex: 'format',
        width: 150,
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
            record.format = '%.0f';
            break;
    }
};
</script>

<style lang="less" scoped></style>
