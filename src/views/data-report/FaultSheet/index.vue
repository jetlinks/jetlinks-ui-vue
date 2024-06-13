<template>
    <page-container>
        <pro-search
            :columns="tableColumns"
            target="fault-config"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="configRef"
                :columns="tableColumns"
                :request="queryData"
                model="table"
                :params="globParams"
                :gridColumn="3"
                :rowKey="(record: any) => record.id"
                :rowSelection="{
                    selectedRowKeys: state.selectedRowKeys,
                    onChange: selectedRowChange,
                    onSelect: handleRowSelected,
                    onSelectAll: handleSelectAll,
                }"
            >
                <template #headerTitle>
                    <j-space>
                        <PermissionButton
                            :popConfirm="{
                                title: popTitle,
                                onConfirm: () => handleExport(),
                            }"
                        >
                            <AIcon type="ExportOutlined" />
                            导出
                        </PermissionButton>
                    </j-space>
                </template>
                <template #vehicleTypeEnum="{ vehicleTypeEnum }">
                    {{ handleVehicleType(vehicleTypeEnum) }}
                </template>
                <template #orgName="{ orgName }">
                    {{ orgName || '--' }}
                </template>
                <template #faultTime="{ faultTime }">
                    {{ formatDate(faultTime) }}
                </template>
                <template #paginationRender>
                    <a-pagination
                        :showQuickJumper="true"
                        :isShowContent="true"
                        :showSizeChanger="true"
                        :pageSize="pageSize"
                        :pageSizeOptions="['12', '24', '48', '96']"
                        :current="currentPage"
                        :total="dataTotal"
                        :show-total="handleShowTotal"
                        @change="handleOnChange"
                    />
                </template>
            </JProTable>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import { downloadFileByUrl } from '@/utils/utils';
import { faultDataExport, queryFaultData } from '@/api/data-report/faultSheet';
import useFilterAlarmDesc from '@/hook/useFilterAlarmDesc';
import moment from 'moment/moment';
import { onlyMessage } from '@/utils/comm';
import { columns } from './columnConfig';

import {
    formatDate,
    handleSearchByDate,
    handleSearchByDescription,
} from '@/utils/dataReportUtils';
import { EXCEED_EXPORT_TIPS, EXPORT_TIPS } from '@/utils/consts';

const configRef = ref<Record<string, any>>({});
// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

// 表格数据总数
const dataTotal = ref<number>(0);
// 表格当前属于多少页
const currentPage = ref<number>(1);
// 表格每页显示多少条数据
const pageSize = ref<number>(12);

// 导出文件的类型
const type = ref<string>('xlsx');

// 当前分页表格选中的数据项的id
const state = reactive<{ selectedRowKeys: string[] }>({
    selectedRowKeys: [],
});

// 处理导出按钮的提示，无需修改复制即可
const popTitle = computed(() => {
    return state.selectedRowKeys.length === 0
        ? '确认导出全部数据？'
        : '确认导出选中数据？';
});

// 生成请求函数
const { queryDataFactory, dicMap, tableColumns, handleVehicleType } =
    useFilterAlarmDesc(columns, ['dd']);

// 生成请求函数
const queryDataFn = queryDataFactory(queryFaultData, 'faultTime');

// 为了能够取到请求的条件，需要对请求再包装一层请求
const queryData = async (_params: any) => {
    const resp = await queryDataFn(_params);
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
 * @function handleShowTotal 处理分页器的显示总数的格式
 */
const handleShowTotal = () => {
    return `总共 ${dataTotal.value} 条`;
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

/**
 * @function handleSearch 搜索组件的搜索事件
 * @param _params
 */
const handleSearch = (_params: any) => {
    // 如果携带搜索条件时，清空选中的数据项
    if (_params.terms && _params.terms.length > 0) state.selectedRowKeys = [];
    // 处理搜索的字段是时间类型的情况
    handleSearchByDate(_params, ['faultTime']);
    // 处理搜索的字段是故障描述类型的情况
    handleSearchByDescription(_params, tableColumns);
    globParams.value = _params;
};

/**
 * @function handleExport 导出
 */
const handleExport = async () => {
    let _params: any = {};
    // 当部分选中时
    if (state.selectedRowKeys.length > 0) {
        _params = {
            paging: false,
            pageSize:
                state.selectedRowKeys.length > 10000
                    ? 10000
                    : state.selectedRowKeys.length,
            terms: [
                {
                    column: 'id',
                    value: state.selectedRowKeys,
                    termType: 'in',
                },
            ],
            sorts: [{ name: 'faultTime', order: 'desc' }],
        };
    } else {
        _params = {
            paging: false,
            pageSize: dataTotal.value > 10000 ? 10000 : dataTotal.value,
            sorts: [{ name: 'faultTime', order: 'desc' }],
            terms: globParams.value.terms,
        };
    }

    const res = await faultDataExport(type.value, _params);
    if (res.status === 200) {
        const blob = new Blob([res.data], { type: type.value });
        const url = URL.createObjectURL(blob);
        downloadFileByUrl(
            url,
            `车辆故障数据-${moment(new Date()).format('YYYY/MM/DD HH:mm:ss')}`,
            type.value,
        );
        if (
            state.selectedRowKeys?.length > 10000 ||
            (state.selectedRowKeys?.length == 0 && dataTotal.value > 10000)
        ) {
            onlyMessage(EXCEED_EXPORT_TIPS, 'warning');
        } else {
            onlyMessage(EXPORT_TIPS);
        }
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
</script>

<style lang="less" scoped></style>
