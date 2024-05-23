<template>
    <div class="table-title">{{ title }}</div>
    <j-table
        :ref="ref"
        :columns="columns"
        :model="props.model"
        :data-source="data"
        :scroll="scroll"
        :pagination="pagination"
    >
    </j-table>
</template>

<script lang="ts" setup>
const props = defineProps({
    title: {
        type: String,
        default: '',
        required: true,
    },
    ref: {
        type: String,
        default: 'tableRef',
    },
    columns: {
        type: Array,
        default: () => [],
        required: true,
    },
    data: {
        type: Array,
        default: [],
        required: true,
    },
    pagination: {
        type: Object,
        default: {},
        required: true,
    },
    scroll: {
        type: Object,
        default: { y: 500 },
        required: true,
    },
    model: {
        type: String,
        default: 'table',
    },
});
</script>
<style lang="less" scoped>
.table-title {
    font-size: 18px;
    font-weight: 500;
    line-height: 21px;
    color: #191c27;
}

.ant-table-wrapper {
    padding-top: 10px;
}
</style>
