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
                :row-selection="rowSelection"
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

const configRef = ref<Record<string, any>>({});
// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

// 表格数据总数
const dataTotal = ref<number>(0);
// 表格当前属于多少页
const currentPage = ref<number>(1);
// 表格每页显示多少条数据
const pageSize = ref<number>(12);

// 选中的数据的id
const selectIds = ref<Array<number | string>>([]);
// 导出文件的类型
const type = ref<string>('xlsx');

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

// 处理导出按钮的提示，无需修改复制即可
const popTitle = computed(() => {
    if (dataTotal.value > 10000) {
        return '系统最大导数为10,000，当前数据已超过10,000，请按条件筛选后导出！';
    }
    return selectIds.value.length === 0
        ? '确认导出全部数据？'
        : '确认导出选中数据？';
});

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
    handleSearchTerms(_params);
    globParams.value = _params;
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
    } else {
        // 当全不选时，为导出接口添加筛选条件
        if (globParams.value.terms.length > 0) {
            _params.terms = [globParams.value.terms[0]?.terms[0]];
        } else {
            _params.terms = [];
        }
    }

    // 注意这里的请求函数要更换为当前页面的请求函数，以及下方导出的文件名
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

/**
 * 选中行
 */
const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
        selectIds.value = selectedRowKeys;
    },
    onSelect: (record: any, selected: boolean, selectedRows: any) => {},
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {},
};
</script>

<style lang="less" scoped></style>
