<!-- 表格行新增 - 简单分页组件 -->
<template>
    <div class="pager">
        <j-select v-model:value="myCurrent" style="width: 60px">
            <j-select-option v-for="(val, i) in pageArr" :value="i + 1">
                {{ i + 1 }}
            </j-select-option>
        </j-select>
        <j-pagination
            :pageSize="pageSize"
            v-model:current="myCurrent"
            :total="total"
            style="text-align: center"
        />
    </div>
</template>

<script setup lang="ts" name="RowPagination">
type PageEmits = {
    (e: 'update:pageNum', data: number | string): void;
    (e: 'update:pageSize', data: number | string): void;
};

type PageProps = {
    pageNum: number;
    pageSize: number;
    total: number;
};

const emit = defineEmits<PageEmits>();
const props = defineProps<PageProps>();

const myCurrent = computed({
    get: () => props.pageNum,
    set: (val: number) => {
        emit('update:pageNum', val);
    },
});

const pageArr = computed(() => {
    const maxPageNum = Math.ceil(props.total / props.pageSize);
    return new Array(maxPageNum).fill(1);
});
</script>
<style lang="less" scoped>
.pager {
    display: flex;
    justify-content: center;
    margin: 8px 0;
    .ant-pagination {
        margin-left: 8px;
        :deep(.ant-pagination-item) {
            display: none;
        }
    }
}
</style>
