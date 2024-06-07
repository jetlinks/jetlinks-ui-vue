<template>
    <JProTable :request="queryData" :params="params" v-bind="$attrs">
        <template v-for="(_value, name) in $slots" #[name]="slotData">
            <slot :name="name" v-bind="slotData || {}" />
        </template>
        <template #paginationRender>
            <a-pagination
                showQuickJumper
                isShowContent
                showSizeChanger
                :pageSize="pageSize"
                :pageSizeOptions="['12', '24', '48', '96']"
                :current="currentPage"
                :total="dataTotal"
                :show-total="() => `总共 ${dataTotal} 条`"
                @change="handleOnChange"
            />
        </template>
    </JProTable>
</template>

<script setup lang="ts" name="PTable">
const props = withDefaults(
    defineProps<{
        request: (...args: any) => any;
        params: Record<string, any>;
        handleSearch: (params: Record<string, any>) => any;
    }>(),
    {},
);
// 表格数据总数
const dataTotal = ref<number>(0);
// 表格当前属于多少页
const currentPage = ref<number>(1);
// 表格每页显示多少条数据
const pageSize = ref<number>(12);

/**
 * @function handleOnChange 分页器改变的回调事件
 * @param num
 * @param pageSize
 */
const handleOnChange = (num: number, pageSize: number) => {
    const _params = {
        ...props.params,

        // 因为分页器发生改变时会自动改变当前页码和每页条数
        // 因此在这覆盖globSearchParam中的pageIndex和pageSize
        pageIndex: num - 1,
        pageSize: pageSize,
    };
    props.handleSearch(_params);
};

// 为了能够取到请求的条件，需要对请求再包装一层请求
const queryData = async (_params: any) => {
    const resp: any = await props.request(_params);
    if (resp.status === 200) {
        dataTotal.value = resp.result.total;
        currentPage.value = resp.result.pageIndex + 1;
        pageSize.value = resp.result.pageSize;
        return {
            code: resp.status,
            result: resp.result,
            status: resp.status,
        };
    } else {
        return {
            code: 200,
            result: { data: [] },
            status: 200,
        };
    }
};
</script>

<style lang="less" scoped></style>
