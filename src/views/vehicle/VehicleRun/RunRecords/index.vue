<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="notice-config"
            @search="handleSearch"
        />
        <FullPage>
            <JProTable
                ref="configRef"
                :columns="columns"
                :request="queryData"
                model="table"
                :defaultParams="{
                    sorts: [{ name: 'shutStartMilli', order: 'desc' }],
                }"
                :params="globParams"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onSelect: handleRowSelected,
                    onSelectAll: handleSelectAll,
                    onSelectNone: handleClearSelected,
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
                <template #shutStartMilli="{ shutStartMilli }">
                    {{
                        shutStartMilli
                            ? moment(Number(shutStartMilli)).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : ''
                    }}
                </template>
                <template #shutDownMilli="{ shutDownMilli }">
                    {{
                        shutDownMilli
                            ? moment(Number(shutDownMilli)).format(
                                  'YYYY-MM-DD HH:mm:ss',
                              )
                            : ''
                    }}
                </template>
                <template #drivingTime="{ drivingTime }">
                    {{ formatMillisecondsToHourMinute(Number(drivingTime)) }}
                </template>
                <template #drivenDistance="{ drivenDistance }">
                    {{ `${drivenDistance}km` }}
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
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import { queryVehicleTravelList } from '@/api/vehicle/vehicleManagement';
import { downloadFileByUrl } from '@/utils/utils';
import moment from 'moment';
import { onlyMessage } from '@/utils/comm';
import { useSelectableTable } from '@/hook/useSelectableTable';
import {
    formatDate,
    handleResetSelectedRows,
    handleSearchByDate,
    handleSearchByDescription,
} from '@/utils/dataReportUtils';

const {
    selectedRowKeys,
    handleRowSelected,
    handleSelectAll,
    handleClearSelected,
} = useSelectableTable();

const configRef = ref<Record<string, any>>({});
// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

// 表格数据总数
const dataTotal = ref<number>(0);
// 表格当前属于多少页
const currentPage = ref<number>(1);
// 表格每页显示多少条数据
const pageSize = ref<number>(12);

// 调用useProSearch获取handleSearch方法
// const { handleSearch } = useProSearch(globParams, handleClearSelected);

const type = ref<string>('xlsx');

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
        title: '设备ID',
        dataIndex: 'deviceId',
        key: 'deviceId',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '开始驾驶时间',
        dataIndex: 'shutStartMilli',
        key: 'shutStartMilli',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '结束驾驶时间',
        dataIndex: 'shutDownMilli',
        key: 'shutDownMilli',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'date',
        },
    },
    {
        title: '行驶时长',
        dataIndex: 'drivingTime',
        key: 'drivingTime',
        width: 130,
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '行驶里程',
        dataIndex: 'drivenDistance',
        key: 'drivenDistance',
        width: 150,
        scopedSlots: true,
        ellipsis: true,
    },
    {
        title: '起点位置',
        dataIndex: 'startAddress',
        key: 'startAddress',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '终点位置',
        dataIndex: 'endAddress',
        key: 'endAddress',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '报警次数',
        dataIndex: 'count',
        key: 'count',
        scopedSlots: true,
        ellipsis: true,
        width: 100,
        search: {
            type: 'string',
        },
    },
];

const formatMillisecondsToHourMinute = (milliseconds: number) => {
    if (milliseconds < 0) {
        return '0分';
    }

    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);

    return hours > 0
        ? `${
              hours > 10
                  ? hours.toString().padStart(2, '0')
                  : hours.toString().padStart(1, '0')
          }小时${
              minutes > 9
                  ? minutes.toString().padStart(2, '0')
                  : minutes.toString().padStart(1, '0')
          }分`
        : `${
              minutes > 9
                  ? minutes.toString().padStart(2, '0')
                  : minutes.toString().padStart(1, '0')
          }分`;
};

// 处理导出按钮的提示，无需修改复制即可
const popTitle = computed(() => {
    return selectedRowKeys.value.length === 0
        ? '确认导出全部数据？'
        : '确认导出选中数据？';
});

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

// 为了能够取到请求的条件，需要对请求再包装一层请求
const queryData = async (_params: any) => {
    const resp: any = await queryVehicleTravelList(_params);
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

// 上一次搜索的条件，这里不能使用null，null.property会报错，而{}.property 是 undefined 不会报错
let prevSearchTerms = ref<any>({});
/**
 * 搜索
 * @param _params
 */
const handleSearch = (_params: any) => {
    // if (_params.terms && _params.terms.length > 0) handleClearSelected();
    handleResetSelectedRows(_params, prevSearchTerms, handleClearSelected);

    // 处理搜索的字段是时间类型的情况
    handleSearchByDate(_params, ['shutStartMilli', 'shutDownMilli']);
    globParams.value = _params;
};

/**
 * @function handleExport 导出
 */
const handleExport = async () => {
    let _params: any = {};
    // 当部分选中时
    if (selectedRowKeys.value.length > 0) {
        _params = {
            paging: false,
            pageSize: selectedRowKeys.value?.length,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: [
                {
                    column: 'id',
                    value: selectedRowKeys.value,
                    termType: 'in',
                },
            ],
        };
    } else {
        _params = {
            paging: false,
            pageSize: dataTotal.value > 10000 ? 10000 : dataTotal.value,
            sorts: [{ name: 'createTime', order: 'desc' }],
            terms: globParams.value.terms,
        };
    }
    onlyMessage('导出成功');
};
</script>

<style lang="less" scoped></style>
