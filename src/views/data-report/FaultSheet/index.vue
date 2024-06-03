<template>
    <page-container>
        <pro-search
            :columns="columns"
            target="fault-config"
            @search="handleSearch"
        />
        <FullPage>
            <div class="container">
                <div class="export-wrap">
                    <PermissionButton
                        :popConfirm="{
                            title: popTitle,
                            onConfirm: () => handleExport(),
                        }"
                    >
                        <AIcon type="ExportOutlined" />
                        导出
                    </PermissionButton>
                </div>
                <j-table
                    :columns="columns"
                    :data-source="dataSource"
                    :pagination="paginationConf"
                    :row-selection="rowSelection"
                    rowKey="id"
                >
                    <template #bodyCell="{ text, record, index, column }">
                        <template v-if="column.dataIndex === 'orgName'">
                            {{ record?.orgName ? record.orgName : '' }}
                        </template>
                        <template v-if="column.dataIndex === 'faultTime'">
                            {{
                                record?.faultTime
                                    ? dayjs(text).format('YYYY-MM-DD HH:mm:ss')
                                    : ''
                            }}
                        </template>
                    </template>
                </j-table>
            </div>
        </FullPage>
    </page-container>
</template>

<script setup lang="ts">
import { downloadFileByUrl } from '@/utils/utils';
import { faultDataExport, queryFaultData } from '@/api/data-report/faultSheet';
import { useFilterAlarmDesc } from '@/hook/useFilterAlarmDesc';
import moment from 'moment/moment';
import dayjs from 'dayjs';
import { onlyMessage } from '@/utils/comm';
import { columns, mockData } from './columnConfig';

// 页面数据
const dataSource = ref<any[]>();

// 数据总数
const dataTotal = ref<number>(0);
// 当前属于多少页
const currentPage = ref<number>(1);
// 页面每页显示多少条数据
const pageSizeRef = ref<number>(12);

// 全局保存搜索条件，用于分页器触发时携带
let globSearchParam: any = null;

// 选中的数据的id
const selectIds = ref<Array<number | string>>([]);
// 是否选中全部状态
const isSelectAll = ref(false);
// 导出文件的类型
const type = ref<string>('xlsx');

// 处理导出按钮的提示
const popTitle = computed(() => {
    if (dataTotal.value > 10000) {
        return '系统最大导数为10,000，当前数据已超过10,000，请按条件筛选后导出！';
    }
    return selectIds.value.length === 0
        ? '确认导出全部数据？'
        : '确认导出选中数据？';
});

/**
 * @function queryDataFn 请求数据的函数，由useFilterAlarmDesc返回的函数
 * @param _params 请求携带的参数
 */
const queryDataFn = useFilterAlarmDesc(queryFaultData, 'faultTime', mockData);

/**
 * @function queryData 获取数据
 * @param _params 请求携带的参数
 */
const queryData = async (_params: any = { pageIndex: 0, pageSize: 12 }) => {
    const res: any = await queryDataFn(_params);
    if (res.status === 200) {
        dataTotal.value = res.result.total;
        currentPage.value = res.result.pageIndex + 1;
        pageSizeRef.value = res.result.pageSize;
        dataSource.value = res.result.data;
    }
};

// 分页器配置
const paginationConf = computed(() => ({
    current: currentPage.value,
    total: dataTotal.value,
    showQuickJumper: true,
    isShowContent: true,
    showSizeChanger: true,
    pageSize: pageSizeRef.value,
    defaultPageSize: 12,
    pageSizeOptions: ['12', '24', '48', '96'],
    showTotal: () => {
        return `总共 ${dataTotal.value} 条`;
    },
    onChange: (num: number, pageSize: number) => {
        const _params = {
            ...globSearchParam,
            // 因为分页器发生改变时会自动改变当前页码和每页条数
            // 因此在这覆盖globSearchParam中的pageIndex和pageSize
            pageIndex: num - 1,
            pageSize: pageSize,
        };
        handleSearch(_params);
    },
}));

/**
 * 搜索
 * @param _params
 */
const handleSearch = (_params: any) => {
    let params: any;
    // 如果_params.pageIndex或者_params.pageSize为空，
    // 则说明由proSearch的搜索或者重置来触发的函数
    if (!_params.pageIndex || !_params.pageSize) {
        // 如果是重置则需要重置pageSizeRef和currentPage来重置分页器
        pageSizeRef.value = 12;
        currentPage.value = 1;
        params = {
            pageIndex: 0,
            pageSize: 12,
            ..._params,
        };
    } else {
        // 如果存在分页数据，则说明由分页器触发的函数，则直接使用_params
        params = _params;
    }
    globSearchParam = params;
    queryData(params);
};

/**
 * @function handleExport 导出
 */
const handleExport = async () => {
    let _params: any = {};
    if (selectIds.value?.length > 0) {
        _params = {
            terms: [
                {
                    column: 'id',
                    value: selectIds.value,
                    termType: 'in',
                },
            ],
        };
    }
    faultDataExport(type.value, _params).then((res: any) => {
        if (res) {
            const blob = new Blob([res.data], { type: type.value });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(
                url,
                `车辆故障数据-${moment(new Date()).format(
                    'YYYY/MM/DD HH:mm:ss',
                )}`,
                type.value,
            );
        }
    });
};

// 表格中数据被选中的回调
const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
        selectIds.value = selectedRowKeys;
    },
    onSelect: (record: any, selected: boolean, selectedRows: any) => {},
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {},
};
</script>

<style lang="less" scoped>
.container {
    padding: 16px;
    .export-wrap {
        padding-bottom: 16px;
    }
}
</style>
