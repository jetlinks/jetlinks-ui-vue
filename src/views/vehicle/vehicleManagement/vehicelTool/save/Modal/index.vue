<template>
    <j-modal
        :maskClosable="false"
        destroy-on-close
        v-model:visible="sbVisible"
        @ok="sbSubmit"
        @cancel="sbClose"
        okText="确定"
        cancelText="取消"
        width="800px"
    >
        <div class="modal-all">
            <pro-search
                :columns="columns"
                target="notice-config"
                @search="handleSearch"
            />
            <JProTable
                ref="configRef"
                :columns="columns"
                :request="queryData"
                model="table"
                :defaultParams="{
                    sorts: [{ name: 'createTime', order: 'desc' }],
                }"
                :params="globParams"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onSelect: handleRowSelected,
                    onSelectAll: handleSelectAll,
                    onSelectNone: handleClearSelected,
                }"
            >
                <template #createTime="slotProps">
                    {{
                        slotProps.createTime
                            ? moment(Number(slotProps.createTime)).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : ''
                    }}
                </template>
                <template #state="slotProps">
                    {{ slotProps.state.text }}
                </template>
                <template #paginationRender>
                    <a-pagination
                        showQuickJumper
                        isShowContent
                        showSizeChanger
                        :pageSize="pageSize"
                        :pageSizeOptions="['5', '12', '20', '50']"
                        :current="currentPage"
                        :total="dataTotal"
                        :show-total="() => `总共 ${dataTotal} 条`"
                        @change="handleOnChange"
                    />
                </template>
            </JProTable>
        </div>
    </j-modal>
</template>
<script lang="ts" setup>
import { queryDevices } from '@/api/vehicle/vehicleManagement';
import { downloadFileByUrl } from '@/utils/utils';
import moment from 'moment';
import { onlyMessage } from '@/utils/comm';
import { EXCEED_EXPORT_TIPS, EXPORT_TIPS } from '@/utils/consts';
import { handleSearchByDate } from '@/utils/dataReportUtils';
import { useSelectableTable } from '@/hook/useSelectableTable';
const sbVisible = ref<boolean>(false);

const {
    selectedRowKeys,
    handleRowSelected,
    handleSelectAll,
    handleClearSelected,
    handleDefaultSelected,
} = useSelectableTable();

const type = ref<string>('xlsx');

const configRef = ref<Record<string, any>>({});
// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

// 表格数据总数
const dataTotal = ref<number>(0);
// 表格当前属于多少页
const currentPage = ref<number>(1);
// 表格每页显示多少条数据
const pageSize = ref<number>(5);

const selectIds = ref<Array<number | string>>([]);
// 为了能够取到请求的条件，需要对请求再包装一层请求
const queryData = async (_params: any) => {
    const resp: any = await queryDevices(_params);
    if (resp.status === 200) {
        dataTotal.value = resp.result.total;
        currentPage.value = resp.result.pageIndex + 1;
        pageSize.value = resp.result.pageSize;
        return {
            // 3.仿造请求结果返回给表格
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
 * @function handleOnChange 分页器改变的回调事件
 * @param num
 * @param pageSize
 */
const handleOnChange = (num: number, pageSize: number) => {
    const _params = {
        ...globParams.value,

        // 因为分页器发生改变时会自动改变当前页码和每页条数
        // 因此在这覆盖globSearchParam中的pageIndex和pageSize
        pageIndex: num - 1,
        pageSize: pageSize,
    };
    handleSearch(_params);
};

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 180,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '设备名称',
        dataIndex: 'name',
        key: 'name',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '时间',
        dataIndex: 'createTime',
        key: 'createTime',
        width: 200,
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '状态',
        dataIndex: 'state',
        key: 'state',
        width: 100,
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
];

/**
 * 搜索
 * @param _params
 */
const handleSearch = (_params: any) => {
    if (_params.terms && _params.terms.length > 0) handleClearSelected();
    handleSearchByDate(_params, ['createTime']);
    globParams.value = _params;
};

/**
 * 显示弹窗
 */
const show = (data: any) => {
    sbVisible.value = true;
    handleDefaultSelected(data);
};

const emit = defineEmits(['success']);

const sbSubmit = () => {
    const devices = toRaw(selectedRowKeys.value);
    emit('success', devices);
    handleDefaultSelected([]);
    sbVisible.value = false;
};
/**
 * 关闭弹窗
 */
const sbClose = () => {
    // emit('success', []);
    handleDefaultSelected([]);
    sbVisible.value = false;
};

defineExpose({
    show: show,
});
</script>
<style lang="less" scoped>
.modal-all {
    width: 100%;
    height: 620px;

    :deep(.jtable-body-spin) {
        min-height: 460px !important;
        height: 460px !important;
        overflow-y: auto !important;
    }
}
</style>
