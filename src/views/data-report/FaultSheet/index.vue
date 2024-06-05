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
                    <span>
                        {{ dayjs(faultTime).format('YYYY-MM-DD HH:mm:ss') }}
                    </span>
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
import dayjs from 'dayjs';
import { onlyMessage } from '@/utils/comm';
import { columns } from './columnConfig';
import { vehicleTypeEnum } from '@/api/data-report/commonApi';

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

const vehicleType = ref<{ label: string; value: string }[]>();

const handleVehicleType = (type: string) => {
    const item = vehicleType.value?.find((item) => item.value === type);
    return item?.label || type;
};

const queryVehicleType = async () => {
    const res = await vehicleTypeEnum();
    if (res.status == 200) {
        vehicleType.value = res.result.map((item: any) => ({
            label: item.text,
            value: item.value,
        }));
    }
};

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
const { queryDataFactory, dicMap, tableColumns } = useFilterAlarmDesc(columns);

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
 * @function handleSearchTerms 处理搜索条件
 * @param _params
 */
const handleSearchTerms = (_params: any) => {
    // 判断是否存在terms,
    if (_params.terms && _params.terms.length > 0) {
        // 判断时间是否已经格式化，避免通过分页器触发的是否再次处理时间戳引发错误
        if (
            _params.terms[0]?.terms &&
            _params.terms[0]?.terms[0].value !== 'number'
        ) {
            if (_params.terms[0]?.terms[0].termType === 'lte') {
                // 时间为小于等于
                const date = _params.terms[0]?.terms[0].value;
                // 转换为秒钟级别的时间戳
                let timeStamp: string | number = dayjs(date).unix();
                // 为时间戳需要加上毫秒999吗，这里最简单的方法就是后端取消所有的毫秒时间戳就不会用前端来处理误差
                timeStamp = Number(String(timeStamp) + '999');
                _params.terms[0].terms[0].value = timeStamp;
            } else if (_params.terms[0]?.terms[0].termType === 'gte') {
                // 时间为大于等于
                const date = _params.terms[0]?.terms[0].value;
                let timeStamp: string | number = dayjs(date).unix();
                timeStamp = Number(String(timeStamp) + '000');
                _params.terms[0].terms[0].value = timeStamp;
            } else if (_params.terms[0]?.terms[0].column === 'description') {
                // 处理请求的参数为告警或故障描述的情况
                // 这个查询条件是因为后端未处理，所以全部交由前端来处理字典和故障描述的映射关系，不要怪我写得烂
                const { termType, value } = _params.terms[0]?.terms[0];
                tableColumns.forEach((column: any) => {
                    if (column.dataIndex === 'description') {
                        column.search.options.forEach((item: any) => {
                            if (item.value === value) {
                                // 替换原本的搜索条件
                                _params.terms[0] = {
                                    terms: [
                                        {
                                            type: 'and',
                                            value: item.alarmDictionaryValue,
                                            termType: termType,
                                            column: 'alarmDictionaryValue',
                                        },
                                        {
                                            type: 'and',
                                            value: item.alarmDictionaryKey,
                                            termType: termType,
                                            column: 'alarmDictionaryKey',
                                        },
                                    ],
                                };
                            }
                        });
                    }
                });
            }
        }
    }
};

/**
 * @function handleSearch 搜索组件的搜索事件
 * @param _params
 */
const handleSearch = (_params: any) => {
    if (_params.terms && _params.terms.length > 0) state.selectedRowKeys = [];
    handleSearchTerms(_params);
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
        )
            onlyMessage('超出10000条:超出上限，已导出10000条', 'warning');
        else onlyMessage('导出成功');
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

onMounted(() => queryVehicleType());
</script>

<style lang="less" scoped></style>
