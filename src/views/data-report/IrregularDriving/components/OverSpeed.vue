<template>
    <div>
        <pro-search
            :columns="columns"
            target="overSpeed-config"
            @search="handleSearch"
        ></pro-search>
        <full-page>
            <JProTable
                ref="configRef"
                :columns="columns"
                :request="queryData"
                model="table"
                :defaultParams="{
                    sorts: [{ name: 'reportTime', order: 'desc' }],
                }"
                :params="globParams"
                :gridColumn="3"
                :row-selection="rowSelection"
            >
                <template #headerTitle>
                    <j-space>
                        <j-popconfirm
                            title="确认导出？"
                            ok-text="确定"
                            cancel-text="取消"
                            @confirm="handleExport"
                        >
                            <PermissionButton>
                                <AIcon type="ExportOutlined" />
                                导出
                            </PermissionButton>
                        </j-popconfirm>
                    </j-space>
                </template>

                <template #reportTime="{ reportTime }">
                    {{
                        dayjs(Number(reportTime)).format('YYYY-MM-DD HH:mm:ss')
                    }}
                </template>
                <template #orgName="{ orgName }">
                    {{ orgName || '' }}
                </template>
                <template
                    #overSpeedInfoSpeedLimit="{ overSpeedInfoSpeedLimit }"
                >
                    {{ `${overSpeedInfoSpeedLimit || 0}km/h` }}
                </template>
                <template
                    #overSpeedInfoStartOverSpeed="{
                        overSpeedInfoStartOverSpeed,
                    }"
                >
                    {{ `${overSpeedInfoStartOverSpeed || 0}km/h` }}
                </template>
                <template
                    #overSpeedInfoMaximumOverSpeed="{
                        overSpeedInfoMaximumOverSpeed,
                    }"
                >
                    {{ `${overSpeedInfoMaximumOverSpeed || 0}km/h` }}
                </template>
                <template #duration="{ duration }">
                    {{ formatMillisecondsToHourMinute(duration) }}
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
                        :show-total="handleShowTotal"
                        @change="handleOnChange"
                    />
                </template>
            </JProTable>
        </full-page>
    </div>
</template>

<script setup lang="ts">
import { onlyMessage } from '@/utils/comm';
import { downloadFileByUrl } from '@/utils/utils';
import dayjs from 'dayjs';
import { querySpeed, speedExport } from '@/api/data-report/IrregularDriving';
import moment from 'moment';

const configRef = ref<Record<string, any>>({});

const selectIds = ref<Array<number | string>>([]);
// 表格数据总数
const dataTotal = ref<number>(0);
// 表格当前属于多少页
const currentPage = ref<number>(1);
// 表格每页显示多少条数据
const pageSize = ref<number>(12);

// 导出文件的类型
const type = ref<string>('xlsx');

// 全局的搜索参数
const globParams = ref<Record<string, any>>({});

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

// 为了能够取到请求的条件，需要对请求再包装一层请求
const queryData = async (_params: any) => {
    const resp: any = await querySpeed(_params);
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
    speedExport(type.value, _params).then((res: any) => {
        if (res) {
            const blob = new Blob([res.data], { type: type.value });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(
                url,
                `超速报警数据-${moment(new Date()).format(
                    'YYYY/MM/DD HH:mm:ss',
                )}`,
                type.value,
            );
        }
    });
};

const formatMillisecondsToHourMinute = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / 3600000);
    const minutes = Math.floor((milliseconds % 3600000) / 60000);
    if (
        typeof milliseconds === 'number' &&
        isFinite(milliseconds) &&
        milliseconds > 0
    ) {
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
    } else {
        return '0分';
    }
};
const columns = [
    {
        title: '车辆类型',
        dataIndex: 'vehicleTypeEnum',
        key: 'vehicleTypeEnum',
        scopedSlots: true,
        search: {
            type: 'string',
            // options: [
            //     {
            //         label: '内燃柴油机',
            //         value: 'ICDieselEngine',
            //     },
            //     {
            //         label: '内燃汽油机',
            //         value: 'ICGasolineEngine',
            //     },
            //     {
            //         label: '机械柴油机',
            //         value: 'MachineDieselEngine',
            //     },
            //     {
            //         label: '内燃牵引车',
            //         value: 'ICTractor',
            //     },
            // ],
        },
    },
    {
        title: '出厂编号',
        dataIndex: 'factoryNumber',
        key: 'factoryNumber',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '车辆简称',
        dataIndex: 'simpleName',
        key: 'simpleName',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '限速值',
        dataIndex: 'overSpeedInfoSpeedLimit',
        key: 'overSpeedInfoSpeedLimit',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '开始超速值',
        dataIndex: 'overSpeedInfoStartOverSpeed',
        key: 'overSpeedInfoStartOverSpeed',
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '最高超速值',
        dataIndex: 'overSpeedInfoMaximumOverSpeed',
        key: 'overSpeedInfoMaximumOverSpeed',
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '持续时间 ',
        dataIndex: 'duration',
        scopedSlots: true,
        key: 'duration',
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '型号',
        dataIndex: 'modelNumber',
        key: 'modelNumber',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '所属组织',
        dataIndex: 'orgName',
        key: 'orgName',
        scopedSlots: true,
        ellipsis: true,
        search: {
            type: 'string',
        },
    },
    {
        title: '时间',
        dataIndex: 'reportTime',
        key: 'reportTime',
        scopedSlots: true,
        ellipsis: true,
        width: 180,
        search: {
            type: 'time',
        },
    },
];

const rowSelection = {
    onChange: (selectedRowKeys: (string | number)[], selectedRows: any) => {
        console.log(
            `selectedRowKeys: ${selectedRowKeys}`,
            'selectedRows: ',
            selectedRows,
        );
        selectIds.value = selectedRowKeys;
    },
    onSelect: (record: any, selected: boolean, selectedRows: any) => {
        console.log(record, selected, selectedRows);
    },
    onSelectAll: (selected: boolean, selectedRows: any, changeRows: any) => {
        console.log(selected, selectedRows, changeRows);
    },
};

/**
 * 搜索
 * @param param
 */
const handleSearch = (param: any) => {
    globParams.value = param;
};
</script>

<style lang="less" scoped></style>
