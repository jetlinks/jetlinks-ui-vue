<template>
    <JProTable
        ref="proTableRef"
        :request="queryData"
        :params="params"
        v-bind="$attrs"
        :rowSelection="{
            selectedRowKeys: state.selectedRowKeys,
            onChange: selectedRowChange,
            onSelect: handleRowSelected,
            onSelectAll: handleSelectAll,
        }"
    >
        <template v-for="(_value, name) in $slots" #[name]="slotProps">
            <slot :name="name" v-bind="slotProps || {}" />
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
    }>(),
    {},
);

const emits = defineEmits<{
    (e: 'update:params', params: any): void;
}>();

const proTableRef = ref();
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
    emits('update:params', _params);
};

// 当前分页表格选中的数据项的id
const state = reactive<{ selectedRowKeys: string[] }>({
    selectedRowKeys: [],
});

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

/**
 * @function selectedRowChange table组件的rowSelection的onChange事件
 * @param selectedRowKeys 选中的数据项的id数组
 * @param selectedRows 选中的数据项的对象数组
 */
const selectedRowChange = (selectedRowKeys: string[], selectedRows: any[]) => {
    if (selectedRowKeys.length === 0 || selectedRows.length === 0) {
        state.selectedRowKeys = [];
    }
};

/**
 * @function handleRowSelected table组件的rowSelection的onSelect事件
 * @param record 当前选中的数据项的对象
 * @param selected 是否选中，用于判断选中还是取消选中
 * @param selectedRows 选中的所有数据项的对象数组
 */
const handleRowSelected = (
    record: any,
    selected: boolean,
    selectedRows: any,
) => {
    if (selected) {
        const index = state.selectedRowKeys.findIndex(
            (item) => item === record.id,
        );
        index === -1 && state.selectedRowKeys.push(record.id);
    } else {
        const index = state.selectedRowKeys.findIndex(
            (item) => item === record.id,
        );
        index !== -1 && state.selectedRowKeys.splice(index, 1);
    }
};

/**
 * @function handleSelectAll table组件的rowSelection的onSelectAll事件
 * @param selected 是否全选，用于判断全选还是取消全选
 * @param selectedRows 选中的所有数据项的对象数组
 * @param changeRows 发生变化的数据项的对象数组
 */
const handleSelectAll = (
    selected: boolean,
    selectedRows: any,
    changeRows: any,
) => {
    if (selected) {
        changeRows.forEach((row: any) => {
            const len = state.selectedRowKeys.length;
            let flag = true;
            for (let i = 0; i < len; i++) {
                if (row.id === state.selectedRowKeys[i]) {
                    flag = false;
                    break;
                }
            }
            flag && state.selectedRowKeys.push(row.id);
        });
    } else {
        changeRows.forEach((row: any) => {
            const index = state.selectedRowKeys.findIndex(
                (item) => item === row.id,
            );
            index !== -1 && state.selectedRowKeys.splice(index, 1);
        });
    }
};

/**
 * 清空已选
 * @param _params
 */
const EmptySelectKeys = () => {
    state.selectedRowKeys = [];
};

defineExpose({
    selectedRowKeys: state.selectedRowKeys,
    EmptySelectKeys,
    dataTotal,
});
</script>

<style lang="less" scoped></style>
